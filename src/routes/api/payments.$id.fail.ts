import { createFileRoute } from "@tanstack/react-router";
import { handleFailPayment } from "@/server/application/handlers";
import { verifyBearer } from "@/server/infrastructure/jwt";
import { handleRoute, json, readJson } from "@/server/http";

export const Route = createFileRoute("/api/payments/$id/fail")({
  server: {
    handlers: {
      POST: async ({ request, params }) =>
        handleRoute(request, async () => {
          await verifyBearer(request.headers.get("authorization"));
          const body = await readJson<{ reason?: string }>(request);
          const payment = await handleFailPayment(params.id, body.reason ?? "");
          return json(payment);
        }),
    },
  },
});
