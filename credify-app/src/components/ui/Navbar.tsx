"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-panel border-b border-white/5"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-8 h-8 text-plasma" />
        <span className="text-xl font-bold tracking-widest text-ghost uppercase font-sora">Credify<span className="text-plasma">AI</span></span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest font-sora">
        <a href="#" className="hover:text-plasma transition-colors">Verify</a>
        <a href="#" className="hover:text-plasma transition-colors">Network</a>
        <a href="#" className="hover:text-plasma transition-colors">Documentation</a>
      </div>

      <button className="md:hidden text-ghost">
        <Menu className="w-6 h-6" />
      </button>
    </motion.nav>
  );
}
