import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  token: string | null;
  setToken: (token: string | null) => void;
  signOut: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      signOut: () => set({ token: null }),
    }),
    { name: "meridian.jwt" },
  ),
);
