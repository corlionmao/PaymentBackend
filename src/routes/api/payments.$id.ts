import { createFileRoute } from "@tanstack/react-router";
import { handleGetPayment } from "@/server/application/handlers";
import { verifyBearer } from "@/server/infrastructure/jwt";
import { handleRoute, json, problemResponse } from "@/server/http";

export const Route = createFileRoute("/api/payments/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) =>
        handleRoute(request, async () => {
          await verifyBearer(request.headers.get("authorization"));
          const payment = await handleGetPayment(params.id);
          if (!payment) {
            return problemResponse(
              404,
              "Not Found",
              `Payment '${params.id}' was not found.`,
              `/api/payments/${params.id}`,
            );
          }
          return json(payment);
        }),
    },
  },
});
