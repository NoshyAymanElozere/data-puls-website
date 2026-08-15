import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function WebsiteStrategy({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      {/* Background Pattern - Subtle Graph Paper */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-20 gap-6">
            <div>
              <span className="text-brand-600  text-xs font-bold uppercase tracking-widest mb-3 block">
                {content?.strategy?.methodology}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {content?.strategy?.title}
              </h2>
            </div>
            <div className="h-px bg-slate-200 flex-1 mx-8 hidden md:block mb-4"></div>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed font-medium">
              {content?.strategy?.desc}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 w-full h-px bg-gradient-to-r from-slate-200 via-brand-200 to-slate-200 hidden md:block"></div>

          {(content?.strategy?.steps || []).map((step: any, i: number) => {
            // Hardcoded icons from original template to match structure
            const icons = [
              "fa-magnifying-glass",
              "fa-compass-drafting",
              "fa-code",
            ];
            return (
              <Reveal key={i} delay={i * 150} className="relative group">
                <div className="w-24 h-24 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 text-2xl relative z-10 mb-8 group-hover:border-brand-500 group-hover:text-brand-600 group-hover:shadow-lg group-hover:shadow-brand-500/10 transition-all duration-300 shadow-sm mx-auto md:mx-0">
                  <i className={`fa-solid ${icons[i % icons.length]}`}></i>
                </div>
                <div className="md:pr-8 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-brand-600 transition-colors text-start">
                    {step.title}
                  </h3>
                  <p className="text-slate-900 text-sm leading-relaxed text-start">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
