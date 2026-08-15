import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingExecution({project, content}: Props) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-center mb-24">
            {content?.execution?.title}
          </h2>
        </Reveal>
        <div className="flex flex-col md:flex-row items-center justify-between gap-px bg-slate-100 border border-slate-100">
          {content?.execution?.phases?.map((step: any, i: number) => (
            <Reveal key={i} delay={i * 200} className="flex-1 w-full">
              <div className="h-full bg-white p-12 hover:bg-slate-50 transition-colors group">
                <span className="text-[10px]  font-bold text-brand-600 mb-6 block uppercase tracking-[0.4em]">
                  {content?.execution?.phase_prefix}0{i + 1}
                </span>
                <h4 className="text-2xl font-black uppercase mb-4 tracking-tighter group-hover:translate-x-2 transition-transform">
                  {step.title}
                </h4>
                <p className="text-slate-900 text-sm leading-relaxed text-start">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
