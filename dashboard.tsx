import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Zap, ArrowRight, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useUser } from "@/lib/store";
import { PATHS } from "@/lib/content";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Dashboard />
      </AppShell>
    </RequireAuth>
  ),
});

function Dashboard() {
  const { user } = useUser();
  if (!user) return null;

  const featuredPath = PATHS.find((p) => p.id === user.goals.track) ?? PATHS[0];
  const allLessons = featuredPath.modules.flatMap((m) => m.lessons);
  const nextLesson = allLessons.find((l) => !user.completedLessons.includes(l.id)) ?? allLessons[0];
  const pct = Math.round((user.completedLessons.length / allLessons.length) * 100);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-2xl font-bold">{user.username} 👋</h1>
        </div>
        <Link
          to="/profile"
          className="gradient-primary flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold text-primary-foreground"
        >
          {user.username.slice(0, 1).toUpperCase()}
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass relative overflow-hidden rounded-2xl p-4"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-orange-500/30 blur-2xl" />
          <div className="flex items-center gap-2 text-orange-300">
            <Flame className="h-4 w-4" />
            <span className="text-xs font-medium">Streak</span>
          </div>
          <p className="mt-2 font-display text-3xl font-bold">{user.streak}<span className="text-base text-muted-foreground"> days</span></p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass relative overflow-hidden rounded-2xl p-4"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[color:var(--neon-purple)] opacity-40 blur-2xl" />
          <div className="flex items-center gap-2 text-[color:var(--neon-purple)]">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-medium">XP</span>
          </div>
          <p className="mt-2 font-display text-3xl font-bold">{user.xp}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="gradient-primary shadow-neon relative overflow-hidden rounded-3xl p-6 text-primary-foreground"
      >
        <p className="text-xs opacity-80">Continue learning</p>
        <h2 className="mt-1 font-display text-2xl font-bold">{nextLesson.title}</h2>
        <p className="mt-1 text-sm opacity-90">{featuredPath.title}</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full rounded-full bg-white"
          />
        </div>
        <p className="mt-2 text-xs opacity-80">{pct}% complete</p>
        <Link
          to="/lesson/$pathId/$lessonId"
          params={{ pathId: featuredPath.id, lessonId: nextLesson.id }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-black/30 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-black/40"
        >
          Resume <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Your paths</h3>
          <Link to="/courses" className="text-xs text-muted-foreground hover:text-foreground">
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {PATHS.map((p, i) => {
            const lessons = p.modules.flatMap((m) => m.lessons);
            const done = lessons.filter((l) => user.completedLessons.includes(l.id)).length;
            const ppct = Math.round((done / lessons.length) * 100);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  to="/courses/$pathId"
                  params={{ pathId: p.id }}
                  className="glass flex items-center gap-4 rounded-2xl p-4 transition hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
                    {p.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{done}/{lessons.length} lessons</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                      <div className="gradient-primary h-full" style={{ width: `${ppct}%` }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {user.badges.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <h3 className="font-display text-lg font-semibold">Recent badges</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {user.badges.map((b) => (
              <div key={b} className="glass min-w-[80px] rounded-2xl p-3 text-center">
                <div className="text-2xl">🏆</div>
                <p className="mt-1 text-[10px] text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}