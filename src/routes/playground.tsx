import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/playground")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Playground />
      </AppShell>
    </RequireAuth>
  ),
});

const DEFAULT = `<!doctype html>
<html>
<head>
<style>
  body { display:grid; place-items:center; height:100vh; margin:0;
         background: linear-gradient(135deg, #a855f7, #3b82f6);
         font-family: system-ui; color: white; }
  .card { padding: 24px 32px; border-radius: 16px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); }
</style>
</head>
<body>
  <div class="card">
    <h1>Hello, Skill Stack!</h1>
    <p>Edit me and click Run.</p>
  </div>
</body>
</html>`;

function Playground() {
  const [code, setCode] = useState(DEFAULT);
  const [out, setOut] = useState(DEFAULT);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { setOut(DEFAULT); }, []);

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Playground</h1>
          <p className="text-xs text-muted-foreground">Write HTML / CSS — see it live.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setCode(DEFAULT); setOut(DEFAULT); }}
            className="glass flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={() => setOut(code)}
            className="gradient-primary shadow-neon flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Play className="h-3.5 w-3.5" /> Run
          </button>
        </div>
      </header>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="glass-strong h-64 w-full resize-none rounded-2xl border border-white/10 p-4 font-mono text-xs leading-relaxed text-[color:var(--neon-blue)] outline-none focus:border-[color:var(--neon-purple)]"
      />

      <div className="glass-strong overflow-hidden rounded-2xl border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-muted-foreground">
          <span>Preview</span>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
          </div>
        </div>
        <iframe
          ref={iframeRef}
          title="preview"
          srcDoc={out}
          sandbox="allow-scripts"
          className="h-80 w-full bg-white"
        />
      </div>
    </div>
  );
}
