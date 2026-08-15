import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectProblem({project, content}: Props) {
  return (
    <section className="py-32 bg-[#020617] text-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl font-bold mb-6">
              {content?.problem?.title}
            </h2>
            <p className="text-slate-400 text-lg">{content?.problem?.desc}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(project.challenge?.points || content?.problem?.points || []).map(
            (point: string, i: number) => (
              <Reveal key={i} delay={i * 150}>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500 transition-all group">
                  <span className=" text-brand-400 text-xs uppercase tracking-widest block mb-6">
                    {content?.problem?.friction_label} 0{i + 1}
                  </span>
                  <p className="text-xl font-medium leading-relaxed group-hover:text-white transition-colors">
                    {point}
                  </p>
                  <div className="mt-8 flex justify-end opacity-20 group-hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-bolt-lightning text-brand-500"></i>
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
