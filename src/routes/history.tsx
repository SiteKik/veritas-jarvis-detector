import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Video, RefreshCw, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "History — Veritas AI" },
      { name: "description", content: "Review past AI detection scans. Pull down to refresh." },
    ],
  }),
});

interface Item {
  id: string;
  type: "text" | "image" | "video";
  title: string;
  date: string;
  score: number;
}

const SEED: Item[] = [
  { id: "1", type: "text", title: "Marketing email draft", date: "2m ago", score: 87 },
  { id: "2", type: "image", title: "Profile photo upload", date: "1h ago", score: 94 },
  { id: "3", type: "video", title: "Interview clip", date: "Today, 9:14", score: 62 },
  { id: "4", type: "text", title: "Research abstract", date: "Yesterday", score: 12 },
  { id: "5", type: "image", title: "News article photo", date: "Yesterday", score: 41 },
  { id: "6", type: "text", title: "Customer review", date: "2 days ago", score: 76 },
];

const iconMap = { text: FileText, image: ImageIcon, video: Video };

function HistoryPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const pullOpacity = useTransform(y, [0, 80], [0, 1]);
  const rotate = useTransform(y, [0, 80], [0, 180]);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState(SEED);

  useEffect(() => {
    if (refreshing) {
      const t = setTimeout(() => {
        setItems((prev) => [
          { id: String(Date.now()), type: "text", title: "Fresh scan", date: "now", score: 55 },
          ...prev,
        ]);
        animate(y, 0, { duration: 0.3 });
        setRefreshing(false);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [refreshing, y]);

  const onDragEnd = () => {
    if (y.get() > 70 && !refreshing) {
      animate(y, 60, { duration: 0.2 });
      setRefreshing(true);
    } else if (!refreshing) {
      animate(y, 0, { duration: 0.25 });
    }
  };

  return (
    <div className="px-5 pt-6 relative">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">History</h1>
        <p className="text-sm text-muted-foreground">Pull down to refresh</p>
      </header>

      <motion.div style={{ opacity: pullOpacity }} className="flex justify-center -mt-2 mb-2">
        <motion.div style={{ rotate }} className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <RefreshCw className={`w-4 h-4 text-primary-foreground ${refreshing ? "animate-spin" : ""}`} />
        </motion.div>
      </motion.div>

      <motion.div
        ref={scrollRef}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        style={{ y }}
        onDragEnd={onDragEnd}
        className="space-y-2"
      >
        {items.map((it, i) => {
          const Icon = iconMap[it.type];
          const danger = it.score >= 60;
          return (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3 shadow-card"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${danger ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{it.title}</p>
                <p className="text-xs text-muted-foreground">{it.date} · {it.type}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${danger ? "text-destructive" : "text-success"}`}>{it.score}%</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
