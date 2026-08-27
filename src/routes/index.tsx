import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Ledger } from "@/components/ledger";
import { SessionGate } from "@/components/session-gate";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SessionGate>
      <AppShell>
        <Ledger />
      </AppShell>
    </SessionGate>
  );
}
