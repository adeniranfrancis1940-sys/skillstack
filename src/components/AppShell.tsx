import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Code2, User } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/courses", icon: BookOpen, label: "Learn" },
    { to: "/playground", icon: Code2, label: "Play" },
    { to: "/profile", icon: User, label: "Profile" },
  ] as const;

  return (
    <div className="min-h-screen pb-24">
      <main className="mx-auto max-w-xl px-5 pt-6">{children}</main>
      <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="glass-strong shadow-neon flex items-center gap-1 rounded-full px-2 py-2">
          {items.map((it) => {
            const active = pathname.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex flex-col items-center justify-center rounded-full px-4 py-2 text-[10px] font-medium transition-all ${
                  active
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-0.5">{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
