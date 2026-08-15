import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIOutcomes({categoryContent}: Props) {
  return (
    <section className="py-24 bg-brand-600 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-brand-400/50">
          {(categoryContent?.outcomes || []).map((item: any, idx: number) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="pt-8 md:pt-0 px-4">
                <div className="text-5xl lg:text-7xl font-black mb-4 tracking-tight">
                  {item.value}
                </div>
                <div className="text-xl font-bold mb-2 text-brand-100">
                  {item.label}
                </div>
                <p className="text-sm text-brand-200">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
