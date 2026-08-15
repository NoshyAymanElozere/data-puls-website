import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  content: any;
}

export default function AIProjectPerformance({content}: Props) {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                <span className="text-brand-600  text-[10px] font-bold uppercase tracking-[0.3em]">
                  {content?.performance?.label}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                {content?.performance?.title ? (
                  <>
                    {content.performance.title
                      .split(".")
                      .slice(0, -1)
                      .join(".")}{" "}
                    <br />
                    <span className="text-slate-300">.</span>
                  </>
                ) : (
                  "Performance Metrics."
                )}
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed font-medium">
              {content?.performance?.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {content?.performance?.metrics?.map((metric: any, i: number) => {
              const colors = [
                "border-brand-500",
                "border-slate-200",
                "border-slate-200",
                "border-slate-200",
              ];
              return (
                <div
                  key={i}
                  className={`p-10 border-b-4 ${colors[i % 4]} bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 group`}
                >
                  <div className="text-xs  text-slate-400 mb-8 uppercase tracking-widest">
                    {content?.performance?.diagnostic_prefix}0{i + 1}
                  </div>
                  <div className="text-5xl font-black text-slate-900 mb-3 tracking-tighter group-hover:text-brand-600 transition-colors">
                    {metric.value}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
