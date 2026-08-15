import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingContext({project, content}: Props) {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">
                {content?.context?.title ? (
                  <>
                    {content.context.title.split(" ").slice(0, 1)} <br />
                    <span className="text-brand-600">
                      {content.context.title.split(" ").slice(1).join(" ")}
                    </span>
                  </>
                ) : (
                  "Contextual Dynamics."
                )}
              </h2>
              <div className="w-20 h-1 bg-slate-900 mb-8"></div>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                {content?.context?.desc}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={200}>
              <div className="p-12 lg:p-20 bg-slate-50 border border-slate-100 rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-3xl font-bold text-slate-900 leading-tight mb-12">
                    {project.overview?.about}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block mb-4">
                        {content?.context?.labels?.objective}
                      </span>
                      <p className="text-slate-600 font-medium">
                        {project.overview?.goal}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block mb-4">
                        {content?.context?.labels?.target}
                      </span>
                      <p className="text-slate-600 font-medium">
                        {project.overview?.audience}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
