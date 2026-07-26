"use client";

import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useVerification } from "@/context/VerificationContext";
import { verifyCertificate } from "@/lib/api";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const { status, setStatus, setScore, result, setResult, addLog } = useVerification();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !email) return;

    setStatus("scanning");
    setScore(0);
    setResult(null);
    
    // Call the API
    const data = await verifyCertificate(url, email, addLog, setScore);
    
    // Update Context when finished
    setResult(data);
    setStatus(data.verification_status || "fake");
    setScore(data.confidence ? data.confidence * 100 : 0);
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4 text-center pointer-events-auto">
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-ghost tracking-tighter uppercase leading-[0.9]">
          Verification <br />
          <span className="font-drama font-normal text-plasma normal-case tracking-normal">beyond</span> <br />
          Doubt.
        </h1>
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 mt-8 text-lg text-gray-400 max-w-xl font-light font-sora"
      >
        Real-time AI validation for certificates, credentials, and institutional records.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="relative z-10 mt-12 w-full max-w-lg"
      >
        {status === "idle" ? (
          <form onSubmit={handleVerify} className="glass-panel p-6 flex flex-col gap-4 text-left shadow-[0_0_20px_rgba(123,97,255,0.05)]">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block font-sora">Certificate URL (PDF/Image)</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://example.com/cert.pdf"
                className="w-full bg-[#11111A] border border-white/10 px-4 py-3 text-sm text-ghost font-data focus:outline-none focus:border-plasma transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block font-sora">Notification Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@institution.edu"
                className="w-full bg-[#11111A] border border-white/10 px-4 py-3 text-sm text-ghost font-data focus:outline-none focus:border-plasma transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="mt-2 group relative w-full py-4 bg-plasma text-void font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-plasma/90 transition-colors"
            >
              Run a Verification <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="glass-panel p-8 flex flex-col items-center gap-6 shadow-[0_0_30px_rgba(123,97,255,0.15)] border-plasma/30">
            {status === "scanning" && (
              <>
                <Loader2 className="w-12 h-12 text-plasma animate-spin" />
                <div className="text-plasma font-sora uppercase tracking-widest text-sm animate-pulse">
                  System Scanning...
                </div>
                <div className="text-xs text-gray-400 font-data">Scroll down to view telemetry</div>
              </>
            )}
            {status === "verified" && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-500 text-2xl font-bold font-sora">
                  ✓
                </div>
                <div className="text-green-500 font-sora uppercase tracking-widest font-bold">
                  Verified Authentic
                </div>
                {result?.student_name && (
                  <div className="text-xs text-gray-400 font-data text-center">
                    Subject: <span className="text-ghost">{result.student_name}</span> <br/>
                    Roll Number: <span className="text-ghost">{result.roll_number}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 px-6 py-2 border border-white/20 text-ghost text-xs uppercase tracking-wider hover:bg-white/5 transition-colors font-sora"
                >
                  Verify Another
                </button>
              </>
            )}
            {status === "fake" && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-500 text-2xl font-bold font-sora">
                  X
                </div>
                <div className="text-red-500 font-sora uppercase tracking-widest font-bold">
                  Fraud Detected
                </div>
                {result?.reason && (
                  <div className="text-xs text-red-400/90 font-data text-center max-w-xs">
                    <span className="font-semibold block mb-1">Reason: {result.reason}</span>
                    {result.message && <p className="text-gray-400 mt-1 text-[11px] leading-relaxed">{result.message}</p>}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 px-6 py-2 border border-white/20 text-ghost text-xs uppercase tracking-wider hover:bg-white/5 transition-colors font-sora"
                >
                  Try Again
                </button>
              </>
            )}
            {status === "failed" && (
              <>
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-yellow-500 text-2xl font-bold font-sora">
                  !
                </div>
                <div className="text-yellow-500 font-sora uppercase tracking-widest font-bold">
                  Engine Offline
                </div>
                <div className="text-xs text-gray-400 font-data text-center max-w-xs">
                  Next.js was unable to establish a connection with the n8n backend. Verify that your tunnel/server is online.
                </div>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 px-6 py-2 border border-white/20 text-ghost text-xs uppercase tracking-wider hover:bg-white/5 transition-colors font-sora"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
}
