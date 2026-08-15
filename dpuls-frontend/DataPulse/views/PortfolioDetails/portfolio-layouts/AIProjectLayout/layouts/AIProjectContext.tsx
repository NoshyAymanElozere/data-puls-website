import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectContext({project, content}: Props) {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="text-brand-600  text-xs font-bold uppercase tracking-widest mb-4 block">
                {content?.context?.label}
              </span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-8">
                {content?.context?.title ? (
                  <>
                    {content.context.title.split(".").slice(0, -1).join(".")}{" "}
                    <br />
                    <span className="text-slate-300">.</span>
                  </>
                ) : (
                  "The AI Context." // Fallback
                )}
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed font-light">
                {content?.context?.intro}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={200}>
              <div className="bg-slate-50 rounded-3xl p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-brand-600/5 group-hover:text-brand-600/10 transition-colors">
                  <i className="fa-solid fa-brain text-[15rem]"></i>
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    {content?.context?.objective_title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    {project.overview?.about}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border-l-2 border-brand-500 pl-6">
                      <h4 className="font-bold text-slate-900 mb-2">
                        {content?.context?.goal_title}
                      </h4>
                      <p className="text-sm text-slate-900">
                        {project.overview?.goal}
                      </p>
                    </div>
                    <div className="border-l-2 border-slate-200 pl-6">
                      <h4 className="font-bold text-slate-900 mb-2">
                        {content?.context?.impact_title}
                      </h4>
                      <p className="text-sm text-slate-900">
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
