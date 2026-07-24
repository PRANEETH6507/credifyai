"use client";

import { motion } from "framer-motion";

export default function Protocol() {
  const steps = [
    {
      num: "01",
      title: "Ingest",
      desc: "Secure certificate intake & URL parsing.",
      top: "top-24"
    },
    {
      num: "02",
      title: "Analyze",
      desc: "OCR extraction + structured database matching.",
      top: "top-32"
    },
    {
      num: "03",
      title: "Score",
      desc: "Trust index computation + fraud risk classification.",
      top: "top-40"
    }
  ];

  return (
    <section className="relative z-10 w-full py-32 px-6 bg-void pointer-events-auto min-h-[150vh]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-sora font-semibold text-ghost mb-16 text-center uppercase tracking-widest">
          The Protocol
        </h2>
        
        <div className="flex flex-col gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`sticky ${step.top} w-full glass-panel p-8 md:p-12 border-t border-plasma/50 shadow-2xl shadow-black flex flex-col md:flex-row items-start md:items-center gap-8`}
            >
              <div className="font-data text-6xl text-plasma/30 font-bold">
                {step.num}
              </div>
              <div>
                <h3 className="text-2xl font-sora font-bold text-ghost uppercase tracking-wider mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-lg">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
