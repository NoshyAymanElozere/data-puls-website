import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingPhilosophy({categoryContent}: Props) {
  const benefits = categoryContent?.philosophy?.benefits || [];

  return (
    <section className="py-24 bg-brand-950 text-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl  font-medium mb-6">
              {categoryContent?.philosophy?.title}
            </h2>
            <p className="text-brand-100/70 text-lg">
              {categoryContent?.philosophy?.desc}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((item: any, idx: number) => (
            <Reveal key={idx} delay={idx * 150}>
              <div className="p-8 border-t border-brand-700 hover:bg-brand-900 transition-colors">
                <span className="block text-4xl  text-brand-400 mb-4">
                  0{idx + 1}
                </span>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-brand-200/60 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
