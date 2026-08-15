import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectArchitecture({project, content}: Props) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-600  text-xs font-bold uppercase mb-4 block">
                {content?.architecture?.label}
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mb-8">
                {project.aiSpec?.architectureTitle ||
                  content?.architecture?.default_title}
              </h2>
              <div className="space-y-8">
                {project.aiSpec?.logicPoints.map((point, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="text-4xl font-black text-slate-100 group-hover:text-brand-600 transition-colors">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">
                        {point.title}
                      </h4>
                      <p className="text-slate-900 text-sm leading-relaxed text-start">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8  text-[8px] text-brand-500 opacity-20 whitespace-pre">
                {`def transformer_block(x):\n  x = multi_head_attention(x)\n  x = layer_norm(x + residual)\n  x = position_wise_ff(x)\n  return layer_norm(x + residual)`}
              </div>
              <h3 className="text-2xl font-bold mb-8  opacity-50">
                {content?.architecture?.evaluator_title}
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: content?.architecture?.specs?.model_class,
                    val:
                      project.aiSpec?.modelType ||
                      content?.architecture?.defaults?.model,
                  },
                  {
                    label: content?.architecture?.specs?.optimizer,
                    val: content?.architecture?.defaults?.optimizer,
                  },
                  {
                    label: content?.architecture?.specs?.precision,
                    val: content?.architecture?.defaults?.precision,
                  },
                  {
                    label: content?.architecture?.specs?.hardware,
                    val: content?.architecture?.defaults?.hardware,
                  },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-white/10 pb-4"
                  >
                    <span className="text-slate-500  text-xs">
                      {spec.label}
                    </span>
                    <span className="text-brand-400  text-xs">{spec.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12 bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px]  text-slate-400 uppercase tracking-widest">
                    {content?.architecture?.logic_pass}
                  </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-brand-500"></div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
