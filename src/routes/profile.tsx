import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Zap, LogOut, Volume2, VolumeX, Trophy, Settings } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { PATHS, BADGES } from "@/lib/content";
import { useUser } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Profile />
      </AppShell>
    </RequireAuth>
  ),
});

function Profile() {
  const { user, signOut, update } = useUser();
  const navigate = useNavigate();
  if (!user) return null;

  const skillData = PATHS.map((p) => {
    const lessons = p.modules.flatMap((m) => m.lessons);
    const done = lessons.filter((l) => user.completedLessons.includes(l.id)).length;
    return {
      name: p.title,
      emoji: p.emoji,
      value: Math.round((done / lessons.length) * 100),
      fill: p.id === "html" ? "#fb923c" : p.id === "css" ? "#60a5fa" : "#facc15",
    };
  });

  const leaderboard = [
    { name: "luna_dev", xp: 2480 },
    { name: "kai.codes", xp: 1920 },
    { name: user.username, xp: user.xp, you: true },
    { name: "byte_wizard", xp: Math.max(0, user.xp - 50) },
    { name: "html_hero", xp: Math.max(0, user.xp - 120) },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <div className="gradient-primary shadow-neon flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold text-primary-foreground">
          {user.username.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{user.username}</h1>
          <p className="text-xs text-muted-foreground">
            {user.isGuest ? "Guest mode" : "Member"} · {user.goals.level ?? "beginner"}
          </p>
        </div>
        <button
          onClick={() => update({ soundOn: !user.soundOn })}
          className="glass flex h-10 w-10 items-center justify-center rounded-full"
          aria-label="Toggle sound"
        >
          {user.soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <Zap className="mx-auto h-5 w-5 text-[color:var(--neon-purple)]" />
          <p className="mt-1 font-display text-xl font-bold">{user.xp}</p>
          <p className="text-[10px] text-muted-foreground">XP</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Flame className="mx-auto h-5 w-5 text-orange-400" />
          <p className="mt-1 font-display text-xl font-bold">{user.streak}</p>
          <p className="text-[10px] text-muted-foreground">Streak</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Trophy className="mx-auto h-5 w-5 text-yellow-400" />
          <p className="mt-1 font-display text-xl font-bold">{user.completedLessons.length}</p>
          <p className="text-[10px] text-muted-foreground">Lessons</p>
        </div>
      </div>

      <section className="glass rounded-3xl p-5">
        <h3 className="mb-3 font-display text-lg font-semibold">Skill progress</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={skillData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: "rgba(255,255,255,0.06)" }} dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
          {skillData.map((s) => (
            <div key={s.name}>
              <div className="text-lg">{s.emoji}</div>
              <p className="text-muted-foreground">{s.value}%</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-display text-lg font-semibold">Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(BADGES).map(([id, b]) => {
            const earned = user.badges.includes(id);
            return (
              <motion.div
                key={id}
                whileHover={{ y: -3 }}
                className={`glass rounded-2xl p-4 text-center transition ${earned ? "" : "opacity-40"}`}
              >
                <div className="text-3xl">{b.emoji}</div>
                <p className="mt-1 text-xs font-semibold">{b.name}</p>
                <p className="text-[10px] text-muted-foreground">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-display text-lg font-semibold">Leaderboard</h3>
        <div className="glass space-y-1 rounded-2xl p-2">
          {leaderboard.map((p, i) => (
            <div
              key={p.name + i}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                p.you ? "gradient-primary text-primary-foreground" : ""
              }`}
            >
              <span className="w-5 text-center font-display font-bold">{i + 1}</span>
              <span className="flex-1 text-sm font-medium">{p.name}{p.you && " (you)"}</span>
              <span className="text-xs font-semibold">{p.xp} XP</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-2">
        <Link to="/admin" className="glass flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium hover:bg-white/10">
          <Settings className="h-4 w-4" /> Admin
        </Link>
        <button
          onClick={() => { signOut(); navigate({ to: "/" }); }}
          className="glass flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
