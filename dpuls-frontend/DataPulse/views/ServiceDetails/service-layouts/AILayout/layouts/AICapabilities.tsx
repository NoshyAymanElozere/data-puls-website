import React from "react";
import {ServiceDetailContent} from "../../data/services";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
  details: ServiceDetailContent;
}

export default function AICapabilities({categoryContent, details}: Props) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="mb-16">
            <span className="text-brand-500 font-bold tracking-widest uppercase text-xs">
              {categoryContent?.labels?.core_functions}
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">
              {categoryContent?.features_title}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(categoryContent?.details?.features || details.features).map(
            (feature: string, i: number) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-50 transition-opacity">
                    <i className="fa-solid fa-microchip text-4xl text-brand-500"></i>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {feature}
                    </h3>
                    <p className="text-white text-sm leading-relaxed">
                      {categoryContent?.capability_generic_desc}
                    </p>
                    <div className="mt-6 w-8 h-1 bg-brand-600 group-hover:w-16 transition-all duration-500"></div>
                  </div>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
