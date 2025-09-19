"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Send, CreditCard, Banknote } from "lucide-react";
import Image from "next/image";

interface SendPaymentDialogProps {
  children: React.ReactNode;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
  channelId?: string;
}

const PAYMENT_METHOD_ICONS = {
  easypaisa: "💳",
  jazzcash: "📱",
  nayapay: "🏦",
  sadapay: "💎",
  bank: "🏛️",
};

export function SendPaymentDialog({ 
  children, 
  receiverId, 
  receiverName, 
  receiverImage,
  channelId 
}: SendPaymentDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>(""); // receiver's method type
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get receiver's full payment details to pay manually
  const receiverPaymentMethods = useQuery(
    api.users.getReceiverPaymentDetails,
    { userId: receiverId }
  ) || [];

  const createPayment = useMutation(api.users.createPayment);

  const handleSendPayment = async () => {
    if (!user?.id) return;

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!selectedMethod) {
      setError("Please select which receiver method you paid to");
      return;
    }

    if (receiverPaymentMethods.length === 0) {
      setError("This user hasn't set up any payment methods yet");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create a pending payment record for receiver to confirm later
      await createPayment({
        senderId: user.id,
        receiverId,
        amount: amountNum,
        currency: "PKR",
        paymentMethod: selectedMethod,
        description: description.trim() || undefined,
        channelId,
      });

      // Optionally post a chat message to the channel
      try {
        if (channelId) {
          const { default: streamClient } = await import("@/lib/stream");
          const channel = streamClient.channel("messaging", channelId);
          await channel.sendMessage({
            text: `Payment submitted: PKR ${amountNum.toFixed(2)} via ${selectedMethod}. Waiting for receiver confirmation. Check settings to confirm the payment. GROUPLYY.`,
          });
        }
      } catch (e) {
        // non-blocking
      }

      // Reset form
      setAmount("");
      setDescription("");
      setSelectedMethod("");
      setOpen(false);
    } catch (e: any) {
      setError(e.message || "Failed to send payment");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return numericValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Payment
          </DialogTitle>
          <DialogDescription>
            Send money to {receiverName}
          </DialogDescription>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Receiver Info */}
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Image
              src={receiverImage || "/vercel.svg"}
              alt={receiverName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{receiverName}</div>
              <div className="text-sm text-muted-foreground">
                {receiverPaymentMethods.length > 0 
                  ? `${receiverPaymentMethods.length} payment method(s) available`
                  : "No payment methods set up"
                }
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (PKR)</label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="pl-10"
                type="text"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this payment for?"
            />
          </div>

          {/* Receiver's methods: show full details, user picks the one they used */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select receiver method you paid to</label>
            {receiverPaymentMethods.length > 0 ? (
              <div className="space-y-2">
                {receiverPaymentMethods.map((method) => (
                  <label
                    key={method._id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                      selectedMethod === method.methodType ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.methodType}
                      checked={selectedMethod === method.methodType}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="text-primary"
                    />
                    <div className="text-2xl">
                      {PAYMENT_METHOD_ICONS[method.methodType as keyof typeof PAYMENT_METHOD_ICONS] || "💳"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{method.methodName}</div>
                      <div className="text-xs text-muted-foreground">
                        {method.methodType}
                        {method.bankName ? ` • ${method.bankName}` : ""}
                        {method.iban ? ` • ${method.iban}` : ""}
                        {method.accountNumber ? ` • ${method.accountNumber}` : ""}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2" />
                <p>This user has no payment methods set up</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendPayment}
            disabled={!amount || !selectedMethod || isLoading || receiverPaymentMethods.length === 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
