import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectSystem({project, content}: Props) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">
            {content?.system?.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[300px]">
          {project.features?.map((feat, i) => {
            const isLarge = i === 1 || i === 2;
            const colSpan = isLarge ? "md:col-span-3" : "md:col-span-3";

            return (
              <Reveal key={i} delay={i * 100} className={`${colSpan} h-full`}>
                <div className="group h-full bg-slate-900 p-10 hover:bg-brand-950 transition-all duration-500 flex flex-col justify-between relative overflow-hidden rounded-3xl border border-white/5 shadow-xl">
                  <div className="absolute bottom-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                    <i
                      className={`fa-solid ${feat.icon} text-[12rem] text-white`}
                    ></i>
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-brand-400 mb-8 border border-white/10 group-hover:border-brand-500 transition-colors">
                      <i className={`fa-solid ${feat.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feat.title}
                    </h3>
                    <p className="text-white text-sm leading-relaxed max-w-xs">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto pt-4 flex items-center text-xs  font-bold text-brand-500 uppercase tracking-[0.2em] opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span>{content?.system?.module_active}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 ml-3 animate-pulse"></div>
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
