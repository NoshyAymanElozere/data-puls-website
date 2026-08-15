import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingStrategy({project, content}: Props) {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="relative">
              <span className="text-brand-600 font-bold text-xs uppercase tracking-widest mb-6 block">
                {content?.strategy?.label}
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">
                {content?.strategy?.title ? (
                  <>
                    {content.strategy.title.split(" ").slice(0, 1)} <br />
                    <span className="text-slate-200">
                      {content.strategy.title.split(" ").slice(1).join(" ")}
                    </span>
                  </>
                ) : (
                  "Category Rebirth."
                )}
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed mb-12 max-w-lg">
                {content?.strategy?.desc}
              </p>
              <div className="space-y-4">
                {project.marketingSpec?.growthLevers.map((lever, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <span className="text-xs  font-bold text-slate-300">
                      {content?.strategy?.lever_prefix}0{i + 1}
                    </span>
                    <span className="text-lg font-black uppercase group-hover:text-brand-600 transition-colors">
                      {lever}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="relative p-12 bg-slate-50 rounded-[4rem] border border-slate-100 group overflow-hidden">
            <Reveal delay={300}>
              {/* High Impact Visual - Minimal Geometric Growth */}
              <div className="aspect-square flex items-center justify-center relative">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-brand-600 overflow-visible"
                >
                  <path
                    d="M10,90 L90,10"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    className="opacity-20"
                  />
                  <path
                    d="M10,90 Q50,90 90,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="animate-reveal-up"
                    style={{animationDuration: "2s"}}
                  />
                  <circle cx="90" cy="10" r="4" fill="currentColor" />
                  <text
                    x="55"
                    y="45"
                    className="text-[4px] font-bold uppercase fill-slate-400"
                  >
                    {content?.strategy?.vector_label}
                  </text>
                </svg>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
