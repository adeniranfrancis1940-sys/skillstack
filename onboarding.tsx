import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const TRACKS = [
  { id: "html", label: "HTML", emoji: "🧱", desc: "Structure the web" },
  { id: "css", label: "CSS", emoji: "🎨", desc: "Style with confidence" },
  { id: "javascript", label: "JavaScript", emoji: "⚡", desc: "Make it interactive" },
] as const;

const LEVELS = [
  { id: "beginner", label: "I'm new to this", emoji: "🌱" },
  { id: "intermediate", label: "I know some basics", emoji: "🚀" },
  { id: "advanced", label: "I'm experienced", emoji: "🦾" },
] as const;

const GOALS = [
  { id: 5, label: "Casual", desc: "5 min / day" },
  { id: 10, label: "Regular", desc: "10 min / day" },
  { id: 20, label: "Serious", desc: "20 min / day" },
  { id: 30, label: "Intense", desc: "30 min / day" },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const { user, update } = useUser();
  const [step, setStep] = useState(0);
  const [track, setTrack] = useState<typeof TRACKS[number]["id"] | null>(null);
  const [level, setLevel] = useState<typeof LEVELS[number]["id"] | null>(null);
  const [daily, setDaily] = useState<typeof GOALS[number]["id"] | null>(null);

  const next = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      update({
        onboarded: true,
        goals: { track: track!, level: level!, daily: daily! },
      });
      navigate({ to: "/dashboard" });
    }
  };

  const canNext = (step === 0 && track) || (step === 1 && level) || (step === 2 && daily);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
      <div className="mb-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i <= step ? "gradient-primary" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {step === 0 && (
            <>
              <h2 className="font-display text-3xl font-bold">What do you want to learn?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Pick a track. You can switch any time.</p>
              <div className="mt-6 space-y-3">
                {TRACKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrack(t.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      track === t.id
                        ? "border-[color:var(--neon-purple)] bg-white/10 shadow-neon"
                        : "glass border-transparent hover:bg-white/10"
                    }`}
                  >
                    <span className="text-3xl">{t.emoji}</span>
                    <div>
                      <p className="font-display font-semibold">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-display text-3xl font-bold">What's your level?</h2>
              <p className="mt-2 text-sm text-muted-foreground">We'll match the difficulty.</p>
              <div className="mt-6 space-y-3">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      level === l.id
                        ? "border-[color:var(--neon-purple)] bg-white/10 shadow-neon"
                        : "glass border-transparent hover:bg-white/10"
                    }`}
                  >
                    <span className="text-3xl">{l.emoji}</span>
                    <p className="font-display font-semibold">{l.label}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-3xl font-bold">Set a daily goal</h2>
              <p className="mt-2 text-sm text-muted-foreground">Consistency beats intensity.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setDaily(g.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      daily === g.id
                        ? "border-[color:var(--neon-purple)] bg-white/10 shadow-neon"
                        : "glass border-transparent hover:bg-white/10"
                    }`}
                  >
                    <p className="font-display text-lg font-bold">{g.label}</p>
                    <p className="text-xs text-muted-foreground">{g.desc}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        disabled={!canNext}
        onClick={next}
        className="gradient-primary shadow-neon mt-6 rounded-xl px-6 py-4 text-sm font-semibold text-primary-foreground transition enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {step === 2 ? "Start learning" : "Continue"}
      </button>
    </div>
  );
}