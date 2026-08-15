import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobilePainPoints({project, content}: Props) {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Side: Editorial Anchor */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-10 bg-brand-500 rounded-full"></div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  {content?.pain_points?.title ? (
                    <>
                      {content.pain_points.title
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}{" "}
                      <br />
                      <span className="text-slate-300">
                        {content.pain_points.title
                          .split(" ")
                          .slice(2)
                          .join(" ")}
                      </span>
                    </>
                  ) : (
                    "Pain Point Analysis."
                  )}
                </h2>
              </div>
              <p className="text-xl text-slate-500 leading-relaxed max-w-sm mb-8 font-medium italic">
                "{content?.pain_points?.quote}"
              </p>

              {/* Monospace Diagnostic Label */}
              <div className="inline-block px-4 py-2 bg-slate-50 border border-slate-100 rounded  text-[10px] text-slate-400 uppercase tracking-[0.3em]">
                {content?.pain_points?.audit_label} {project.id}_Audit_04
              </div>
            </Reveal>
          </div>

          {/* Right Side: The Diagnostic List */}
          <div className="lg:col-span-7">
            <div className="flex flex-col">
              {(
                project.challenge?.points || content?.pain_points?.defaults
              ).map((point: string, i: number) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="group flex flex-col md:flex-row md:items-center gap-6 py-10 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-4 -mx-4 rounded-xl">
                    {/* Points Metadata */}
                    <div className="flex flex-col gap-1 w-24 flex-shrink-0">
                      <span className="text-xs  font-bold text-red-500 tracking-widest uppercase opacity-70">
                        {content?.pain_points?.issue_prefix}0{i + 1}
                      </span>
                      <div className="w-6 h-0.5 bg-red-100 group-hover:w-full group-hover:bg-red-500 transition-all duration-700"></div>
                    </div>

                    {/* The Content */}
                    <div className="flex-1">
                      <p className="text-xl md:text-2xl font-bold text-slate-800 leading-tight group-hover:translate-x-2 transition-transform duration-500 ease-out">
                        {point}
                      </p>
                    </div>

                    {/* Simple Status Icon */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center text-red-500">
                        <i className="fa-solid fa-bolt-lightning text-xs"></i>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Impact Summary Line */}
            <Reveal delay={500}>
              <div className="mt-12 pt-8 border-t-2 border-slate-900 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  {content?.pain_points?.impact_label}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm  text-slate-500 uppercase tracking-widest">
                    {content?.pain_points?.metric_label}
                  </span>
                  <span className="text-3xl font-black text-red-600">
                    {content?.pain_points?.metric_val}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
