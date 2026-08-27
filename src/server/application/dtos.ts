import type { Payment } from "../domain/payment";

export interface PaymentDetailsDto {
  id: string;
  correlationId: string;
  amount: number;
  currency: string;
  accountId: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  failureReason: string | null;
}

export function toDetails(payment: Payment): PaymentDetailsDto {
  return {
    id: payment.id,
    correlationId: payment.correlationId,
    amount: payment.money.amount,
    currency: payment.money.currency,
    accountId: payment.accountId,
    status: payment.status,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt ? payment.updatedAt.toISOString() : null,
    failureReason: payment.failureReason,
  };
}
