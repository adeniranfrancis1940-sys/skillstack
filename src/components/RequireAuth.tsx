import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useUser } from "../lib/store";

export function RequireAuth({ children, requireOnboarded = true }: { children: ReactNode; requireOnboarded?: boolean }) {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate({ to: "/auth" });
    } else if (requireOnboarded && !user.onboarded) {
      navigate({ to: "/onboarding" });
    }
  }, [user, navigate, requireOnboarded]);

  if (!user) return null;
  if (requireOnboarded && !user.onboarded) return null;
  return <>{children}</>;
}
