import type { CreatePaymentInput, PaymentDetails, ProblemDetails } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly problem: ProblemDetails;

  constructor(status: number, problem: ProblemDetails) {
    super(problem.detail || problem.title || `Request failed (${status})`);
    this.status = status;
    this.problem = problem;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const problem =
      data && typeof data === "object"
        ? (data as ProblemDetails)
        : { title: response.statusText, status: response.status };
    throw new ApiError(response.status, problem);
  }

  return data as T;
}

function authHeaders(token: string, json = false): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

export async function login(username: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseResponse<{ token: string }>(response);
}

export async function listPayments(token: string) {
  const response = await fetch("/api/payments", {
    headers: authHeaders(token),
  });
  return parseResponse<PaymentDetails[]>(response);
}

export async function getPayment(token: string, id: string) {
  const response = await fetch(`/api/payments/${id}`, {
    headers: authHeaders(token),
  });
  return parseResponse<PaymentDetails>(response);
}

export async function createPayment(token: string, input: CreatePaymentInput) {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify(input),
  });
  return parseResponse<PaymentDetails>(response);
}

export async function completePayment(token: string, id: string) {
  const response = await fetch(`/api/payments/${id}/complete`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return parseResponse<PaymentDetails>(response);
}

export async function failPayment(token: string, id: string, reason: string) {
  const response = await fetch(`/api/payments/${id}/fail`, {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify({ reason }),
  });
  return parseResponse<PaymentDetails>(response);
}
