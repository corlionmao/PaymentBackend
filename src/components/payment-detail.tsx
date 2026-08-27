import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { PaymentDetails } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";

export function PaymentDetail({
  payment,
  onClose,
  onComplete,
  onFail,
  busy,
}: {
  payment: PaymentDetails | null;
  onClose: () => void;
  onComplete: () => void;
  onFail: (reason: string) => void;
  busy: boolean;
}) {
  const [reason, setReason] = useState("Insufficient funds");

  return (
    <Sheet open={!!payment} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {payment ? (
          <div className="flex h-full flex-col">
            <SheetTitle>Payment</SheetTitle>
            <SheetDescription className="mt-1 font-mono text-xs">
              {payment.id}
            </SheetDescription>

            <div className="mt-8 space-y-5">
              <div>
                <p className="font-display text-3xl font-medium tabular-nums tracking-tight">
                  {formatMoney(payment.amount, payment.currency)}
                </p>
                <div className="mt-3">
                  <Badge
                    tone={
                      payment.status === "Completed"
                        ? "completed"
                        : payment.status === "Failed"
                          ? "failed"
                          : "pending"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <Field label="Correlation" value={payment.correlationId} />
              <Field label="Account" value={payment.accountId} />
              <Field label="Created" value={formatDate(payment.createdAt)} />
              <Field
                label="Updated"
                value={payment.updatedAt ? formatDate(payment.updatedAt) : "—"}
              />
              {payment.failureReason ? (
                <Field label="Failure" value={payment.failureReason} />
              ) : null}
            </div>

            {payment.status === "Pending" ? (
              <div className="mt-auto space-y-3 pt-8">
                <Button className="w-full" onClick={onComplete} disabled={busy}>
                  Complete
                </Button>
                <div className="space-y-2">
                  <Label htmlFor="reason">Failure reason</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => onFail(reason)}
                  disabled={busy}
                >
                  Mark failed
                </Button>
              </div>
            ) : (
              <p className="mt-auto pt-8 text-sm text-muted">
                Terminal state. Transitions are only allowed from Pending.
              </p>
            )}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</p>
      <p className="mt-1 break-all font-mono text-xs text-fg">{value}</p>
    </div>
  );
}
