import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingOptimization({project, content}: Props) {
  return (
    <section className="py-32 bg-white overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
              {content?.optimization?.title ? (
                <>
                  {content.optimization.title.split(" ").slice(0, 1)} <br />
                  <span className="text-brand-600">
                    {content.optimization.title.split(" ").slice(1).join(" ")}
                  </span>
                </>
              ) : (
                "Continuous Evolution."
              )}
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
              {content?.optimization?.desc}
            </p>
            <div className="flex flex-wrap gap-4">
              {content?.optimization?.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-5 py-2 bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-widest rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
          <div className="relative">
            {/* Visual Refinement Graphic */}
            <div className="w-full aspect-video bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center group overflow-hidden">
              <div className="flex gap-1 h-32 items-end">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 bg-brand-600 rounded-t-lg transition-all duration-1000 group-hover:animate-pulse"
                    style={{
                      height: `${30 + Math.random() * 70}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
