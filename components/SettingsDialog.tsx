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
import { AlertCircle, Plus, Trash2, Edit, CreditCard, Banknote } from "lucide-react";
import Image from "next/image";
import { PaymentHistory } from "./PaymentHistory";
import { useEffect } from "react";

interface SettingsDialogProps {
  children: React.ReactNode;
}

const PAYMENT_METHODS = [
  { id: "easypaisa", name: "EasyPaisa", icon: "💳" },
  { id: "jazzcash", name: "JazzCash", icon: "📱" },
  { id: "nayapay", name: "NayaPay", icon: "🏦" },
  { id: "sadapay", name: "SadaPay", icon: "💎" },
  { id: "bank", name: "Bank Transfer", icon: "🏛️" },
];

const PAKISTANI_BANKS = [
  "Allied Bank Limited",
  "Askari Bank Limited",
  "Bank Alfalah Limited",
  "Bank Al-Habib Limited",
  "Bank of Punjab",
  "Citibank N.A.",
  "Dubai Islamic Bank Pakistan Limited",
  "Faysal Bank Limited",
  "Habib Bank Limited (HBL)",
  "JS Bank Limited",
  "MCB Bank Limited",
  "Meezan Bank Limited",
  "National Bank of Pakistan",
  "Samba Bank Limited",
  "Silkbank Limited",
  "Soneri Bank Limited",
  "Standard Chartered Bank (Pakistan) Limited",
  "Summit Bank Limited",
  "United Bank Limited (UBL)",
  "Bank of Khyber",
  "First Women Bank Limited",
  "Industrial Development Bank of Pakistan",
  "Khushhali Microfinance Bank Limited",
  "Mobilink Microfinance Bank Limited",
  "Telenor Microfinance Bank Limited",
];

export function SettingsDialog({ children }: SettingsDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "payments" | "history" | "pendings">("profile");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Payment form state
  const [methodType, setMethodType] = useState("");
  const [methodName, setMethodName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");
  const [isPakResident, setIsPakResident] = useState(true);
  const [isDefault, setIsDefault] = useState(false);

  // Queries and mutations
  const paymentMethods = useQuery(
    api.users.getUserPaymentMethods,
    user?.id ? { userId: user.id } : "skip"
  ) || [];

  const addPaymentMethod = useMutation(api.users.addPaymentMethod);
  const updatePaymentMethod = useMutation(api.users.updatePaymentMethod);
  const deletePaymentMethod = useMutation(api.users.deletePaymentMethod);
  const pendingPayments = useQuery(
    api.users.getPendingPaymentsToMe,
    user?.id ? { userId: user.id } : "skip"
  ) || [];
  const setPendingPaymentStatus = useMutation(api.users.setPendingPaymentStatus);

  const resetForm = () => {
    setMethodType("");
    setMethodName("");
    setAccountNumber("");
    setIban("");
    setBankName("");
    setIsPakResident(true);
    setIsDefault(false);
    setError(null);
  };

  const handleAddPayment = async () => {
    if (!user?.id) return;

    if (!methodType || !methodName || !accountNumber) {
      setError("Please fill in all required fields");
      return;
    }

    if (methodType === "bank" && !iban) {
      setError("IBAN is required for bank transfers");
      return;
    }

    try {
      setError(null);
      await addPaymentMethod({
        userId: user.id,
        methodType,
        methodName,
        accountNumber,
        iban: methodType === "bank" ? iban : undefined,
        bankName: methodType === "bank" ? bankName : undefined,
        isDefault,
      });

      resetForm();
      setShowAddPayment(false);
    } catch (e: any) {
      setError(e.message || "Failed to add payment method");
    }
  };

  const handleEditPayment = async () => {
    if (!editingMethod) return;

    try {
      setError(null);
      await updatePaymentMethod({
        methodId: editingMethod._id,
        methodName,
        accountNumber,
        iban: methodType === "bank" ? iban : undefined,
        bankName: methodType === "bank" ? bankName : undefined,
        isDefault,
      });

      resetForm();
      setEditingMethod(null);
    } catch (e: any) {
      setError(e.message || "Failed to update payment method");
    }
  };

  const handleDeletePayment = async (methodId: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    try {
      setError(null);
      await deletePaymentMethod({ methodId: methodId as any });
    } catch (e: any) {
      setError(e.message || "Failed to delete payment method");
    }
  };

  const startEdit = (method: any) => {
    setEditingMethod(method);
    setMethodType(method.methodType);
    setMethodName(method.methodName);
    setAccountNumber(method.accountNumber);
    setIban(method.iban || "");
    setBankName(method.bankName || "");
    if (method.methodType === "bank") {
      setIsPakResident(method.bankName ? PAKISTANI_BANKS.includes(method.bankName) : true);
    } else {
      setIsPakResident(true);
    }
    setIsDefault(method.isDefault);
    setShowAddPayment(true);
  };

  const cancelEdit = () => {
    resetForm();
    setEditingMethod(null);
    setShowAddPayment(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and payment methods
          </DialogDescription>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "profile" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "payments" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "history" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab("pendings")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "pendings" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Payment Pendings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Image
                src={user?.imageUrl || "/vercel.svg"}
                alt={user?.fullName || "User"}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{user?.fullName}</h3>
                <p className="text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Profile information is managed by Clerk. To update your profile, click on your avatar in the sidebar.
            </p>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <Button
                onClick={() => {
                  resetForm();
                  setShowAddPayment(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Payment Method
              </Button>
            </div>

            {/* Add/Edit Payment Form */}
            {showAddPayment && (
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">
                  {editingMethod ? "Edit Payment Method" : "Add New Payment Method"}
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <select
                      value={methodType}
                      onChange={(e) => setMethodType(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      disabled={!!editingMethod}
                    >
                      <option value="">Select method</option>
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.icon} {method.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      value={methodName}
                      onChange={(e) => setMethodName(e.target.value)}
                      placeholder="e.g., EasyPaisa - 03001234567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number / Phone Number</label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number or phone number"
                  />
                </div>

                {methodType === "bank" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">IBAN</label>
                        <Input
                          value={iban}
                          onChange={(e) => setIban(e.target.value)}
                          placeholder="PK36SCBL0000001123456702"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Live in Pakistan?</label>
                        <select
                          value={isPakResident ? "yes" : "no"}
                          onChange={(e) => setIsPakResident(e.target.value === "yes")}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    {isPakResident ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bank Name (Pakistan)</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select bank</option>
                          {PAKISTANI_BANKS.map((bank) => (
                            <option key={bank} value={bank}>
                              {bank}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bank Name (International)</label>
                        <Input
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="Enter your bank name"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium">
                    Set as default payment method
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={editingMethod ? handleEditPayment : handleAddPayment}
                    disabled={!methodType || !methodName || !accountNumber}
                  >
                    {editingMethod ? "Update" : "Add"} Payment Method
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Methods List */}
            <div className="space-y-3">
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div
                    key={method._id}
                    className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {PAYMENT_METHODS.find(m => m.id === method.methodType)?.icon || "💳"}
                      </div>
                      <div>
                        <div className="font-medium">{method.methodName}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.methodType === "bank" ? method.bankName : method.methodType}
                          {method.isDefault && " • Default"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(method)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePayment(method._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payment methods added yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add a payment method to start sending and receiving payments
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <PaymentHistory />
          </div>
        )}

        {activeTab === "pendings" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Payments Waiting for Your Confirmation</h3>
            {pendingPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending payments.</p>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((p: any) => (
                  <div key={p._id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">From: {p.sender?.name || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground">Amount: PKR {p.amount.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Method: {p.paymentMethod}</div>
                        {p.description && (
                          <div className="text-xs text-muted-foreground">Note: {p.description}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setPendingPaymentStatus({ paymentId: p._id, actorId: user?.id || "", action: "confirm" })}
                        >
                          Mark Completed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPendingPaymentStatus({ paymentId: p._id, actorId: user?.id || "", action: "not_received" })}
                        >
                          Not Received
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setPendingPaymentStatus({ paymentId: p._id, actorId: user?.id || "", action: "cancel" })}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open("mailto:support@grouplyy.app?subject=Payment%20Support&body=Payment%20ID:%20" + p._id, "_blank");
                        }}
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
