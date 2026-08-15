import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingCollaboration({categoryContent}: Props) {
  const features = categoryContent?.collaboration?.features || [];
  const cadence = categoryContent?.collaboration?.cadence || [];

  const icons = ["fa-users", "fa-clock", "fa-chart-pie"];

  return (
    <section className="py-24 bg-brand-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-3xl  font-bold mb-6">
              {categoryContent?.collaboration?.title}
            </h2>
            <p className="text-lg text-slate-900 mb-6">
              {categoryContent?.collaboration?.desc}
            </p>
            <ul className="space-y-4">
              {features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-600 shadow-sm">
                    <i className={`fa-solid ${icons[idx % icons.length]}`}></i>
                  </span>
                  <span className="font-bold text-slate-800">{feature}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {cadence.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-xs uppercase font-bold text-slate-400 mb-1">
                    {item.freq}
                  </div>
                  <div className="font-bold text-brand-900">{item.event}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
