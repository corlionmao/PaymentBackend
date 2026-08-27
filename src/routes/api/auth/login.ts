import { createFileRoute } from "@tanstack/react-router";
import { handleLogin } from "@/server/application/handlers";
import { handleRoute, json, problemResponse, readJson } from "@/server/http";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) =>
        handleRoute(request, async () => {
          const body = await readJson<{ username?: string; password?: string }>(request);
          const result = await handleLogin(body.username ?? "", body.password ?? "");
          if (!result.succeeded || !result.token) {
            return problemResponse(
              401,
              "Unauthorized",
              "Invalid username or password.",
              "/api/auth/login",
            );
          }
          return json({ token: result.token });
        }),
    },
  },
});
