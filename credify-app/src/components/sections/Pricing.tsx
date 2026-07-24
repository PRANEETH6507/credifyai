"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section className="relative z-10 w-full py-24 px-6 bg-void pointer-events-auto">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-sora font-semibold text-ghost uppercase tracking-widest mb-4">
            Integration Plans
          </h2>
          <p className="text-gray-400">Scale your institutional trust infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Starter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 flex flex-col h-[400px]"
          >
            <h3 className="text-xl font-sora text-ghost uppercase tracking-wider mb-2">Starter</h3>
            <p className="text-xs text-gray-500 mb-8 h-8">For institutions validating limited volume.</p>
            <div className="flex-grow">
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> 1,000 requests/mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> Standard OCR</li>
                <li className="flex items-center gap-2 text-gray-600"><Check className="w-4 h-4" /> API Access</li>
              </ul>
            </div>
          </motion.div>

          {/* Scale (Highlighted) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#11111A] border border-plasma p-10 flex flex-col h-[450px] shadow-[0_0_30px_rgba(123,97,255,0.15)] relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-plasma text-void text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
              Recommended
            </div>
            <h3 className="text-2xl font-sora text-plasma uppercase tracking-wider mb-2">Scale</h3>
            <p className="text-xs text-gray-400 mb-8 h-8">High-volume automated verification.</p>
            <div className="flex-grow">
              <ul className="space-y-3 text-sm text-ghost">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> 50,000 requests/mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> Advanced OCR & Metadata</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> Full API Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> Risk Scoring</li>
              </ul>
            </div>
            <button className="w-full py-4 mt-6 bg-plasma text-void font-bold uppercase tracking-wider hover:bg-plasma/90 transition-colors">
              Start Integration
            </button>
          </motion.div>

          {/* Enterprise */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 flex flex-col h-[400px]"
          >
            <h3 className="text-xl font-sora text-ghost uppercase tracking-wider mb-2">Enterprise</h3>
            <p className="text-xs text-gray-500 mb-8 h-8">Full compliance + dedicated support.</p>
            <div className="flex-grow">
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> Unlimited volume</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> Custom Database Sync</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-plasma" /> Dedicated Node</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
