import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingMessaging({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-50 overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="p-12 lg:p-16 bg-white border border-slate-200 rounded-[2rem] shadow-2xl relative">
                <div className="text-xs  font-bold text-slate-300 mb-8 uppercase tracking-[0.3em]">
                  {content?.messaging?.label}
                </div>
                <p className="text-4xl font-black text-slate-900 leading-none uppercase tracking-tighter mb-10">
                  {project.marketingSpec?.narrative}
                </p>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                  {content?.messaging?.desc}
                </p>
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal delay={200}>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-12">
                {content?.messaging?.title ? (
                  <>
                    {content.messaging.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <br />
                    <span className="text-brand-600">
                      {content.messaging.title.split(" ").slice(-1)}
                    </span>
                  </>
                ) : (
                  "The Voice Protocol."
                )}
              </h2>
              <div className="space-y-6">
                {content?.messaging?.protocols?.map(
                  (val: string, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-4 border-b border-slate-200"
                    >
                      <span className="text-lg font-bold uppercase tracking-widest">
                        {val}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    </div>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
