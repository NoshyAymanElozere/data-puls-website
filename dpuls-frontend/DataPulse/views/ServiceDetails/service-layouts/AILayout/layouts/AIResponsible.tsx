import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIResponsible({categoryContent}: Props) {
  return (
    <section className="py-24 bg-white text-brand-950">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {categoryContent?.responsible?.title}
            </h2>
            <p className="text-lg text-slate-900">
              {categoryContent?.responsible?.desc}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(categoryContent?.responsible?.items || []).map(
            (item: any, idx: number) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="p-8 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 text-xl mb-6">
                    <i
                      className={`fa-solid ${idx === 0 ? "fa-magnifying-glass-chart" : idx === 1 ? "fa-scale-balanced" : "fa-lock"}`}
                    ></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-900 text-sm leading-relaxed">
                    {item.desc}
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
