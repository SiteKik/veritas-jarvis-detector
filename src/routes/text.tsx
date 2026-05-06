import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Clipboard, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PressScale } from "@/components/mobile/PressScale";
import { SlideToAnalyze } from "@/components/mobile/SlideToAnalyze";
import { ScanProgress } from "@/components/mobile/ScanProgress";

export const Route = createFileRoute("/text")({
  component: TextScan,
  head: () => ({
    meta: [
      { title: "Text Scan — Veritas AI" },
      { name: "description", content: "Paste text and reveal AI-generated sentences with tap-to-explain insights." },
    ],
  }),
});

type Phase = "idle" | "scanning" | "results";

interface Sentence {
  text: string;
  ai: boolean;
  reason?: string;
  confidence?: number;
}

const SAMPLE = `In the quietude of dawn, the city slowly awakens. The bustling streets, once silent, now hum with activity. Pedestrians move with purpose, navigating the labyrinth of urban infrastructure. It is a moment of transition, a delicate dance between night and day.`;

function mockAnalyze(text: string): Sentence[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .map((s, i) => ({
      text: s,
      ai: i % 2 === 0 && s.length > 30,
      reason: "Repetitive cadence + low burstiness — typical of LLM output.",
      confidence: 78 + ((i * 7) % 20),
    }));
}

function TextScan() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const score = sentences.length
    ? Math.round((sentences.filter((s) => s.ai).length / sentences.length) * 100)
    : 0;

  const reset = () => {
    setPhase("idle");
    setSentences([]);
    setOpenIdx(null);
  };

  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Text Scan</h1>
        <p className="text-sm text-muted-foreground">Paste content. Tap red sentences to reveal why.</p>
      </header>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste an article, essay, or message..."
                className="w-full h-48 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">{text.length} chars</span>
                <div className="flex gap-2">
                  <PressScale
                    onClick={() => setText("")}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary flex items-center gap-1 text-muted-foreground"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </PressScale>
                  <PressScale
                    onClick={async () => {
                      try {
                        const t = await navigator.clipboard.readText();
                        setText(t || SAMPLE);
                      } catch {
                        setText(SAMPLE);
                      }
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-gradient-primary text-primary-foreground flex items-center gap-1 font-semibold"
                  >
                    <Clipboard className="w-3 h-3" /> Auto-Paste
                  </PressScale>
                </div>
              </div>
            </div>

            <SlideToAnalyze
              disabled={text.trim().length < 20}
              onComplete={() => {
                setSentences(mockAnalyze(text));
                setPhase("scanning");
              }}
              label={text.trim().length < 20 ? "Add more text…" : "Slide to analyze"}
            />
          </motion.div>
        )}

        {phase === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ScanProgress onDone={() => setPhase("results")} />
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-3xl bg-gradient-surface border border-border p-5 shadow-card">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${score > 50 ? "bg-gradient-danger" : "bg-success"} shadow-glow`}>
                  <span className="text-2xl font-extrabold text-primary-foreground">{score}%</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Likely AI</p>
                  <p className="text-lg font-bold">
                    {score > 50 ? "Suspicious" : "Mostly human"}
                  </p>
                  <p className="text-xs text-muted-foreground">{sentences.filter((s) => s.ai).length} of {sentences.length} sentences flagged</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-4 leading-relaxed text-sm shadow-card">
              {sentences.map((s, i) => (
                <span key={i}>
                  <PressScale
                    onClick={() => s.ai && setOpenIdx(openIdx === i ? null : i)}
                    className={`inline ${s.ai ? "bg-destructive/25 text-foreground rounded px-1 cursor-pointer" : ""}`}
                  >
                    {s.text}
                  </PressScale>{" "}
                </span>
              ))}
            </div>

            <AnimatePresence>
              {openIdx !== null && sentences[openIdx]?.ai && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-destructive uppercase tracking-wider">
                        {sentences[openIdx].confidence}% AI confidence
                      </p>
                      <p className="text-sm mt-1">{sentences[openIdx].reason}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <PressScale
              onClick={reset}
              className="w-full py-3 rounded-full border border-border bg-card text-sm font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Scan another
            </PressScale>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
