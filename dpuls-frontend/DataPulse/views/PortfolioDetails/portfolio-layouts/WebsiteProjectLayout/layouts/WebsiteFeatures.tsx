import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function WebsiteFeatures({project, content}: Props) {
  return (
    <section className="relative py-32 overflow-hidden border-t border-white/5 bg-[#020617]">
      {/* Background Pattern - Subtle Graph Paper (Light for Dark Theme) */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              {content?.features?.title}
            </h2>
            <div className="h-1.5 w-24 bg-brand-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {project.features?.map((feat, i) => {
            return (
              <Reveal key={i} delay={i * 100}>
                <div className="group h-full bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:border-brand-500 hover:bg-white/10 transition-all duration-500 flex flex-col relative overflow-hidden rounded-2xl">
                  <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                    <i
                      className={`fa-solid ${feat.icon} text-9xl text-white`}
                    ></i>
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-brand-600 transition-colors border border-white/10 shadow-inner">
                      <i className={`fa-solid ${feat.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-white text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center text-[10px] font-bold text-brand-400 uppercase tracking-[0.3em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>{content?.features?.specs_cta}</span>
                    <i className="fa-solid fa-arrow-right ml-2 text-[8px]"></i>
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
