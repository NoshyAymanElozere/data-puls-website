import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingChannels({categoryContent}: Props) {
  const groups = categoryContent?.channels?.groups || [];

  return (
    <section className="py-24 bg-slate-100">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-12">
            <h2 className="text-3xl md:text-4xl  font-bold">
              {categoryContent?.channels?.title}
            </h2>
            <p className="text-slate-500">{categoryContent?.channels?.desc}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {groups.map((group: any, idx: number) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="bg-white p-8 rounded-none border-l-4 border-brand-500 shadow-sm h-full">
                <h3 className="text-xl font-bold mb-6 text-brand-900">
                  {group.category}
                </h3>
                <ul className="space-y-4">
                  {group.items.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-600"
                    >
                      <i className="fa-solid fa-check text-brand-500 mt-1 text-xs"></i>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
