import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudLifecycle({categoryContent}: Props) {
  const envs = categoryContent?.lifecycle?.envs || [];
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-green-100 text-green-700",
  ];

  return (
    <section className="py-24 border-b border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            {categoryContent?.lifecycle?.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {envs.map((env: any, idx: number) => (
            <Reveal key={idx} delay={idx * 150}>
              <div className="p-8 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${colors[idx]}`}
                >
                  {env.title}
                </div>
                <p className="text-slate-900 text-sm leading-relaxed">
                  {env.desc}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs  text-slate-400">
                  <i className="fa-solid fa-lock"></i>
                  <span>{categoryContent?.lifecycle?.vpc_label}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
