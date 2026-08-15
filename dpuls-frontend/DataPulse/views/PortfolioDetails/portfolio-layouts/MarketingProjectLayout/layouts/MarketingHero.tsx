import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingHero({project, content}: Props) {
  return (
    <section className="relative min-h-[90vh] pt-40 pb-20 flex flex-col justify-center border-b border-slate-100 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 skew-x-[-12deg] translate-x-1/2"></div>
      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-24">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-[2px] bg-brand-600"></div>
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400">
                  {content?.hero?.prefix}
                  {project.id}
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase mb-16">
                {project.title.split(" ").map((word, i) => (
                  <span key={i} className="block group cursor-default">
                    <span className="inline-block transition-transform duration-500 group-hover:translate-x-4">
                      {word}
                    </span>
                  </span>
                ))}
              </h1>
            </div>
            <div className="lg:w-1/3 pb-16">
              <div className="space-y-8">
                <div className="p-8 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                  <span className="block text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-4">
                    {content?.hero?.focus_label}
                  </span>
                  <p className="text-xl font-bold leading-tight uppercase">
                    {project.shortDesc}
                  </p>
                </div>
                <div className="flex gap-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      {/* Large Watermark */}
      <div className="absolute -bottom-10 left-10 text-[20rem] font-black text-slate-100 opacity-20 pointer-events-none select-none tracking-tighter leading-none uppercase">
        {content?.hero?.watermark}
      </div>
    </section>
  );
}
