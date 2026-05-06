import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, History, ArrowRight, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { PressScale } from "@/components/mobile/PressScale";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Veritas AI — Home" },
      { name: "description", content: "Detect AI-generated text, images, and videos in seconds." },
    ],
  }),
});

const stats = [
  { label: "Scans today", value: "12", icon: Zap },
  { label: "Accuracy", value: "98.6%", icon: ShieldCheck },
  { label: "Trend", value: "+24%", icon: TrendingUp },
];

const quickActions = [
  { to: "/text", icon: FileText, title: "Text Scan", desc: "Paste & analyze writing", gradient: "from-primary to-accent" },
  { to: "/media", icon: ImageIcon, title: "Media Scan", desc: "Photos & video deepfakes", gradient: "from-accent to-primary" },
  { to: "/history", icon: History, title: "History", desc: "Recent reports", gradient: "from-primary/60 to-accent/60" },
] as const;

function HomePage() {
  return (
    <div className="px-5 pt-6 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-surface border border-border p-6 shadow-card relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Welcome back</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight">
          Spot AI <span className="text-gradient">in seconds.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Run a quick scan on any text, image, or video.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card/60 border border-border p-3">
              <s.icon className="w-4 h-4 text-primary mb-1" />
              <p className="text-base font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick scan</h2>
        </div>
        <div className="space-y-3">
          {quickActions.map((a, i) => (
            <motion.div
              key={a.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link to={a.to}>
                <PressScale className="w-full text-left rounded-2xl border border-border bg-card p-4 flex items-center gap-4 shadow-card">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-glow`}>
                    <a.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </PressScale>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-primary/30 bg-gradient-primary/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Pro tip</p>
        <p className="mt-1 text-sm">
          Long-press a flagged sentence in your report to copy the AI signature.
        </p>
      </section>
    </div>
  );
}
