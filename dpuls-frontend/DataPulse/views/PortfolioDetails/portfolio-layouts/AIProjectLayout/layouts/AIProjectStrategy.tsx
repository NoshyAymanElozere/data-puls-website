import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  content: any;
}

export default function AIProjectStrategy({content}: Props) {
  const icons = ["fa-database", "fa-flask", "fa-microchip", "fa-arrows-rotate"];

  return (
    <section className="py-32 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-20 gap-8">
            <div>
              <span className="text-brand-600  text-xs font-bold uppercase tracking-widest mb-3 block">
                {content?.strategy?.label}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {content?.strategy?.title}
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
              {content?.strategy?.desc}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {content?.strategy?.phases?.map((step: any, i: number) => (
            <Reveal key={i} delay={i * 150} className="relative group">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xl relative z-10 mb-8 group-hover:border-brand-500 group-hover:text-brand-600 group-hover:shadow-lg transition-all mx-auto md:mx-0">
                <i className={`fa-solid ${icons[i] || "fa-circle-check"}`}></i>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-[10px]  font-bold text-brand-600 uppercase mb-2 tracking-widest">
                  {content?.strategy?.phase_prefix} 0{i + 1}
                </span>
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-900 text-sm leading-relaxed text-start">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
