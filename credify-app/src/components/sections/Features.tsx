"use client";

import { motion } from "framer-motion";
import { Search, FileText, ShieldAlert } from "lucide-react";
import { useVerification } from "@/context/VerificationContext";

export default function Features() {
  const { telemetryLogs, score, result } = useVerification();
  


  return (
    <section id="features" className="relative z-10 w-full py-24 px-6 pointer-events-auto bg-void">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 — Diagnostic Shuffler */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 flex flex-col group cursor-pointer hover:border-plasma/50 transition-colors"
        >
          <Search className="w-8 h-8 text-plasma mb-6" />
          <h3 className="text-xl font-sora font-semibold text-ghost mb-2">Authenticity Detection</h3>
          <p className="text-sm text-gray-400 mb-8 flex-grow">
            AI-powered pattern matching for signatures, metadata anomalies, and layout forgery.
          </p>
          <div className="h-32 bg-graphite rounded border border-white/5 relative overflow-hidden flex flex-col items-center justify-center font-data text-xs text-ghost p-4 text-center">
            {result?.student_name ? (
              <>
                <span className="text-plasma block mb-2">Subject Identified:</span>
                <span className="truncate w-full">{result.student_name}</span>
                <span className="text-gray-500 mt-1">Roll: {result.roll_number}</span>
              </>
            ) : (
              <>
                <div className="absolute w-16 h-20 bg-plasma/20 border border-plasma/50 group-hover:-translate-x-4 group-hover:rotate-[-5deg] transition-transform duration-500"></div>
                <div className="absolute w-16 h-20 bg-white/5 border border-white/20 z-10 group-hover:translate-x-4 group-hover:rotate-[5deg] transition-transform duration-500"></div>
              </>
            )}
          </div>
        </motion.div>

        {/* Card 2 — Telemetry Typewriter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 flex flex-col group cursor-pointer hover:border-plasma/50 transition-colors"
        >
          <FileText className="w-8 h-8 text-plasma mb-6" />
          <h3 className="text-xl font-sora font-semibold text-ghost mb-2">OCR Cross-Verification</h3>
          <p className="text-sm text-gray-400 mb-8 flex-grow">
            Automated text extraction and real-time database validation.
          </p>
          <div className="h-32 bg-[#05050A] rounded border border-white/5 p-4 flex flex-col justify-end font-data text-xs text-plasma/80 overflow-hidden relative">
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
               {telemetryLogs.slice(-3).map((log, i) => (
                 <span key={i} className={i === telemetryLogs.slice(-3).length - 1 ? "text-ghost" : "text-gray-600 truncate"}>
                   {i === telemetryLogs.slice(-3).length - 1 && <span className="animate-pulse mr-1">&gt; _</span>}
                   {log}
                 </span>
               ))}
            </div>
          </div>
        </motion.div>

        {/* Card 3 — Cursor Protocol Scheduler */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 flex flex-col group cursor-pointer hover:border-plasma/50 transition-colors"
        >
          <ShieldAlert className="w-8 h-8 text-plasma mb-6" />
          <h3 className="text-xl font-sora font-semibold text-ghost mb-2">Trust Score Engine</h3>
          <p className="text-sm text-gray-400 mb-8 flex-grow">
            Real-time fraud risk analysis and confidence threshold activation.
          </p>
          <div className="h-32 bg-graphite rounded border border-white/5 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
             {/* Animated background height based on score */}
             <div 
                className="absolute bottom-0 left-0 right-0 bg-plasma/10 transition-all duration-1000" 
                style={{ height: `${score}%` }}
             ></div>
             
             <div className="text-4xl font-data text-plasma z-10 transition-all duration-1000">
                {Math.round(score)}%
             </div>
             
             <div className={`px-3 py-1 border text-[10px] uppercase tracking-widest rounded-sm z-10 transition-colors ${
               score > 80 ? "bg-green-500/20 text-green-400 border-green-500/30" : 
               score > 40 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : 
               "bg-red-500/20 text-red-400 border-red-500/30"
             }`}>
                {score > 80 ? "Low Risk" : score > 40 ? "Review Needed" : "High Risk"}
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
