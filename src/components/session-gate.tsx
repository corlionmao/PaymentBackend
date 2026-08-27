import type { ReactNode } from "react";
import { LoginScreen } from "@/components/login-screen";
import { useSession } from "@/lib/session";

export function SessionGate({ children }: { children: ReactNode }) {
  const token = useSession((s) => s.token);
  if (!token) {
    return <LoginScreen />;
  }
  return <>{children}</>;
}
