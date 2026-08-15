import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingPerformance({categoryContent}: Props) {
  const kpis = categoryContent?.performance?.kpis || [];

  return (
    <section className="py-24 bg-white border-y border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl  font-bold text-center mb-16">
            {categoryContent?.performance?.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {kpis.map((kpi: any, idx: number) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="p-4">
                <div className="text-5xl lg:text-6xl font-black text-brand-600 mb-2">
                  {kpi.value}
                </div>
                <div className="text-xl font-bold text-brand-900 mb-2">
                  {kpi.label}
                </div>
                <p className="text-sm text-slate-900">{kpi.context}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
