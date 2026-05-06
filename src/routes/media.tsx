import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Camera, Upload, Image as ImageIcon, Video, AlertTriangle } from "lucide-react";
import { PressScale } from "@/components/mobile/PressScale";
import { SlideToAnalyze } from "@/components/mobile/SlideToAnalyze";
import { ScanProgress } from "@/components/mobile/ScanProgress";

export const Route = createFileRoute("/media")({
  component: MediaScan,
  head: () => ({
    meta: [
      { title: "Media Scan — Veritas AI" },
      { name: "description", content: "Detect deepfakes in photos and video with biometric radar analysis." },
    ],
  }),
});

type Phase = "idle" | "scanning" | "results";
type Mode = "image" | "video";

const flaggedMoments = [
  { time: "0:04", confidence: 92, label: "Face morphing" },
  { time: "0:11", confidence: 87, label: "Lip-sync mismatch" },
  { time: "0:23", confidence: 78, label: "Eye blink anomaly" },
  { time: "0:41", confidence: 95, label: "Synthetic skin texture" },
];

function MediaScan() {
  const [mode, setMode] = useState<Mode>("image");
  const [file, setFile] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    setFile(URL.createObjectURL(f));
    setPhase("idle");
  };

  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Media Scan</h1>
        <p className="text-sm text-muted-foreground">Detect deepfakes & generated media.</p>
      </header>

      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-card border border-border p-1">
        {(["image", "video"] as const).map((m) => (
          <PressScale
            key={m}
            onClick={() => { setMode(m); setFile(null); setPhase("idle"); }}
            className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
              mode === m ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >
            {m === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            {m === "image" ? "Image" : "Video"}
          </PressScale>
        ))}
      </div>

      <input ref={inputRef} type="file" accept={mode === "image" ? "image/*" : "video/*"} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <input ref={camRef} type="file" accept={mode === "image" ? "image/*" : "video/*"} capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      <AnimatePresence mode="wait">
        {!file && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-3xl border-2 border-dashed border-border bg-card/60 p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <Upload className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="font-semibold">Upload {mode === "image" ? "an image" : "a video"}</p>
              <p className="text-xs text-muted-foreground mt-1">From your library or camera</p>
              <div className="mt-5 grid grid-cols-2 gap-2 w-full">
                <PressScale onClick={() => inputRef.current?.click()} className="py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Library
                </PressScale>
                <PressScale onClick={() => camRef.current?.click()} className="py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm flex items-center justify-center gap-2 border border-border">
                  <Camera className="w-4 h-4" /> Camera
                </PressScale>
              </div>
            </div>
          </motion.div>
        )}

        {file && phase === "idle" && (
          <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-card aspect-[4/5] bg-black">
              {mode === "image" ? (
                <>
                  <img src={file} alt="Upload preview" className="w-full h-full object-cover" />
                  {/* Biometric Radar */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-[35%] top-[30%] w-24 h-24 -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute inset-0 rounded-full border-2 border-primary/70 animate-radar" />
                      <div className="absolute inset-0 rounded-full border-2 border-accent/70 animate-radar" style={{ animationDelay: "0.7s" }} />
                      <div className="absolute inset-0 rounded-full border border-primary/50" />
                    </div>
                    <div className="absolute top-3 left-3 text-[10px] font-mono px-2 py-1 rounded bg-black/60 text-primary border border-primary/40">
                      ◉ BIOMETRIC RADAR
                    </div>
                  </div>
                </>
              ) : (
                <video src={file} className="w-full h-full object-cover" controls />
              )}
            </div>
            <SlideToAnalyze onComplete={() => setPhase("scanning")} />
            <PressScale onClick={() => setFile(null)} className="w-full text-xs text-muted-foreground py-2">
              Choose different {mode}
            </PressScale>
          </motion.div>
        )}

        {phase === "scanning" && (
          <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ScanProgress onDone={() => setPhase("results")} />
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-3xl bg-gradient-danger p-5 shadow-glow">
              <p className="text-xs uppercase tracking-widest text-primary-foreground/80 font-semibold">Result</p>
              <p className="text-2xl font-extrabold text-primary-foreground">Likely Deepfake</p>
              <p className="text-sm text-primary-foreground/90 mt-1">94% AI confidence</p>
            </div>

            {mode === "video" && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Flagged Moments</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {flaggedMoments.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-surface border border-border relative overflow-hidden flex items-center justify-center">
                        <Video className="w-5 h-5 text-muted-foreground" />
                        <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono px-1 rounded bg-black/60 text-primary">{m.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{m.label}</p>
                        <p className="text-xs text-muted-foreground">at {m.time}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-destructive/20 text-destructive">
                        {m.confidence}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {mode === "image" && (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Synthetic facial structure detected</p>
                  <p className="text-muted-foreground text-xs mt-1">GAN fingerprint: StyleGAN-3 lineage. Eye asymmetry consistent with diffusion artifacts.</p>
                </div>
              </div>
            )}

            <PressScale onClick={() => { setFile(null); setPhase("idle"); }} className="w-full py-3 rounded-full bg-card border border-border text-sm font-semibold">
              Scan another
            </PressScale>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
