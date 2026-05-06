import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  onComplete: () => void;
  label?: string;
  disabled?: boolean;
}

export function SlideToAnalyze({ onComplete, label = "Slide to analyze", disabled }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);
  const opacity = useTransform(x, [0, 100], [1, 0.3]);

  const handleEnd = () => {
    const width = trackRef.current?.offsetWidth ?? 320;
    const threshold = width - 72;
    if (x.get() >= threshold * 0.85) {
      animate(x, threshold, { duration: 0.15 });
      setDone(true);
      onComplete();
      setTimeout(() => {
        animate(x, 0, { duration: 0.4 });
        setDone(false);
      }, 400);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative h-16 w-full rounded-full bg-gradient-primary p-1 shadow-glow overflow-hidden"
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}
    >
      <div className="absolute inset-0 shimmer rounded-full" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-primary-foreground font-semibold tracking-wide pointer-events-none"
        style={{ opacity }}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {label}
      </motion.div>
      <motion.button
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={handleEnd}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 h-14 w-14 rounded-full bg-background flex items-center justify-center shadow-card cursor-grab active:cursor-grabbing"
      >
        <ArrowRight className={`w-5 h-5 text-primary transition-transform ${done ? "rotate-90" : ""}`} />
      </motion.button>
    </div>
  );
}
