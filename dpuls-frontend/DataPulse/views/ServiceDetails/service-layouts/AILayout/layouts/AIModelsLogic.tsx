import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIModelsLogic({categoryContent}: Props) {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {categoryContent?.philosophy_title}
              </h2>
              <p className="text-white">
                {categoryContent?.philosophy_subtitle}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(categoryContent?.models_logic || []).map(
            (model: any, idx: number) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="bg-[#111827] border border-slate-800 p-6 rounded-lg h-full hover:border-brand-500/50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-400 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-diagram-project"></i>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {model.title}
                  </h3>
                  <p className="text-sm text-white leading-relaxed">
                    {model.desc}
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
