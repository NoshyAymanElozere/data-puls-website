import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareUseCases({categoryContent}: Props) {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            {categoryContent?.use_cases_title}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryContent?.use_cases_items?.map((uc: any, idx: number) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
                  {uc.industry}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {uc.title}
                </h3>
                <p className="text-slate-900 text-sm leading-relaxed text-start">
                  {uc.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
