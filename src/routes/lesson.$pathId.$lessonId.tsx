import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { getLesson, getNextLesson } from "@/lib/content";
import { useUser } from "@/lib/store";

export const Route = createFileRoute("/lesson/$pathId/$lessonId")({
  component: () => (
    <RequireAuth>
      <LessonPage />
    </RequireAuth>
  ),
});

function LessonPage() {
  const { pathId, lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const data = getLesson(pathId, lessonId);

  const [phase, setPhase] = useState<"read" | "quiz" | "done">("read");
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [badge, setBadge] = useState<string | null>(null);

  useEffect(() => {
    setPhase("read");
    setPick(null);
    setRevealed(false);
    setBadge(null);
  }, [lessonId]);

  if (!data) {
    return (
      <div className="py-20 text-center">
        <p>Lesson not found.</p>
        <Link to="/courses" className="text-[color:var(--neon-blue)]">Back to courses</Link>
      </div>
    );
  }

  const { path, lesson } = data;
  const next = getNextLesson(pathId, lessonId);

  const submitQuiz = () => {
    if (pick === null) return;
    setRevealed(true);
    if (pick === lesson.quiz.answer) {
      setTimeout(() => {
        const result = completeLesson(lesson.id, lesson.xp);
        if (user?.soundOn) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = 660; g.gain.value = 0.05;
            o.start(); o.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.15);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            o.stop(ctx.currentTime + 0.3);
          } catch {}
        }
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#3b82f6", "#ec4899", "#22d3ee"],
        });
        if (result.newBadge) setBadge(result.newBadge);
        setPhase("done");
      }, 600);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-xl px-5 pb-10 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/courses/$pathId"
          params={{ pathId: path.id }}
          className="glass flex h-9 w-9 items-center justify-center rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="glass flex-1 mx-3 h-2 overflow-hidden rounded-full">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: phase === "read" ? "33%" : phase === "quiz" ? "66%" : "100%" }}
            className="gradient-primary h-full"
          />
        </div>
        <span className="text-xs text-muted-foreground">+{lesson.xp} XP</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === "read" && (
          <motion.div
            key="read"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            <p className="text-xs uppercase tracking-wider text-[color:var(--neon-blue)]">{path.title}</p>
            <h1 className="font-display text-3xl font-bold">{lesson.title}</h1>
            <p className="text-base text-muted-foreground">{lesson.intro}</p>
            <div className="glass rounded-2xl p-5 text-sm leading-relaxed">{lesson.body}</div>
            {lesson.code && (
              <pre className="glass-strong overflow-x-auto rounded-2xl border border-white/10 p-4 text-xs leading-relaxed text-[color:var(--neon-blue)]">
                <code>{lesson.code}</code>
              </pre>
            )}
            <button
              onClick={() => setPhase("quiz")}
              className="gradient-primary shadow-neon w-full rounded-xl py-4 font-semibold text-primary-foreground transition hover:scale-[1.01]"
            >
              I'm ready — start quiz
            </button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            <p className="text-xs uppercase tracking-wider text-[color:var(--neon-pink)]">Quiz</p>
            <h2 className="font-display text-2xl font-bold">{lesson.quiz.question}</h2>
            <div className="space-y-3">
              {lesson.quiz.options.map((opt, i) => {
                const isCorrect = i === lesson.quiz.answer;
                const isPicked = pick === i;
                let cls = "glass border-transparent";
                if (revealed) {
                  if (isCorrect) cls = "border-[color:var(--success)] bg-[color:var(--success)]/10";
                  else if (isPicked) cls = "border-destructive bg-destructive/10";
                } else if (isPicked) {
                  cls = "border-[color:var(--neon-purple)] bg-white/10";
                }
                return (
                  <button
                    key={i}
                    disabled={revealed}
                    onClick={() => setPick(i)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition ${cls}`}
                  >
                    <span>{opt}</span>
                    {revealed && isCorrect && <Check className="h-5 w-5 text-[color:var(--success)]" />}
                    {revealed && isPicked && !isCorrect && <X className="h-5 w-5 text-destructive" />}
                  </button>
                );
              })}
            </div>
            {revealed && pick !== lesson.quiz.answer && (
              <button
                onClick={() => { setRevealed(false); setPick(null); }}
                className="glass w-full rounded-xl py-4 font-semibold transition hover:bg-white/10"
              >
                Try again
              </button>
            )}
            {!revealed && (
              <button
                disabled={pick === null}
                onClick={submitQuiz}
                className="gradient-primary shadow-neon w-full rounded-xl py-4 font-semibold text-primary-foreground transition enabled:hover:scale-[1.01] disabled:opacity-40"
              >
                Check answer
              </button>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-10 text-center"
          >
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="gradient-primary shadow-neon mx-auto flex h-24 w-24 items-center justify-center rounded-3xl"
            >
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="font-display text-4xl font-bold">Nice work!</h2>
              <p className="mt-2 text-muted-foreground">+{lesson.xp} XP earned</p>
            </div>
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass mx-auto inline-flex items-center gap-2 rounded-full px-5 py-2"
              >
                🏆 <span className="font-semibold">New badge: {badge}</span>
              </motion.div>
            )}
            <div className="flex flex-col gap-3 pt-4">
              {next ? (
                <button
                  onClick={() => navigate({ to: "/lesson/$pathId/$lessonId", params: { pathId: path.id, lessonId: next.id } })}
                  className="gradient-primary shadow-neon rounded-xl py-4 font-semibold text-primary-foreground transition hover:scale-[1.01]"
                >
                  Next lesson →
                </button>
              ) : (
                <Link
                  to="/courses/$pathId"
                  params={{ pathId: path.id }}
                  className="gradient-primary shadow-neon rounded-xl py-4 font-semibold text-primary-foreground transition hover:scale-[1.01]"
                >
                  Path complete 🎉
                </Link>
              )}
              <Link to="/dashboard" className="glass rounded-xl py-3 text-sm font-medium hover:bg-white/10">
                Back to dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
                   }
