import { ArgumentError } from "./errors";

const ALLOWED = new Set(["USD", "EUR", "GBP"]);

export class Money {
  readonly amount: number;
  readonly currency: string;

  constructor(amount: number, currency: string) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ArgumentError("Amount must be greater than zero.");
    }
    if (!ALLOWED.has(currency)) {
      throw new ArgumentError("Currency must be one of: USD, EUR, GBP.");
    }
    this.amount = amount;
    this.currency = currency;
  }
}
