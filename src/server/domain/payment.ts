import { ArgumentError, InvalidOperationError } from "./errors";
import { Money } from "./money";

export type PaymentStatus = "Pending" | "Completed" | "Failed";

export class Payment {
  readonly id: string;
  readonly correlationId: string;
  readonly money: Money;
  readonly accountId: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date | null;
  failureReason: string | null;

  private constructor(input: {
    id: string;
    correlationId: string;
    money: Money;
    accountId: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date | null;
    failureReason: string | null;
  }) {
    this.id = input.id;
    this.correlationId = input.correlationId;
    this.money = input.money;
    this.accountId = input.accountId;
    this.status = input.status;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.failureReason = input.failureReason;
  }

  static initialize(correlationId: string, money: Money, accountId: string) {
    if (!correlationId) {
      throw new ArgumentError("CorrelationId is required.");
    }
    if (!accountId) {
      throw new ArgumentError("AccountId is required.");
    }
    return new Payment({
      id: crypto.randomUUID(),
      correlationId,
      money,
      accountId,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: null,
      failureReason: null,
    });
  }

  static rehydrate(input: {
    id: string;
    correlationId: string;
    amount: number;
    currency: string;
    accountId: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date | null;
    failureReason: string | null;
  }) {
    return new Payment({
      id: input.id,
      correlationId: input.correlationId,
      money: new Money(Number(input.amount), input.currency),
      accountId: input.accountId,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      failureReason: input.failureReason,
    });
  }

  complete() {
    this.ensurePending("complete");
    this.status = "Completed";
    this.failureReason = null;
    this.updatedAt = new Date();
  }

  fail(reason: string) {
    this.ensurePending("fail");
    if (!reason?.trim()) {
      throw new ArgumentError("Failure reason is required.");
    }
    this.status = "Failed";
    this.failureReason = reason.trim();
    this.updatedAt = new Date();
  }

  private ensurePending(operation: string) {
    if (this.status !== "Pending") {
      throw new InvalidOperationError(
        `Cannot ${operation} a payment that is ${this.status}.`,
      );
    }
  }
}
