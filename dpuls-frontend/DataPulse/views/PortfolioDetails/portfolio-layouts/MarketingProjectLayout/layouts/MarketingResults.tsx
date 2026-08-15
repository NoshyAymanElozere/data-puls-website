import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingResults({project, content}: Props) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 text-center">
        <Reveal>
          <div className="mb-24">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-slate-950 mb-8 leading-none">
              {content?.results?.title}
            </h2>
            <p className="text-2xl text-slate-400 font-medium italic max-w-4xl mx-auto leading-tight">
              "{project.results?.impact}"
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:divide-x divide-slate-100">
            {project.results?.metrics.map((metric, i) => (
              <div key={i} className="px-8">
                <div className="text-8xl font-black text-brand-600 mb-4 tracking-tighter">
                  {metric.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
