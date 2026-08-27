import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as jwtVerify, t as SignJWT } from "../_libs/jose.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DLZQutW_.js
var router_DLZQutW__exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-D7k9RImQ.css";
var APP_NAME = "Meridian";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0b0c0e"
			},
			{
				name: "description",
				content: "Meridian payment operations — idempotent clearing with JWT and a rich domain model."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 1e4,
		retry: 1,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-bg text-fg font-sans",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
					client: queryClient,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						theme: "dark",
						position: "bottom-right",
						toastOptions: { style: {
							background: "#131417",
							border: "1px solid color-mix(in oklab, #ecebe6 12%, transparent)",
							color: "#ecebe6"
						} }
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-BGjhlF_L.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./architecture-C1l1FAOw.mjs");
var Route$5 = createFileRoute("/architecture")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var ArgumentError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ArgumentError";
	}
};
var InvalidOperationError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidOperationError";
	}
};
var NotFoundError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "NotFoundError";
	}
};
var UnauthorizedError = class extends Error {
	constructor(message = "Unauthorized") {
		super(message);
		this.name = "UnauthorizedError";
	}
};
var ALLOWED = /* @__PURE__ */ new Set([
	"USD",
	"EUR",
	"GBP"
]);
var Money = class {
	amount;
	currency;
	constructor(amount, currency) {
		if (!Number.isFinite(amount) || amount <= 0) throw new ArgumentError("Amount must be greater than zero.");
		if (!ALLOWED.has(currency)) throw new ArgumentError("Currency must be one of: USD, EUR, GBP.");
		this.amount = amount;
		this.currency = currency;
	}
};
var Payment = class Payment {
	id;
	correlationId;
	money;
	accountId;
	status;
	createdAt;
	updatedAt;
	failureReason;
	constructor(input) {
		this.id = input.id;
		this.correlationId = input.correlationId;
		this.money = input.money;
		this.accountId = input.accountId;
		this.status = input.status;
		this.createdAt = input.createdAt;
		this.updatedAt = input.updatedAt;
		this.failureReason = input.failureReason;
	}
	static initialize(correlationId, money, accountId) {
		if (!correlationId) throw new ArgumentError("CorrelationId is required.");
		if (!accountId) throw new ArgumentError("AccountId is required.");
		return new Payment({
			id: crypto.randomUUID(),
			correlationId,
			money,
			accountId,
			status: "Pending",
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: null,
			failureReason: null
		});
	}
	static rehydrate(input) {
		return new Payment({
			id: input.id,
			correlationId: input.correlationId,
			money: new Money(Number(input.amount), input.currency),
			accountId: input.accountId,
			status: input.status,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
			failureReason: input.failureReason
		});
	}
	complete() {
		this.ensurePending("complete");
		this.status = "Completed";
		this.failureReason = null;
		this.updatedAt = /* @__PURE__ */ new Date();
	}
	fail(reason) {
		this.ensurePending("fail");
		if (!reason?.trim()) throw new ArgumentError("Failure reason is required.");
		this.status = "Failed";
		this.failureReason = reason.trim();
		this.updatedAt = /* @__PURE__ */ new Date();
	}
	ensurePending(operation) {
		if (this.status !== "Pending") throw new InvalidOperationError(`Cannot ${operation} a payment that is ${this.status}.`);
	}
};
var secret = new TextEncoder().encode("PaymentSystemJwtSigningKey32chrs");
var ISSUER = "PaymentSystem";
var AUDIENCE = "PaymentSystem";
async function generateToken(username) {
	return new SignJWT({ unique_name: username }).setProtectedHeader({
		alg: "HS256",
		typ: "JWT"
	}).setSubject(username).setIssuer(ISSUER).setAudience(AUDIENCE).setJti(crypto.randomUUID()).setIssuedAt().setExpirationTime("2h").sign(secret);
}
async function verifyBearer(header) {
	if (!header?.startsWith("Bearer ")) throw new UnauthorizedError("Missing Bearer token.");
	const token = header.slice(7).trim();
	try {
		await jwtVerify(token, secret, {
			issuer: ISSUER,
			audience: AUDIENCE
		});
	} catch {
		throw new UnauthorizedError("Invalid or expired token.");
	}
}
var _0002_payments_default = "create table if not exists payments (\n  id uuid primary key,\n  correlation_id uuid not null unique,\n  amount numeric(18, 2) not null,\n  currency text not null,\n  account_id uuid not null,\n  status text not null,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz,\n  failure_reason text\n);\n\ncreate unique index if not exists payments_correlation_id_idx on payments (correlation_id);\n\ninsert into payments (\n  id, correlation_id, amount, currency, account_id, status, created_at, updated_at, failure_reason\n) values\n  (\n    '11111111-1111-1111-1111-111111111111',\n    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',\n    150.00,\n    'USD',\n    '44444444-4444-4444-4444-444444444444',\n    'Pending',\n    now() - interval '2 hours',\n    null,\n    null\n  ),\n  (\n    '22222222-2222-2222-2222-222222222222',\n    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',\n    2400.00,\n    'EUR',\n    '55555555-5555-5555-5555-555555555555',\n    'Completed',\n    now() - interval '1 day',\n    now() - interval '23 hours',\n    null\n  ),\n  (\n    '33333333-3333-3333-3333-333333333333',\n    'cccccccc-cccc-cccc-cccc-cccccccccccc',\n    89.50,\n    'GBP',\n    '66666666-6666-6666-6666-666666666666',\n    'Failed',\n    now() - interval '3 days',\n    now() - interval '3 days',\n    'Insufficient funds'\n  )\non conflict (id) do nothing;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_payments.sql": _0002_payments_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function toPayment(row) {
	return Payment.rehydrate({
		id: row.id,
		correlationId: row.correlation_id,
		amount: typeof row.amount === "number" ? row.amount : Number(row.amount),
		currency: row.currency,
		accountId: row.account_id,
		status: row.status,
		createdAt: new Date(row.created_at),
		updatedAt: row.updated_at ? new Date(row.updated_at) : null,
		failureReason: row.failure_reason
	});
}
async function getByCorrelationId(correlationId) {
	const rows = await (await getSql())`
    select * from payments where correlation_id = ${correlationId} limit 1
  `;
	return rows[0] ? toPayment(rows[0]) : null;
}
async function getById(id) {
	const rows = await (await getSql())`
    select * from payments where id = ${id} limit 1
  `;
	return rows[0] ? toPayment(rows[0]) : null;
}
async function listPayments() {
	return (await (await getSql())`
    select * from payments order by created_at desc
  `).map(toPayment);
}
async function addPayment(payment) {
	await (await getSql())`
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
async function savePayment(payment) {
	await (await getSql())`
    update payments
    set status = ${payment.status},
        updated_at = ${payment.updatedAt ? payment.updatedAt.toISOString() : null},
        failure_reason = ${payment.failureReason}
    where id = ${payment.id}
  `;
}
function toDetails(payment) {
	return {
		id: payment.id,
		correlationId: payment.correlationId,
		amount: payment.money.amount,
		currency: payment.money.currency,
		accountId: payment.accountId,
		status: payment.status,
		createdAt: payment.createdAt.toISOString(),
		updatedAt: payment.updatedAt ? payment.updatedAt.toISOString() : null,
		failureReason: payment.failureReason
	};
}
var SEED_USER = "admin";
var SEED_PASSWORD = "Password123!";
async function handleLogin(username, password) {
	if (username !== SEED_USER || password !== SEED_PASSWORD) return {
		succeeded: false,
		token: null
	};
	return {
		succeeded: true,
		token: await generateToken(username)
	};
}
async function handleCreatePayment(input) {
	const existing = await getByCorrelationId(input.correlationId);
	if (existing) return {
		payment: toDetails(existing),
		created: false
	};
	const money = new Money(input.amount, input.currency);
	const payment = Payment.initialize(input.correlationId, money, input.accountId);
	await addPayment(payment);
	return {
		payment: toDetails(payment),
		created: true
	};
}
async function handleGetPayment(id) {
	const payment = await getById(id);
	return payment ? toDetails(payment) : null;
}
async function handleListPayments() {
	return (await listPayments()).map(toDetails);
}
async function handleCompletePayment(id) {
	const payment = await getById(id);
	if (!payment) throw new NotFoundError(`Payment '${id}' was not found.`);
	payment.complete();
	await savePayment(payment);
	return toDetails(payment);
}
async function handleFailPayment(id, reason) {
	const payment = await getById(id);
	if (!payment) throw new NotFoundError(`Payment '${id}' was not found.`);
	payment.fail(reason);
	await savePayment(payment);
	return toDetails(payment);
}
function problem(status, title, detail, instance) {
	return {
		type: `https://httpstatuses.io/${status}`,
		title,
		status,
		detail,
		instance
	};
}
function json(data, status = 200, extra) {
	return Response.json(data, {
		status,
		headers: {
			"Content-Type": "application/json",
			...extra
		}
	});
}
function problemResponse(status, title, detail, instance) {
	return Response.json(problem(status, title, detail, instance), {
		status,
		headers: { "Content-Type": "application/problem+json" }
	});
}
async function handleRoute(request, run) {
	try {
		return await run();
	} catch (error) {
		const instance = new URL(request.url).pathname;
		if (error instanceof ArgumentError) return problemResponse(400, "Bad Request", error.message, instance);
		if (error instanceof InvalidOperationError) return problemResponse(409, "Conflict", error.message, instance);
		if (error instanceof NotFoundError) return problemResponse(404, "Not Found", error.message, instance);
		if (error instanceof UnauthorizedError) return problemResponse(401, "Unauthorized", error.message, instance);
		return problemResponse(500, "Internal Server Error", error instanceof Error ? error.message : "Unexpected error", instance);
	}
}
async function readJson(request) {
	return await request.json();
}
var Route$4 = createFileRoute("/api/payments")({ server: { handlers: {
	GET: async ({ request }) => handleRoute(request, async () => {
		await verifyBearer(request.headers.get("authorization"));
		return json(await handleListPayments());
	}),
	POST: async ({ request }) => handleRoute(request, async () => {
		await verifyBearer(request.headers.get("authorization"));
		const result = await handleCreatePayment(await readJson(request));
		if (result.created) return json(result.payment, 201, { Location: `/api/payments/${result.payment.id}` });
		return json(result.payment);
	})
} } });
var Route$3 = createFileRoute("/api/auth/login")({ server: { handlers: { POST: async ({ request }) => handleRoute(request, async () => {
	const body = await readJson(request);
	const result = await handleLogin(body.username ?? "", body.password ?? "");
	if (!result.succeeded || !result.token) return problemResponse(401, "Unauthorized", "Invalid username or password.", "/api/auth/login");
	return json({ token: result.token });
}) } } });
var Route$2 = createFileRoute("/api/payments/$id")({ server: { handlers: { GET: async ({ request, params }) => handleRoute(request, async () => {
	await verifyBearer(request.headers.get("authorization"));
	const payment = await handleGetPayment(params.id);
	if (!payment) return problemResponse(404, "Not Found", `Payment '${params.id}' was not found.`, `/api/payments/${params.id}`);
	return json(payment);
}) } } });
var Route$1 = createFileRoute("/api/payments/$id/complete")({ server: { handlers: { POST: async ({ request, params }) => handleRoute(request, async () => {
	await verifyBearer(request.headers.get("authorization"));
	return json(await handleCompletePayment(params.id));
}) } } });
var Route = createFileRoute("/api/payments/$id/fail")({ server: { handlers: { POST: async ({ request, params }) => handleRoute(request, async () => {
	await verifyBearer(request.headers.get("authorization"));
	const body = await readJson(request);
	return json(await handleFailPayment(params.id, body.reason ?? ""));
}) } } });
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var ArchitectureRoute = Route$5.update({
	id: "/architecture",
	path: "/architecture",
	getParentRoute: () => Route$7
});
var ApiPaymentsRoute = Route$4.update({
	id: "/api/payments",
	path: "/api/payments",
	getParentRoute: () => Route$7
});
var ApiAuthLoginRoute = Route$3.update({
	id: "/api/auth/login",
	path: "/api/auth/login",
	getParentRoute: () => Route$7
});
var ApiPaymentsIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiPaymentsRoute
});
var ApiPaymentsIdRouteChildren = {
	ApiPaymentsIdCompleteRoute: Route$1.update({
		id: "/complete",
		path: "/complete",
		getParentRoute: () => ApiPaymentsIdRoute
	}),
	ApiPaymentsIdFailRoute: Route.update({
		id: "/fail",
		path: "/fail",
		getParentRoute: () => ApiPaymentsIdRoute
	})
};
var ApiPaymentsRouteChildren = { ApiPaymentsIdRoute: ApiPaymentsIdRoute._addFileChildren(ApiPaymentsIdRouteChildren) };
var rootRouteChildren = {
	IndexRoute,
	ArchitectureRoute,
	ApiPaymentsRoute: ApiPaymentsRoute._addFileChildren(ApiPaymentsRouteChildren),
	ApiAuthLoginRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter, router_DLZQutW__exports as t };
