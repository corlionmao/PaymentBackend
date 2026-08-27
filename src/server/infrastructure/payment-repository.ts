import { getSql } from "@/lib/db";
import { Payment, type PaymentStatus } from "../domain/payment";

interface PaymentRow {
  id: string;
  correlation_id: string;
  amount: string | number;
  currency: string;
  account_id: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string | null;
  failure_reason: string | null;
}

function toPayment(row: PaymentRow): Payment {
  return Payment.rehydrate({
    id: row.id,
    correlationId: row.correlation_id,
    amount: typeof row.amount === "number" ? row.amount : Number(row.amount),
    currency: row.currency,
    accountId: row.account_id,
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    failureReason: row.failure_reason,
  });
}

export async function getByCorrelationId(correlationId: string) {
  const sql = await getSql();
  const rows = await sql<PaymentRow>`
    select * from payments where correlation_id = ${correlationId} limit 1
  `;
  return rows[0] ? toPayment(rows[0]) : null;
}

export async function getById(id: string) {
  const sql = await getSql();
  const rows = await sql<PaymentRow>`
    select * from payments where id = ${id} limit 1
  `;
  return rows[0] ? toPayment(rows[0]) : null;
}

export async function listPayments() {
  const sql = await getSql();
  const rows = await sql<PaymentRow>`
    select * from payments order by created_at desc
  `;
  return rows.map(toPayment);
}

export async function addPayment(payment: Payment) {
  const sql = await getSql();
  await sql`
    insert into payments (
      id, correlation_id, amount, currency, account_id, status, created_at, updated_at, failure_reason
    ) values (
      ${payment.id},
      ${payment.correlationId},
      ${payment.money.amount},
      ${payment.money.currency},
      ${payment.accountId},
      ${payment.status},
      ${payment.createdAt.toISOString()},
      ${payment.updatedAt ? payment.updatedAt.toISOString() : null},
      ${payment.failureReason}
    )
  `;
}

export async function savePayment(payment: Payment) {
  const sql = await getSql();
  await sql`
    update payments
    set status = ${payment.status},
        updated_at = ${payment.updatedAt ? payment.updatedAt.toISOString() : null},
        failure_reason = ${payment.failureReason}
    where id = ${payment.id}
  `;
}
