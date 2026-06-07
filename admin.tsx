import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Edit3, FileText, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { PATHS } from "@/lib/content";

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
  return (
    <div className="space-y-5">
      <Link to="/profile" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Admin panel</h1>
        <p className="text-sm text-muted-foreground">Manage content (demo).</p>
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

      <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-muted-foreground">
        Wire this up to Lovable Cloud to persist real content.
      </p>
    </div>
  );
}