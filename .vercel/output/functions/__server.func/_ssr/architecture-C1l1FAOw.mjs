import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as CardContent, c as CardTitle, d as SessionGate, i as Card, n as AppShell, o as CardDescription, s as CardHeader } from "./session-gate-B4TrR23K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/architecture-C1l1FAOw.js
var import_jsx_runtime = require_jsx_runtime();
var LAYERS = [
	{
		name: "Presentation",
		project: "PaymentSystem.WebAPI",
		body: "JWT bearer auth, PaymentsController, AuthController, IExceptionHandler, OpenAPI transformer for Bearer {token}."
	},
	{
		name: "Application",
		project: "PaymentSystem.Application",
		body: "MediatR CQRS. CreatePaymentCommand is strictly idempotent on CorrelationId. LoginCommand issues HS256 tokens."
	},
	{
		name: "Infrastructure",
		project: "PaymentSystem.Infrastructure",
		body: "EF Core SQLite, OwnsOne Money, unique CorrelationId, AuditSaveChangesInterceptor, seeded Pending / Completed / Failed rows."
	},
	{
		name: "Domain",
		project: "PaymentSystem.Domain",
		body: "Rich aggregate. Money rejects non-positive amounts and currencies outside USD, EUR, GBP. Complete and Fail only from Pending."
	}
];
function ArchitecturePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-[0.2em] text-muted",
			children: "Clean architecture"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl",
			children: "Four layers, one invariant"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-sm text-muted",
			children: "The live console talks to the same HTTP contract as the .NET Web API: anonymous login, authorized payments, RFC 7807 errors, and correlation-id idempotency."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-3",
			children: LAYERS.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: layer.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "font-mono text-xs",
						children: layer.project
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: layer.body
				}) })]
			}, layer.name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "HTTP surface"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 font-mono text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "POST /api/auth/login" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "POST /api/payments" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "GET /api/payments" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["GET /api/payments/", "{id}"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"POST /api/payments/",
							"{id}",
							"/complete"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"POST /api/payments/",
							"{id}",
							"/fail"
						] })
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Tests"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Domain: factory, money whitelist, illegal transitions." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Application: duplicate CorrelationId never calls AddAsync." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "API: unauthenticated 401, seed login returns a JWT." })
					]
				})]
			})]
		})
	] }) });
}
//#endregion
export { ArchitecturePage as component };
