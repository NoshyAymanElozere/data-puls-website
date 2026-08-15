import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudOverview({categoryContent}: Props) {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {categoryContent?.overview_title}
              </h2>
              <p className="text-lg text-slate-900 leading-relaxed mb-6">
                {categoryContent?.overview_desc_1}
              </p>
              <p className="text-lg text-slate-900 leading-relaxed">
                {categoryContent?.overview_desc_2}
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Reveal delay={200}>
              {(categoryContent?.overview_cards || []).map(
                (item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center text-brand-600 border border-slate-100 flex-shrink-0">
                      <i
                        className={`fa-solid ${["fa-server", "fa-network-wired", "fa-sliders"][idx]}`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-900 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ),
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
