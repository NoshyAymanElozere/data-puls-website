import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudRecovery({categoryContent}: Props) {
  const cards = categoryContent?.recovery?.cards || [];
  const icons = ["fa-rotate-left", "fa-globe", "fa-stopwatch"];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            {categoryContent?.recovery?.title}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {cards.map((card: any, idx: number) => (
            <div key={idx}>
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                <i className={`fa-solid ${icons[idx]} text-2xl`}></i>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
