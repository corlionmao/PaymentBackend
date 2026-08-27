import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionGate } from "@/components/session-gate";

export const Route = createFileRoute("/architecture")({ component: ArchitecturePage });

const LAYERS = [
  {
    name: "Presentation",
    project: "PaymentSystem.WebAPI",
    body: "JWT bearer auth, PaymentsController, AuthController, IExceptionHandler, OpenAPI transformer for Bearer {token}.",
  },
  {
    name: "Application",
    project: "PaymentSystem.Application",
    body: "MediatR CQRS. CreatePaymentCommand is strictly idempotent on CorrelationId. LoginCommand issues HS256 tokens.",
  },
  {
    name: "Infrastructure",
    project: "PaymentSystem.Infrastructure",
    body: "EF Core SQLite, OwnsOne Money, unique CorrelationId, AuditSaveChangesInterceptor, seeded Pending / Completed / Failed rows.",
  },
  {
    name: "Domain",
    project: "PaymentSystem.Domain",
    body: "Rich aggregate. Money rejects non-positive amounts and currencies outside USD, EUR, GBP. Complete and Fail only from Pending.",
  },
];

function ArchitecturePage() {
  return (
    <SessionGate>
      <AppShell>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Clean architecture</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Four layers, one invariant
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          The live console talks to the same HTTP contract as the .NET Web API:
          anonymous login, authorized payments, RFC 7807 errors, and correlation-id
          idempotency.
        </p>

        <div className="mt-10 grid gap-3">
          {LAYERS.map((layer) => (
            <Card key={layer.name} className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{layer.name}</CardTitle>
                <CardDescription className="font-mono text-xs">{layer.project}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">{layer.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">HTTP surface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-xs text-muted">
              <p>POST /api/auth/login</p>
              <p>POST /api/payments</p>
              <p>GET /api/payments</p>
              <p>GET /api/payments/{"{id}"}</p>
              <p>POST /api/payments/{"{id}"}/complete</p>
              <p>POST /api/payments/{"{id}"}/fail</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted">
              <p>Domain: factory, money whitelist, illegal transitions.</p>
              <p>Application: duplicate CorrelationId never calls AddAsync.</p>
              <p>API: unauthenticated 401, seed login returns a JWT.</p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </SessionGate>
  );
}
