import {
  ArgumentError,
  InvalidOperationError,
  NotFoundError,
  UnauthorizedError,
} from "./domain/errors";

interface Problem {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

function problem(status: number, title: string, detail: string, instance: string): Problem {
  return {
    type: `https://httpstatuses.io/${status}`,
    title,
    status,
    detail,
    instance,
  };
}

export function json(data: unknown, status = 200, extra?: HeadersInit) {
  return Response.json(data, {
    status,
    headers: { "Content-Type": "application/json", ...extra },
  });
}

export function problemResponse(status: number, title: string, detail: string, instance: string) {
  return Response.json(problem(status, title, detail, instance), {
    status,
    headers: { "Content-Type": "application/problem+json" },
  });
}

export async function handleRoute(
  request: Request,
  run: () => Promise<Response>,
): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    const instance = new URL(request.url).pathname;
    if (error instanceof ArgumentError) {
      return problemResponse(400, "Bad Request", error.message, instance);
    }
    if (error instanceof InvalidOperationError) {
      return problemResponse(409, "Conflict", error.message, instance);
    }
    if (error instanceof NotFoundError) {
      return problemResponse(404, "Not Found", error.message, instance);
    }
    if (error instanceof UnauthorizedError) {
      return problemResponse(401, "Unauthorized", error.message, instance);
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return problemResponse(500, "Internal Server Error", message, instance);
  }
}

export async function readJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}
