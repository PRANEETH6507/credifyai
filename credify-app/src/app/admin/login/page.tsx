"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, User, AlertCircle } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials. Access Denied.");
      }
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-void flex items-center justify-center p-4 overflow-hidden select-none font-sora">
      <Navbar />

      {/* Futuristic Background Lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-plasma/10 blur-[120px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none animate-pulse duration-[4s]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-2xl p-8 border border-white/5 shadow-2xl relative overflow-hidden bg-graphite/40">
          {/* Top subtle neon line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-plasma to-transparent" />

          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-plasma/10 border border-plasma/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(123,97,255,0.15)]">
              <ShieldCheck className="w-9 h-9 text-plasma" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-ghost uppercase">
              Registrar <span className="text-plasma">Portal</span>
            </h1>
            <p className="text-xs text-gray-500 mt-2 font-data">
              SECURE CRYPTOGRAPHIC REGISTRY CONSOLE
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3.5 mb-6 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-data"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-data">
                Terminal ID (Username)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator ID..."
                  className="w-full bg-[#0D0D18] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-ghost focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all font-data placeholder:text-gray-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-data">
                Authorization Key (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0D0D18] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-ghost focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all font-data placeholder:text-gray-600 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-plasma hover:bg-plasma/90 text-void font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(123,97,255,0.2)] hover:shadow-[0_0_25px_rgba(123,97,255,0.35)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-xs"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Establish Session"
              )}
            </button>
          </form>

          {/* Secure watermark */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 font-data">
            <span>SECURE CHANNEL (SHA-256)</span>
            <span>IP: LOCALHOST</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
