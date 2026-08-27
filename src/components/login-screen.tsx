import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/payment-api";
import { useSession } from "@/lib/session";

export function LoginScreen() {
  const setToken = useSession((s) => s.setToken);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Password123!");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const result = await login(username, password);
      setToken(result.token);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0b0c0e_0%,#101214_100%)]" />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
          Payment operations
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Meridian
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Idempotent clearing engine. Sign in with the seeded operator to inspect
          the ledger, issue payments, and walk the domain model.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Operator</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passphrase</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-12 w-full rounded-lg" disabled={pending}>
            {pending ? "Signing in…" : "Enter the ledger"}
          </Button>
        </form>

        <p className="mt-6 font-mono text-[11px] text-subtle">
          Seeded credentials — admin / Password123!
        </p>
      </div>
    </div>
  );
}
