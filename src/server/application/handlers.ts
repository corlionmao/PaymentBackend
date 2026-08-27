import { Money } from "../domain/money";
import { Payment } from "../domain/payment";
import { NotFoundError } from "../domain/errors";
import { generateToken } from "../infrastructure/jwt";
import {
  addPayment,
  getByCorrelationId,
  getById,
  listPayments,
  savePayment,
} from "../infrastructure/payment-repository";
import { toDetails } from "./dtos";

const SEED_USER = "admin";
const SEED_PASSWORD = "Password123!";

export async function handleLogin(username: string, password: string) {
  if (username !== SEED_USER || password !== SEED_PASSWORD) {
    return { succeeded: false as const, token: null };
  }
  const token = await generateToken(username);
  return { succeeded: true as const, token };
}

export async function handleCreatePayment(input: {
  correlationId: string;
  amount: number;
  currency: string;
  accountId: string;
}) {
  const existing = await getByCorrelationId(input.correlationId);
  if (existing) {
    return { payment: toDetails(existing), created: false };
  }
  const money = new Money(input.amount, input.currency);
  const payment = Payment.initialize(input.correlationId, money, input.accountId);
  await addPayment(payment);
  return { payment: toDetails(payment), created: true };
}

export async function handleGetPayment(id: string) {
  const payment = await getById(id);
  return payment ? toDetails(payment) : null;
}

export async function handleListPayments() {
  const payments = await listPayments();
  return payments.map(toDetails);
}

export async function handleCompletePayment(id: string) {
  const payment = await getById(id);
  if (!payment) {
    throw new NotFoundError(`Payment '${id}' was not found.`);
  }
  payment.complete();
  await savePayment(payment);
  return toDetails(payment);
}

export async function handleFailPayment(id: string, reason: string) {
  const payment = await getById(id);
  if (!payment) {
    throw new NotFoundError(`Payment '${id}' was not found.`);
  }
  payment.fail(reason);
  await savePayment(payment);
  return toDetails(payment);
}
