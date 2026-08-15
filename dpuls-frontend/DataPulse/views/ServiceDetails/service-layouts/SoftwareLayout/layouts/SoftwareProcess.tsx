import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareProcess({categoryContent}: Props) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">
            {categoryContent?.process_title}
          </h2>
        </Reveal>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {categoryContent?.details?.process?.map(
              (step: any, idx: number) => (
                <Reveal key={idx} delay={idx * 150}>
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 relative">
                    {/* Step Number Badge */}
                    <div className="absolute -top-5 left-8 bg-brand-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ring-4 ring-slate-50">
                      {idx + 1}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-slate-900 text-sm leading-relaxed text-start">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
