import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileFeatures({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {content?.features?.title}
            </h2>
            <div className="w-20 h-1 bg-brand-600 mx-auto rounded-full"></div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[250px]">
          {project.features?.map((feat, i) => {
            // Dynamic sizing for bento effect
            const isLarge = i === 0 || i === 3;
            const colSpan = isLarge ? "md:col-span-4" : "md:col-span-2";

            return (
              <Reveal key={i} delay={i * 100} className={`${colSpan} h-full`}>
                <div className="group h-full bg-white border border-slate-200 p-8 hover:border-brand-500 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <i className={`fa-solid ${feat.icon} text-9xl`}></i>
                  </div>

                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <i className={`fa-solid ${feat.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-900 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto pt-4 flex items-center text-xs font-bold text-brand-600 uppercase tracking-wider opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>{content?.features?.specs_cta}</span>
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
