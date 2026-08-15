import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareCapabilities({categoryContent}: Props) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="mb-16">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-xs">
              {categoryContent?.capabilities?.label}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-slate-900">
              {categoryContent?.features_title}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryContent?.details?.benefits?.map(
            (benefit: any, i: number) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all group h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <i
                        className={`fa-solid ${i % 2 === 0 ? "fa-layer-group" : "fa-code-branch"}`}
                      ></i>
                    </div>
                    <span className=" text-xs text-slate-900">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-900 text-sm leading-relaxed text-start">
                    {benefit.desc}
                  </p>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
