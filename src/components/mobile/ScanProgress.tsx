import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cpu, Eye, ShieldCheck } from "lucide-react";

const stages = [
  { icon: Cpu, label: "Initializing neural net" },
  { icon: Eye, label: "Analyzing patterns" },
  { icon: ShieldCheck, label: "Verifying authenticity" },
];

export function ScanProgress({ onDone, duration = 2000 }: { onDone: () => void; duration?: number }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(p);
      setStage(p < 33 ? 0 : p < 66 ? 1 : 2);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(onDone, 200);
      }
    }, 30);
    return () => clearInterval(id);
  }, [duration, onDone]);

  const StageIcon = stages[stage].icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-radar" />
        <div className="absolute inset-2 rounded-full border-2 border-accent/30 animate-radar" style={{ animationDelay: "0.5s" }} />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <motion.div
            key={stage}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <StageIcon className="w-10 h-10 text-primary-foreground" />
          </motion.div>
        </div>
      </div>

      <motion.p
        key={stage}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-sm text-muted-foreground mb-4"
      >
        {stages[stage].label}…
      </motion.p>

      <div className="w-full max-w-xs h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full bg-gradient-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs font-mono text-primary">{Math.round(progress)}%</p>
    </div>
  );
}
