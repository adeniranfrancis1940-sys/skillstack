import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Flame, Trophy, Code2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-[color:var(--neon-purple)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-1/3 h-80 w-80 rounded-full bg-[color:var(--neon-blue)] opacity-25 blur-3xl" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Skill Stack</span>
        </div>
        <Link
          to="/auth"
          className="glass rounded-full px-5 py-2 text-sm font-medium transition hover:bg-white/10"
        >
          Sign in
        </Link>
      </header>

      <section className="relative mx-auto max-w-3xl px-6 pb-20 pt-12 text-center sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--neon-pink)]" />
          <span className="text-muted-foreground">Now with daily streaks & XP</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl font-bold leading-[1.05] sm:text-7xl"
        >
          Learn to code,
          <br />
          <span className="gradient-text">level by level.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Bite-sized HTML, CSS & JavaScript lessons with quizzes, a live playground,
          and a streak system that keeps you coming back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/auth"
            className="gradient-primary shadow-neon group flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.03]"
          >
            Start learning free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/auth"
            search={{ guest: 1 }}
            className="glass rounded-full px-7 py-3.5 text-sm font-semibold transition hover:bg-white/10"
          >
            Continue as guest
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {[
            { icon: Flame, label: "Daily streaks", tone: "text-orange-400" },
            { icon: Trophy, label: "XP & badges", tone: "text-yellow-400" },
            { icon: Code2, label: "Live playground", tone: "text-sky-400" },
          ].map((f, i) => (
            <div key={i} className="glass flex items-center gap-3 rounded-2xl p-4">
              <f.icon className={`h-5 w-5 ${f.tone}`} />
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
        Built with ❤️ — Skill Stack
      </footer>
    </div>
  );
}