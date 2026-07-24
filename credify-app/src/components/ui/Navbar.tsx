"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 glass-panel border-b border-white/5"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-plasma" />
          <span className="text-xl font-bold tracking-widest text-ghost uppercase font-sora">
            Credify<span className="text-plasma">AI</span>
          </span>
        </div>
        
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest font-sora">
          <a href="#" className="hover:text-plasma transition-colors">Verify</a>
          <a href="#" className="hover:text-plasma transition-colors">Network</a>
          <a href="#" className="hover:text-plasma transition-colors">Documentation</a>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-ghost focus:outline-none z-50"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-void/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-8 text-lg font-medium text-gray-400 uppercase tracking-widest font-sora">
              <a 
                href="#" 
                onClick={() => setIsOpen(false)} 
                className="hover:text-plasma transition-colors"
              >
                Verify
              </a>
              <a 
                href="#" 
                onClick={() => setIsOpen(false)} 
                className="hover:text-plasma transition-colors"
              >
                Network
              </a>
              <a 
                href="#" 
                onClick={() => setIsOpen(false)} 
                className="hover:text-plasma transition-colors"
              >
                Documentation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
