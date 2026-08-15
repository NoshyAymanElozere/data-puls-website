import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingUseCases({categoryContent}: Props) {
  const items = categoryContent?.cases?.items || [];

  return (
    <section className="py-24 bg-brand-950 text-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl  font-bold mb-16">
            {categoryContent?.cases?.title}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((uc: any, idx: number) => (
            <Reveal key={idx} delay={idx * 150}>
              <div className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-bold mb-4 text-brand-200">
                  {uc.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
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
