import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudCost({categoryContent}: Props) {
  const list = categoryContent?.cost?.list || [];
  const chart = categoryContent?.cost?.chart;

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {categoryContent?.cost?.title}
            </h2>
            <p className="text-lg text-slate-900 mb-6">
              {categoryContent?.cost?.desc}
            </p>
            <ul className="space-y-3">
              {list.map((item: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                  <i className="fa-solid fa-check text-green-500"></i> {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200}>
            {/* CSS Bar Chart */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-end h-40 gap-4">
                <div className="w-full bg-slate-100 rounded-t relative group">
                  <div className="absolute bottom-0 w-full bg-brand-200 rounded-t transition-all h-[80%]"></div>
                  <span className="absolute -bottom-6 w-full text-center text-xs text-slate-400">
                    {chart?.q1}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-t relative group">
                  <div className="absolute bottom-0 w-full bg-brand-300 rounded-t transition-all h-[60%]"></div>
                  <span className="absolute -bottom-6 w-full text-center text-xs text-slate-400">
                    {chart?.q2}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-t relative group">
                  <div className="absolute bottom-0 w-full bg-brand-400 rounded-t transition-all h-[50%]"></div>
                  <span className="absolute -bottom-6 w-full text-center text-xs text-slate-400">
                    {chart?.q3}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-t relative group">
                  <div className="absolute bottom-0 w-full bg-brand-600 rounded-t transition-all h-[40%]"></div>
                  <span className="absolute -bottom-6 w-full text-center text-xs text-slate-400 font-bold">
                    {chart?.projected}
                  </span>
                </div>
              </div>
              <div className="text-center mt-8 text-sm font-bold text-green-600">
                <i className="fa-solid fa-arrow-trend-down mr-2"></i>
                {chart?.trend}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
