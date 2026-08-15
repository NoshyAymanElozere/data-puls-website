import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudReliability({categoryContent}: Props) {
  const metrics = categoryContent?.reliability?.metrics || [];
  const features = categoryContent?.reliability?.features || [];

  return (
    <section className="py-24 bg-[#0f172a] text-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                {categoryContent?.reliability?.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {categoryContent?.reliability?.desc}
              </p>
              <ul className="space-y-4">
                {features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3">
                    <i className="fa-solid fa-check-circle text-green-400"></i>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-1 gap-6">
                {metrics.map((metric: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm text-slate-400 mb-1">
                        {metric.label}
                      </div>
                      <div className="text-3xl font-bold text-white ">
                        {metric.value}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-400 uppercase tracking-widest font-bold mb-1">
                        {metric.desc.split(" ")[0]}
                      </div>
                      <div className="text-[10px] text-slate-500 max-w-[150px]">
                        {metric.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
