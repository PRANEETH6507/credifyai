"use client";

import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-graphite border-t border-white/5 py-12 px-6 relative z-10 pointer-events-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/5 pb-12 mb-8">
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-plasma" />
            <span className="text-lg font-bold tracking-widest text-ghost uppercase font-sora">Credify<span className="text-plasma">AI</span></span>
          </div>
          <p className="text-sm text-gray-500 font-sora">
            Verification infrastructure for institutional trust.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-gray-400 font-sora">
          <a href="#" className="hover:text-plasma transition-colors w-fit">API Documentation</a>
          <a href="#" className="hover:text-plasma transition-colors w-fit">Integration Guide</a>
          <a href="#" className="hover:text-plasma transition-colors w-fit">Trust Network</a>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 font-sora">
          <div className="flex items-center gap-2 bg-[#11111A] border border-white/5 px-3 py-1.5 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-ghost uppercase tracking-widest">System Operational</span>
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-widest">
            API Status: 100% Uptime
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-sora uppercase tracking-widest">
        <span>&copy; 2026 CredifyAI. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Compliance</a>
        </div>
      </div>
    </footer>
  );
}
