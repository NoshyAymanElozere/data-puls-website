import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectIntegration({project, content}: Props) {
  return (
    <section className="py-32 bg-[#020617] text-white overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 tracking-tighter leading-none">
                {content?.integration?.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                {content?.integration?.desc}
              </p>
              <div className="flex flex-wrap gap-4">
                {project.techStack?.map((t, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg  text-[10px] uppercase tracking-widest text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* Abstract Stack Graphic */}
              <div className="space-y-3">
                {[1, 0.8, 0.6, 0.4].map((op, i) => (
                  <div
                    key={i}
                    className="h-16 w-full border border-brand-500/30 rounded-xl bg-brand-500/5 flex items-center px-8 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-brand-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <span className=" text-xs font-bold text-brand-400 ltr:mr-8 rtl:ml-8">
                      {content?.integration?.layer_prefix}0{i + 1}
                    </span>
                    <span className="font-bold text-sm tracking-widest text-white uppercase">
                      {content?.integration?.protocol}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
