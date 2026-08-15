import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function WebsiteCompatibility({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                {/* Desktop */}
                <div className="relative z-10 bg-white rounded-lg shadow-xl border border-slate-200 p-2 w-full max-w-lg">
                  <div className="aspect-video bg-slate-800 rounded overflow-hidden">
                    <img
                      src={project.deviceLarge}
                      className="w-full h-full object-cover opacity-80"
                      alt="Desktop"
                    />
                  </div>
                </div>
                {/* Mobile */}
                <div className="absolute rtl:-right-4 ltr:-left-4 -bottom-12 z-20 bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-2 w-24 md:w-32">
                  <div className="aspect-[9/19] bg-slate-900 rounded-[1.5rem] overflow-hidden">
                    <img
                      src={project.deviceSmall}
                      className="w-full h-full object-cover opacity-80"
                      alt="Mobile"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {content?.compatibility?.title}
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed">
                {content?.compatibility?.desc}
              </p>

              <div className="grid grid-cols-3 gap-4">
                {(content?.compatibility?.metrics || []).map(
                  (metric: any, i: number) => {
                    // Colors hardcoded in original to match structure
                    const color = "text-green-600";
                    return (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center"
                      >
                        <div className={`text-3xl font-black ${color} mb-1`}>
                          {metric.score}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {metric.label}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
