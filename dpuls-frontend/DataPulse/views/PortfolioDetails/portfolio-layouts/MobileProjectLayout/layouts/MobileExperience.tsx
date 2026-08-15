import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileExperience({project, content}: Props) {
  return (
    <section className="py-32 bg-[#020617] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-[#020617] to-[#020617]"></div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            {content?.experience?.title}
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <div className="relative mx-auto w-[280px] sm:w-[320px] md:w-[380px] h-[580px] sm:h-[700px] md:h-[800px] bg-slate-900 rounded-[3rem] sm:rounded-[4rem] border-[8px] sm:border-[12px] border-slate-900 shadow-[0_0_80px_rgba(67,97,238,0.25)] overflow-hidden group">
            <div className="absolute inset-0 bg-slate-950 overflow-hidden">
              <img
                src={project.experienceImage || project.image}
                alt="App UI"
                className="w-full h-auto object-top transition-transform duration-[8s] ease-in-out group-hover:-translate-y-[calc(100%-580px)] sm:group-hover:-translate-y-[calc(100%-700px)] md:group-hover:-translate-y-[calc(100%-800px)]"
              />

              {/* Glossy Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50 z-10 transition-opacity group-hover:opacity-20 duration-500"></div>
            </div>

            {/* Hardware Details */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-44 h-6 sm:h-9 bg-black rounded-b-[2rem] z-20 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              <div className="w-12 h-1 rounded-full bg-slate-800"></div>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1.5 bg-white/30 rounded-full z-20"></div>

            {/* Scroll Hint Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none z-10">
              <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
                Scroll Preview
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
