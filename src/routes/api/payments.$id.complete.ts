import { createFileRoute } from "@tanstack/react-router";
import { handleCompletePayment } from "@/server/application/handlers";
import { verifyBearer } from "@/server/infrastructure/jwt";
import { handleRoute, json } from "@/server/http";

export const Route = createFileRoute("/api/payments/$id/complete")({
  server: {
    handlers: {
      POST: async ({ request, params }) =>
        handleRoute(request, async () => {
          await verifyBearer(request.headers.get("authorization"));
          const payment = await handleCompletePayment(params.id);
          return json(payment);
        }),
    },
  },
});
