import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingAudience({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-24 gap-8">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                {content?.audience?.title}
              </h2>
              <div className="mt-4 text-[10px] font-bold text-brand-600 uppercase tracking-widest">
                {content?.audience?.label}
              </div>
            </div>
            <p className="text-slate-500 max-w-sm text-sm">
              {content?.audience?.desc}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
          {project.marketingSpec?.audienceSegments.map((segment, i) => (
            <Reveal key={i} delay={i * 200}>
              <div className="bg-white p-12 lg:p-20 hover:bg-slate-900 hover:text-white transition-all duration-500 group">
                <span className="block text-[10px]  font-bold text-slate-400 mb-8 uppercase tracking-widest">
                  {content?.audience?.segment_prefix}0{i + 1}
                </span>
                <h3 className="text-4xl font-black mb-8 group-hover:translate-x-4 transition-transform duration-500 uppercase tracking-tighter">
                  {segment.name}
                </h3>
                <div className="flex gap-4 mb-10">
                  <span className="px-3 py-1 border border-current opacity-30 rounded-full text-[10px] font-bold uppercase">
                    {content?.audience?.tags?.primary}
                  </span>
                  <span className="px-3 py-1 border border-current opacity-30 rounded-full text-[10px] font-bold uppercase">
                    {content?.audience?.tags?.high_value}
                  </span>
                </div>
                <p className="text-xl font-medium leading-relaxed italic opacity-70">
                  "{segment.insight}"
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
