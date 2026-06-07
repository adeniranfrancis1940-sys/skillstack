import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { getPath } from "@/lib/content";
import { useUser } from "@/lib/store";

export const Route = createFileRoute("/courses/$pathId")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <PathPage />
      </AppShell>
    </RequireAuth>
  ),
});

function PathPage() {
  const { pathId } = Route.useParams();
  const { user } = useUser();
  const path = getPath(pathId);

  if (!path) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Path not found.</p>
        <Link to="/courses" className="mt-4 inline-block text-[color:var(--neon-blue)]">
          ← Back to courses
        </Link>
      </div>
    );
  }

  const flat = path.modules.flatMap((m) => m.lessons);
  const firstUndone = flat.findIndex((l) => !user?.completedLessons.includes(l.id));

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Link>

      <header className="space-y-2">
        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${path.color} text-4xl shadow-lg`}>
          {path.emoji}
        </div>
        <h1 className="font-display text-3xl font-bold">{path.title}</h1>
        <p className="text-sm text-muted-foreground">{path.tagline}</p>
      </header>

      <div className="space-y-6">
        {path.modules.map((m, mi) => (
          <section key={m.id}>
            <h3 className="mb-3 font-display text-lg font-semibold">
              <span className="text-muted-foreground">Module {mi + 1} ·</span> {m.title}
            </h3>
            <div className="space-y-2">
              {m.lessons.map((l, li) => {
                const globalIdx = flat.findIndex((x) => x.id === l.id);
                const done = user?.completedLessons.includes(l.id);
                const locked = firstUndone !== -1 && globalIdx > firstUndone;
                return (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: li * 0.04 }}
                  >
                    <Link
                      to="/lesson/$pathId/$lessonId"
                      params={{ pathId: path.id, lessonId: l.id }}
                      className={`glass flex items-center gap-3 rounded-2xl p-4 transition ${
                        locked ? "opacity-50" : "hover:bg-white/10"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {done ? (
                          <CheckCircle2 className="h-6 w-6 text-[color:var(--success)]" />
                        ) : locked ? (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <Circle className="h-6 w-6 text-[color:var(--neon-blue)]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold">{l.title}</p>
                        <p className="text-xs text-muted-foreground">+{l.xp} XP</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}