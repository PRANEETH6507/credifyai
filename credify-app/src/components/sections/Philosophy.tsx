"use client";

import { motion } from "framer-motion";

export default function Philosophy() {
  return (
    <section className="relative z-10 w-full min-h-screen flex items-center bg-void pointer-events-auto border-t border-plasma/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-4">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 font-sora text-sm leading-relaxed max-w-xs"
          >
            Most verification systems focus on: Manual review, static document checks, delayed approval cycles.
          </motion.p>
        </div>

        <div className="lg:col-span-8 border-l border-plasma/20 pl-8 lg:pl-16 py-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-drama text-5xl md:text-7xl lg:text-8xl text-ghost leading-tight"
          >
            We focus on real-time <br />
            infrastructure for <br />
            <span className="text-plasma block mt-4 text-6xl md:text-8xl lg:text-9xl">Trust.</span>
          </motion.h2>
        </div>

      </div>
    </section>
  );
}
