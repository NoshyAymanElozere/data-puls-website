import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingJourney({categoryContent}: Props) {
  const steps = categoryContent?.journey?.steps || [];

  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl  font-bold mb-16 text-center">
            {categoryContent?.journey?.title}
          </h2>
        </Reveal>

        <div className="relative">
          {/* Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step: any, idx: number) => (
              <Reveal key={idx} delay={idx * 150}>
                <div className="bg-white p-8 shadow-lg border border-slate-100 rounded-xl relative">
                  <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-sm mb-6 mx-auto md:mx-0">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-2 text-center md:text-start">
                    {step.stage}
                  </h3>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center md:text-start">
                    Intent: {step.intent}
                  </div>
                  <p className="text-sm text-slate-600 text-center md:text-start italic">
                    "{step.action}"
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
