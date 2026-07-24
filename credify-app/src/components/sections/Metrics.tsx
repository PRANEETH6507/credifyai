"use client";

import { motion } from "framer-motion";

export default function Metrics() {
  return (
    <section className="relative z-10 w-full border-y border-plasma/20 bg-void/50 backdrop-blur-md py-6 pointer-events-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-plasma/20">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center py-4"
        >
          <span className="font-data text-3xl text-ghost">12,400+</span>
          <span className="text-xs uppercase tracking-widest text-gray-500 mt-2 font-sora">Verifications</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center py-4"
        >
          <span className="font-data text-3xl text-plasma">99.7%</span>
          <span className="text-xs uppercase tracking-widest text-gray-500 mt-2 font-sora">Accuracy</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-4"
        >
          <span className="font-data text-3xl text-ghost">&lt; 3s</span>
          <span className="text-xs uppercase tracking-widest text-gray-500 mt-2 font-sora">Response Time</span>
        </motion.div>

      </div>
    </section>
  );
}
