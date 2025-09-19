"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

const PAYMENT_METHOD_ICONS = {
  easypaisa: "💳",
  jazzcash: "📱",
  nayapay: "🏦",
  sadapay: "💎",
  bank: "🏛️",
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const STATUS_ICONS = {
  pending: Clock,
  completed: CheckCircle,
  failed: XCircle,
  cancelled: XCircle,
};

export function PaymentHistory() {
  const { user } = useUser();
  
  const paymentHistory = useQuery(
    api.users.getPaymentHistory,
    user?.id ? { userId: user.id } : "skip"
  ) || [];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your payment transactions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Please sign in to view your payment history
          </p>
        </CardContent>
      </Card>
    );
  }

  if (paymentHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your payment transactions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payments yet</p>
            <p className="text-sm text-muted-foreground">
              Start sending or receiving payments to see them here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          {paymentHistory.length} transaction{paymentHistory.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentHistory.map((payment) => {
            const StatusIcon = STATUS_ICONS[payment.status as keyof typeof STATUS_ICONS] || Clock;
            const isSent = payment.type === "sent";
            
            return (
              <div
                key={payment._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    {isSent ? (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={payment.otherUser?.imageUrl || "/vercel.svg"}
                        alt={payment.otherUser?.name || "Unknown User"}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="font-medium truncate">
                        {payment.otherUser?.name || "Unknown User"}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl">
                        {PAYMENT_METHOD_ICONS[payment.paymentMethod as keyof typeof PAYMENT_METHOD_ICONS] || "💳"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {payment.paymentMethod}
                      </span>
                    </div>
                    
                    {payment.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {payment.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    isSent ? "text-red-600" : "text-green-600"
                  }`}>
                    {isSent ? "-" : "+"}{formatAmount(payment.amount)}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={STATUS_COLORS[payment.status as keyof typeof STATUS_COLORS]}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {payment.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
