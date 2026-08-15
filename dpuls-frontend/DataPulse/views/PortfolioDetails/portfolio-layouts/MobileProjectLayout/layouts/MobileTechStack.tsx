import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileTechStack({project, content}: Props) {
  return (
    <section className="py-32 bg-[#020617] text-white overflow-hidden relative border-y border-slate-800">
      {/* Background Radar Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-white"></div>
        <div className="absolute inset-[100px] rounded-full border border-white"></div>
        <div className="absolute inset-[200px] rounded-full border border-white"></div>
        <div className="absolute inset-[300px] rounded-full border border-white"></div>
        <div className="absolute top-0 left-1/2 bottom-0 w-px bg-white"></div>
        <div className="absolute left-0 top-1/2 right-0 h-px bg-white"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold mb-16 uppercase tracking-tighter">
            {content?.tech_stack?.title}
          </h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {(project.techStack || content?.tech_stack?.defaults).map(
              (tech: string, i: number) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-white/10 hover:border-brand-500 transition-all cursor-default group"
                >
                  <span className="text-sm  tracking-wide text-slate-300 group-hover:text-white">
                    {tech}
                  </span>
                </div>
              ),
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
