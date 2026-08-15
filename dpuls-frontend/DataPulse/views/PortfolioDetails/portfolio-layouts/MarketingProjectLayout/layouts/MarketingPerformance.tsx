import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingPerformance({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              {content?.performance?.title}
            </h2>
            <p className="text-slate-900 text-sm uppercase tracking-[0.3em]">
              {content?.performance?.sub_label}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {content?.performance?.metrics?.map((m: any, i: number) => {
              const colors = [
                "text-brand-400",
                "text-white",
                "text-white",
                "text-brand-500",
              ];
              // Using hardcoded mock values since they were hardcoded in the original template
              // Ideally these should come from project.metrics or similar if available,
              // but matchingoriginal structure where value was tied to the label in that list.
              // Wait, the original had values embedded.
              // {label: "CPA Reduction", val: "-42%", color: "text-brand-400"},
              // I strip values to maintain localization structure, but I need values.
              // I will stick to the hardcoded values from original file as fallbacks or structure,
              // but typically strict localization means even values might come from data or JSON if static.
              // However, "values" like -42% are usually data.
              // I'll assume they are hardcoded mock data for now as per the "no logic changes" rule,
              // but I must ensure the labels come from JSON.

              const values = ["-42%", "+85%", "3.2x", "18.5%"];

              return (
                <div
                  key={i}
                  className="p-10 border border-white/5 bg-white/5 rounded-3xl group hover:border-brand-500/50 transition-colors"
                >
                  <div
                    className={`text-6xl font-black ${colors[i % 4]} mb-3 tracking-tighter group-hover:scale-105 transition-transform origin-left`}
                  >
                    {values[i]}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
