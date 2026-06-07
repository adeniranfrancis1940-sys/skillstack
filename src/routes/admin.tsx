import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Edit3, FileText, ArrowLeft, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { PATHS } from "@/lib/content";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Admin />
      </AppShell>
    </RequireAuth>
  ),
});

function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // YOUR SECRET PASSWORD
  const SECRET_PASSWORD = "Adeniran25";

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5">
        <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
          <Lock className="mx-auto mb-4 h-12 w-12 text-[color:var(--neon-purple)]" />
          <h2 className="font-display text-2xl font-bold">Admin Access</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter password to continue
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[color:var(--neon-purple)]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && password === SECRET_PASSWORD) {
                setIsAuthorized(true);
                setPassword("");
              } else if (e.key === "Enter") {
                alert("Wrong password!");
              }
            }}
          />
          <button
            onClick={() => {
              if (password === SECRET_PASSWORD) {
                setIsAuthorized(true);
                setPassword("");
              } else {
                alert("Wrong password!");
              }
            }}
            className="gradient-primary mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            Access Admin Panel
          </button>
          <Link
            to="/profile"
            className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link to="/profile" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Admin panel</h1>
        <p className="text-sm text-muted-foreground">Manage your content.</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <button className="glass flex flex-col items-center gap-2 rounded-2xl p-4 hover:bg-white/10">
          <Plus className="h-5 w-5 text-[color:var(--neon-purple)]" />
          <span className="text-xs font-medium">Add lesson</span>
        </button>
        <button className="glass flex flex-col items-center gap-2 rounded-2xl p-4 hover:bg-white/10">
          <Edit3 className="h-5 w-5 text-[color:var(--neon-blue)]" />
          <span className="text-xs font-medium">Edit module</span>
        </button>
        <button className="glass flex flex-col items-center gap-2 rounded-2xl p-4 hover:bg-white/10">
          <FileText className="h-5 w-5 text-[color:var(--neon-pink)]" />
          <span className="text-xs font-medium">Upload quiz</span>
        </button>
      </div>

      <section>
        <h3 className="mb-3 font-display text-lg font-semibold">Content overview</h3>
        <div className="space-y-3">
          {PATHS.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className="font-display font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.modules.length} module · {p.modules.flatMap((m) => m.lessons).length} lessons
                    </p>
                  </div>
                </div>
                <button className="text-xs text-[color:var(--neon-blue)]">Manage</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
