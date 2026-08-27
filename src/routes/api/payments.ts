import { createFileRoute } from "@tanstack/react-router";
import { handleCreatePayment, handleListPayments } from "@/server/application/handlers";
import { verifyBearer } from "@/server/infrastructure/jwt";
import { handleRoute, json, readJson } from "@/server/http";

export const Route = createFileRoute("/api/payments")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        handleRoute(request, async () => {
          await verifyBearer(request.headers.get("authorization"));
          const payments = await handleListPayments();
          return json(payments);
        }),
      POST: async ({ request }) =>
        handleRoute(request, async () => {
          await verifyBearer(request.headers.get("authorization"));
          const body = await readJson<{
            correlationId: string;
            amount: number;
            currency: string;
            accountId: string;
          }>(request);
          const result = await handleCreatePayment(body);
          if (result.created) {
            return json(result.payment, 201, {
              Location: `/api/payments/${result.payment.id}`,
            });
          }
          return json(result.payment);
        }),
    },
  },
});
