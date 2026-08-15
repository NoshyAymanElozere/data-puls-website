import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileStrategy({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-50 text-slate-900 border-y border-slate-200 relative overflow-hidden">
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
          <div className="flex flex-col md:flex-row justify-between  mb-20 gap-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 w-full h-px bg-gradient-to-r from-slate-200 via-brand-200 to-slate-200 hidden lg:block opacity-30"></div>

          {(content?.strategy?.phases || []).map((step: any, i: number) => {
            const icons = [
              "fa-door-open",
              "fa-magnifying-glass",
              "fa-bolt",
              "fa-heart-circle-check",
            ];
            return (
              <Reveal key={i} delay={i * 150} className="relative group">
                <div className="w-24 h-24 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 text-2xl relative z-10 mb-8 group-hover:border-brand-500 group-hover:text-brand-600 group-hover:shadow-lg group-hover:shadow-brand-500/10 transition-all duration-300 shadow-sm mx-auto lg:mx-0">
                  <i className={`fa-solid ${icons[i % icons.length]}`}></i>
                </div>
                <div className="lg:pr-4 text-center lg:text-start">
                  <div className="text-[10px] font-bold text-brand-600 uppercase mb-2 tracking-widest">
                    {content?.strategy?.phase_prefix} 0{i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-brand-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-900 text-sm leading-relaxed">
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
