export type PaymentStatus = "Pending" | "Completed" | "Failed";
export type Currency = "USD" | "EUR" | "GBP";

export interface PaymentDetails {
  id: string;
  correlationId: string;
  amount: number;
  currency: Currency;
  accountId: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string | null;
  failureReason: string | null;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface CreatePaymentInput {
  correlationId: string;
  amount: number;
  currency: Currency;
  accountId: string;
}
