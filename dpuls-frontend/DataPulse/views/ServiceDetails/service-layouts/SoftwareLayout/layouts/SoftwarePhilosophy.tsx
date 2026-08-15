import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwarePhilosophy({categoryContent}: Props) {
  // Using generic icons as indicators; assuming the icon mapping logic in original was simple
  // or could be hardcoded if stable. The content file just has items.
  // I will assume a mapping by index or title if needed, or re-add icons to json.
  // For now I'll use the hardcoded icons from the original in a map based on index.

  const icons = [
    "fa-shield-halved",
    "fa-arrow-up-right-dots",
    "fa-cubes",
    "fa-eye",
  ];

  return (
    <section className="py-24 bg-[#1e293b] text-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {categoryContent?.philosophy_title}
            </h2>
            <p className="text-white">{categoryContent?.philosophy_subtitle}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categoryContent?.philosophy_items?.map((item: any, idx: number) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors h-full">
                <i
                  className={`fa-solid ${icons[idx % icons.length]} text-3xl text-brand-400 mb-6`}
                ></i>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
