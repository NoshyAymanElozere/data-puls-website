import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIProcess({categoryContent}: Props) {
  return (
    <section className="py-24 bg-[#050a1f] border-t border-white/5">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-16 text-center">
            {categoryContent?.process_title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {(categoryContent?.development_lifecycle || []).map(
            (phase: any, idx: number) => (
              <Reveal key={idx} delay={idx * 150}>
                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full border-2 border-brand-500/30 flex items-center justify-center mb-6 group-hover:border-brand-500 group-hover:bg-brand-500/10 transition-all">
                    <span className="text-2xl font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {phase.step}
                  </h3>
                  <p className="text-sm text-white">{phase.desc}</p>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
