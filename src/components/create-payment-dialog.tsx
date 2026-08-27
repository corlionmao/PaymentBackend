import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPayment } from "@/lib/payment-api";
import type { Currency, PaymentDetails } from "@/lib/types";

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP"];

export function CreatePaymentDialog({
  open,
  onOpenChange,
  token,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  onCreated: (payment: PaymentDetails) => void;
}) {
  const [amount, setAmount] = useState("250.00");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [accountId, setAccountId] = useState<string>(() => crypto.randomUUID());
  const [correlationId, setCorrelationId] = useState<string>(() => crypto.randomUUID());
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = Number(amount);
    setPending(true);
    try {
      const payment = await createPayment(token, {
        amount: parsed,
        currency,
        accountId,
        correlationId,
      });
      toast.success("Instruction accepted");
      onCreated(payment);
      onOpenChange(false);
      setCorrelationId(crypto.randomUUID());
      setAccountId(crypto.randomUUID());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>New payment</DialogTitle>
        <DialogDescription>
          Correlation IDs are unique. Replaying the same id returns the original
          payment without a second debit.
        </DialogDescription>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountId">Account id</Label>
            <Input
              id="accountId"
              className="font-mono text-xs"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correlationId">Correlation id</Label>
            <Input
              id="correlationId"
              className="font-mono text-xs"
              value={correlationId}
              onChange={(e) => setCorrelationId(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Submitting…" : "Submit instruction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
