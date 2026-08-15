import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudPerformance({categoryContent}: Props) {
  const cards = categoryContent?.performance?.cards || [];
  const icons = ["fa-gauge-high", "fa-bolt", "fa-database"];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            {categoryContent?.performance?.title}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card: any, idx: number) => (
            <Reveal key={idx} delay={(idx + 1) * 100}>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <i
                  className={`fa-solid ${icons[idx]} text-3xl text-brand-600 mb-4`}
                ></i>
                <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-600">{card.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
