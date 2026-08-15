import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingChallenge({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>
      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="max-w-4xl mb-24">
            <span className="text-brand-500  text-xs uppercase tracking-[0.5em] mb-4 block">
              {content?.challenge?.label}
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              {content?.challenge?.title}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {project.challenge?.points.map((point, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="group p-10 border border-white/10 hover:border-brand-500 transition-all duration-500 bg-white/5 backdrop-blur-sm rounded-2xl h-full flex flex-col justify-between">
                <div className="mb-8">
                  <div className="text-4xl font-black text-brand-500/20 mb-6 group-hover:text-brand-500/50 transition-colors">
                    0{i + 1}
                  </div>
                  <p className="text-2xl font-bold leading-snug">{point}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                  <i className="fa-solid fa-arrow-right -rotate-45"></i>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
