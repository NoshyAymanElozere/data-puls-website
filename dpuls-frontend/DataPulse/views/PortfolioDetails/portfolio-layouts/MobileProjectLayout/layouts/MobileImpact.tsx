import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileImpact({project, content}: Props) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">
            {content?.impact?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {(project.results?.metrics || content?.impact?.defaults).map(
              (metric: any, i: number) => (
                <div key={i} className="pt-8 md:pt-0 px-4">
                  <div className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                    {metric.value}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-brand-600">
                    {metric.label}
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="text-lg text-slate-500 italic">
              "{project.results?.impact || content?.impact?.default_impact}"
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
