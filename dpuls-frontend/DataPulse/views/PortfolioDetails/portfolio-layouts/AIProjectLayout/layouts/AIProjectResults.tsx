import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectResults({project, content}: Props) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase">
              {content?.results?.title}
            </h2>
            <p className="text-slate-500 text-lg italic">
              "{project.results?.impact}"
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {project.results?.metrics.map((metric, i) => (
              <div key={i} className="pt-12 md:pt-0">
                <div className="text-7xl font-black text-slate-900 mb-4 tracking-tighter">
                  {metric.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">
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
