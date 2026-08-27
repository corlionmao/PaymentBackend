import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CreatePaymentDialog } from "@/components/create-payment-dialog";
import { PaymentDetail } from "@/components/payment-detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  completePayment,
  failPayment,
  listPayments,
  ApiError,
} from "@/lib/payment-api";
import { useSession } from "@/lib/session";
import type { PaymentDetails, PaymentStatus } from "@/lib/types";
import { formatDate, formatMoney, shortId } from "@/lib/utils";

function statusTone(status: PaymentStatus) {
  if (status === "Completed") return "completed" as const;
  if (status === "Failed") return "failed" as const;
  return "pending" as const;
}

export function Ledger() {
  const token = useSession((s) => s.token)!;
  const signOut = useSession((s) => s.signOut);
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<PaymentDetails | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: () => listPayments(token),
  });

  if (paymentsQuery.error instanceof ApiError && paymentsQuery.error.status === 401) {
    signOut();
  }

  const payments = paymentsQuery.data ?? [];
  const stats = useMemo(() => {
    const pending = payments.filter((p) => p.status === "Pending").length;
    const completed = payments.filter((p) => p.status === "Completed");
    const failed = payments.filter((p) => p.status === "Failed").length;
    const volume = completed.reduce((sum, p) => sum + p.amount, 0);
    return { pending, completed: completed.length, failed, volume, total: payments.length };
  }, [payments]);

  const completeMut = useMutation({
    mutationFn: (id: string) => completePayment(token, id),
    onSuccess: (payment) => {
      toast.success("Payment completed");
      setSelected(payment);
      void queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const failMut = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      failPayment(token, id, reason),
    onSuccess: (payment) => {
      toast.success("Payment marked failed");
      setSelected(payment);
      void queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Operations</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Ledger
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Create idempotent payments, inspect status, and drive the pending
            state machine to completed or failed.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="self-start sm:self-auto">
          <Plus className="size-4" />
          New payment
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="In flight" value={String(stats.pending)} hint="Pending" />
        <Stat label="Cleared" value={String(stats.completed)} hint="Completed" />
        <Stat label="Returned" value={String(stats.failed)} hint="Failed" />
        <Stat
          label="Cleared volume"
          value={formatMoney(stats.volume, "USD")}
          hint="Completed, mixed FX"
          tabular
        />
      </div>

      <Card className="overflow-hidden rounded-xl">
        <div className="hidden grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr_0.7fr] gap-3 border-b border-border px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-subtle md:grid">
          <span>Payment</span>
          <span>Account</span>
          <span>Amount</span>
          <span>Created</span>
          <span>Status</span>
        </div>
        {paymentsQuery.isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-elevated" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">
            No payments yet. Issue the first instruction.
          </p>
        ) : (
          <ul>
            {payments.map((payment) => (
              <li key={payment.id}>
                <button
                  type="button"
                  onClick={() => setSelected(payment)}
                  className="grid w-full grid-cols-1 gap-1 border-b border-border px-5 py-4 text-left last:border-b-0 hover:bg-elevated/60 md:grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr_0.7fr] md:items-center md:gap-3"
                >
                  <div>
                    <p className="font-mono text-sm">{shortId(payment.id)}</p>
                    <p className="font-mono text-[11px] text-subtle">
                      corr {shortId(payment.correlationId)}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted">
                    acct {shortId(payment.accountId)}
                  </p>
                  <p className="font-mono text-sm tabular-nums">
                    {formatMoney(payment.amount, payment.currency)}
                  </p>
                  <p className="text-xs text-muted">{formatDate(payment.createdAt)}</p>
                  <div>
                    <Badge tone={statusTone(payment.status)}>{payment.status}</Badge>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <CreatePaymentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        token={token}
        onCreated={(payment) => {
          setSelected(payment);
          void queryClient.invalidateQueries({ queryKey: ["payments"] });
        }}
      />

      <PaymentDetail
        payment={selected}
        onClose={() => setSelected(null)}
        onComplete={() => selected && completeMut.mutate(selected.id)}
        onFail={(reason) => selected && failMut.mutate({ id: selected.id, reason })}
        busy={completeMut.isPending || failMut.isPending}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tabular,
}: {
  label: string;
  value: string;
  hint: string;
  tabular?: boolean;
}) {
  return (
    <Card className="rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</p>
      <p
        className={`mt-2 font-display text-2xl font-medium tracking-tight ${tabular ? "font-mono text-xl" : ""}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Card>
  );
}
