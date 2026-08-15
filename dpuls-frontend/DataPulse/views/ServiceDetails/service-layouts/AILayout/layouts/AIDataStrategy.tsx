import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIDataStrategy({categoryContent}: Props) {
  return (
    <section className="py-24 bg-white/5">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-16 text-center">
            {categoryContent?.tech_stack_title || "Data Strategy & Governance"}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-700 z-0"></div>

          {(categoryContent?.data_strategy || []).map(
            (step: any, idx: number) => (
              <Reveal key={idx} delay={idx * 150}>
                <div className="relative z-10 bg-[#0f172a] p-6 rounded-xl border border-slate-700 h-full">
                  <div className="w-16 h-16 bg-black border border-slate-600 rounded-full flex items-center justify-center text-xl font-bold text-white mb-6 mx-auto md:mx-0 relative z-20">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center md:text-start">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white text-center md:text-start">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
