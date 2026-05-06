import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, FileText, Image as ImageIcon, History, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PressScale } from "./PressScale";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/text", icon: FileText, label: "Text" },
  { to: "/media", icon: ImageIcon, label: "Media" },
  { to: "/history", icon: History, label: "History" },
] as const;

export function MobileShell() {
  const { pathname } = useLocation();

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="safe-top safe-x px-5 pb-3 flex items-center justify-between glass sticky top-0 z-40 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-none">Veritas</p>
            <p className="text-sm font-bold leading-tight">AI Detector</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-primary text-primary-foreground tracking-wider">
            PRO
          </span>
          <PressScale className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border">
            <User className="w-4 h-4 text-foreground" />
          </PressScale>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 safe-x pb-28">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] safe-bottom safe-x px-4 pt-2 z-40">
        <div className="glass rounded-3xl border border-border/60 shadow-card flex items-center justify-around px-2 py-2">
          {tabs.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-0.5 py-1.5 relative"
                >
                  {active && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-2xl bg-primary/15"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-[10px] font-medium relative ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
