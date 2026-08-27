import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as Plus, t as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { _ as formatMoney, b as useSession, d as SessionGate, f as cn, g as formatDate, h as failPayment, i as Card, l as Input, m as createPayment, n as AppShell, p as completePayment, r as Button, t as ApiError, u as Label, v as listPayments, y as shortId } from "./session-gate-B4TrR23K.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BGjhlF_L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2", "rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)]", "focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-sm p-2 text-muted hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
var CURRENCIES = [
	"USD",
	"EUR",
	"GBP"
];
function CreatePaymentDialog({ open, onOpenChange, token, onCreated }) {
	const [amount, setAmount] = (0, import_react.useState)("250.00");
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [accountId, setAccountId] = (0, import_react.useState)(() => crypto.randomUUID());
	const [correlationId, setCorrelationId] = (0, import_react.useState)(() => crypto.randomUUID());
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		const parsed = Number(amount);
		setPending(true);
		try {
			const payment = await createPayment(token, {
				amount: parsed,
				currency,
				accountId,
				correlationId
			});
			toast.success("Instruction accepted");
			onCreated(payment);
			onOpenChange(false);
			setCorrelationId(crypto.randomUUID());
			setAccountId(crypto.randomUUID());
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Create failed");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New payment" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Correlation IDs are unique. Replaying the same id returns the original payment without a second debit." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "amount",
								children: "Amount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "amount",
								inputMode: "decimal",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "currency",
								children: "Currency"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "currency",
								value: currency,
								onChange: (e) => setCurrency(e.target.value),
								className: "flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
								children: CURRENCIES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: code,
									children: code
								}, code))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "accountId",
							children: "Account id"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "accountId",
							className: "font-mono text-xs",
							value: accountId,
							onChange: (e) => setAccountId(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "correlationId",
							children: "Correlation id"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "correlationId",
							className: "font-mono text-xs",
							value: correlationId,
							onChange: (e) => setCorrelationId(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: pending,
						children: pending ? "Submitting…" : "Submit instruction"
					})
				]
			})
		] })
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { tone: {
		pending: "bg-warn/15 text-warn",
		completed: "bg-ok/15 text-ok",
		failed: "bg-danger/15 text-danger",
		muted: "bg-elevated text-muted"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function Separator({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-px w-full bg-border", className) });
}
var Sheet = Dialog$1;
function SheetContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col", "border-l border-border bg-surface p-6 shadow-[var(--shadow-border)]", "focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-sm p-2 text-muted hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function PaymentDetail({ payment, onClose, onComplete, onFail, busy }) {
	const [reason, setReason] = (0, import_react.useState)("Insufficient funds");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!payment,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, { children: payment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Payment" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
					className: "mt-1 font-mono text-xs",
					children: payment.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl font-medium tabular-nums tracking-tight",
							children: formatMoney(payment.amount, payment.currency)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: payment.status === "Completed" ? "completed" : payment.status === "Failed" ? "failed" : "pending",
								children: payment.status
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Correlation",
							value: payment.correlationId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Account",
							value: payment.accountId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Created",
							value: formatDate(payment.createdAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Updated",
							value: payment.updatedAt ? formatDate(payment.updatedAt) : "—"
						}),
						payment.failureReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Failure",
							value: payment.failureReason
						}) : null
					]
				}),
				payment.status === "Pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto space-y-3 pt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: onComplete,
							disabled: busy,
							children: "Complete"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "reason",
								children: "Failure reason"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "reason",
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "w-full",
							onClick: () => onFail(reason),
							disabled: busy,
							children: "Mark failed"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-auto pt-8 text-sm text-muted",
					children: "Terminal state. Transitions are only allowed from Pending."
				})
			]
		}) : null })
	});
}
function Field({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] uppercase tracking-[0.16em] text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 break-all font-mono text-xs text-fg",
		children: value
	})] });
}
function statusTone(status) {
	if (status === "Completed") return "completed";
	if (status === "Failed") return "failed";
	return "pending";
}
function Ledger() {
	const token = useSession((s) => s.token);
	const signOut = useSession((s) => s.signOut);
	const queryClient = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const paymentsQuery = useQuery({
		queryKey: ["payments"],
		queryFn: () => listPayments(token)
	});
	if (paymentsQuery.error instanceof ApiError && paymentsQuery.error.status === 401) signOut();
	const payments = paymentsQuery.data ?? [];
	const stats = (0, import_react.useMemo)(() => {
		const pending = payments.filter((p) => p.status === "Pending").length;
		const completed = payments.filter((p) => p.status === "Completed");
		const failed = payments.filter((p) => p.status === "Failed").length;
		const volume = completed.reduce((sum, p) => sum + p.amount, 0);
		return {
			pending,
			completed: completed.length,
			failed,
			volume,
			total: payments.length
		};
	}, [payments]);
	const completeMut = useMutation({
		mutationFn: (id) => completePayment(token, id),
		onSuccess: (payment) => {
			toast.success("Payment completed");
			setSelected(payment);
			queryClient.invalidateQueries({ queryKey: ["payments"] });
		},
		onError: (error) => toast.error(error.message)
	});
	const failMut = useMutation({
		mutationFn: ({ id, reason }) => failPayment(token, id, reason),
		onSuccess: (payment) => {
			toast.success("Payment marked failed");
			setSelected(payment);
			queryClient.invalidateQueries({ queryKey: ["payments"] });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.2em] text-muted",
						children: "Operations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl",
						children: "Ledger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: "Create idempotent payments, inspect status, and drive the pending state machine to completed or failed."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setCreateOpen(true),
					className: "self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New payment"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "In flight",
						value: String(stats.pending),
						hint: "Pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cleared",
						value: String(stats.completed),
						hint: "Completed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Returned",
						value: String(stats.failed),
						hint: "Failed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cleared volume",
						value: formatMoney(stats.volume, "USD"),
						hint: "Completed, mixed FX",
						tabular: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr_0.7fr] gap-3 border-b border-border px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-subtle md:grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Account" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Created" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status" })
					]
				}), paymentsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 p-5",
					children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded-md bg-elevated" }, i))
				}) : payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-12 text-center text-sm text-muted",
					children: "No payments yet. Issue the first instruction."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: payments.map((payment) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(payment),
					className: "grid w-full grid-cols-1 gap-1 border-b border-border px-5 py-4 text-left last:border-b-0 hover:bg-elevated/60 md:grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr_0.7fr] md:items-center md:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm",
							children: shortId(payment.id)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] text-subtle",
							children: ["corr ", shortId(payment.correlationId)]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-muted",
							children: ["acct ", shortId(payment.accountId)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm tabular-nums",
							children: formatMoney(payment.amount, payment.currency)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: formatDate(payment.createdAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: statusTone(payment.status),
							children: payment.status
						}) })
					]
				}) }, payment.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatePaymentDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				token,
				onCreated: (payment) => {
					setSelected(payment);
					queryClient.invalidateQueries({ queryKey: ["payments"] });
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDetail, {
				payment: selected,
				onClose: () => setSelected(null),
				onComplete: () => selected && completeMut.mutate(selected.id),
				onFail: (reason) => selected && failMut.mutate({
					id: selected.id,
					reason
				}),
				busy: completeMut.isPending || failMut.isPending
			})
		]
	});
}
function Stat({ label, value, hint, tabular }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.16em] text-subtle",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-2 font-display text-2xl font-medium tracking-tight ${tabular ? "font-mono text-xl" : ""}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ledger, {}) }) });
}
//#endregion
export { Home as component };
