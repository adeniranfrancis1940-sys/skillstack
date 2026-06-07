import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/lib/store";
import { Code2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ guest: s.guest === 1 || s.guest === "1" ? 1 : undefined }),
  component: AuthPage,
});

function AuthPage() {
  const { guest } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn, user } = useUser();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");

  const submit = (asGuest = false) => {
    const username = asGuest ? "Guest" : name.trim() || "Coder";
    signIn(username, asGuest);
    const next = user?.onboarded ? "/dashboard" : "/onboarding";
    navigate({ to: next });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-[color:var(--neon-purple)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[color:var(--neon-blue)] opacity-25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong shadow-glow relative w-full max-w-md rounded-3xl p-7"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="gradient-primary shadow-neon flex h-12 w-12 items-center justify-center rounded-2xl">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signup" ? "Start your coding streak today." : "Pick up where you left off."}
          </p>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Username</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ada_lovelace"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--neon-purple)] focus:bg-white/10"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--neon-purple)] focus:bg-white/10"
            />
          </label>

          <button
            onClick={() => submit(false)}
            className="gradient-primary shadow-neon w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.01]"
          >
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <div className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => submit(true)}
            className="glass w-full rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-white/10"
          >
            Continue as guest{guest ? " →" : ""}
          </button>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              className="font-medium text-[color:var(--neon-blue)] hover:underline"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}