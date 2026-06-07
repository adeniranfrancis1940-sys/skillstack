import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { PATHS } from "@/lib/content";
import { useUser } from "@/lib/store";

export const Route = createFileRoute("/courses/")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Courses />
      </AppShell>
    </RequireAuth>
  ),
});

function Courses() {
  const { user } = useUser();
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Learning paths</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick a track and start stacking skills.</p>
      </header>

      <div className="space-y-4">
        {PATHS.map((p, i) => {
          const lessons = p.modules.flatMap((m) => m.lessons);
          const done = lessons.filter((l) => user?.completedLessons.includes(l.id)).length;
          const pct = Math.round((done / lessons.length) * 100);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to="/courses/$pathId"
                params={{ pathId: p.id }}
                className="glass shadow-glow group block overflow-hidden rounded-3xl p-5 transition hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-3xl shadow-lg`}>
                    {p.emoji}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold">{p.title}</h2>
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{done}/{lessons.length} lessons · {pct}%</span>
                  <span className="text-[color:var(--neon-blue)] group-hover:underline">Open →</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="gradient-primary h-full" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}