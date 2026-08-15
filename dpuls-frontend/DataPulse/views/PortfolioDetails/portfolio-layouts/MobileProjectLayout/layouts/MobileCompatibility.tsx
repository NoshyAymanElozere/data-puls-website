import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileCompatibility({project, content}: Props) {
  return (
    <section className="py-32 bg-slate-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative flex justify-center lg:justify-start">
                {/* Primary iPhone Mockup */}
                <div className="relative z-20 bg-white rounded-[3rem] shadow-2xl border-[6px] border-slate-900 p-1 w-48 md:w-64 transform ltr:-rotate-6 rtl:rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[9/19] bg-slate-800 rounded-[2.5rem] overflow-hidden relative">
                    <img
                      src={
                        content?.compatibility?.image_1 ||
                        project.experienceImage ||
                        project.image
                      }
                      className="w-full h-full object-cover"
                      alt="iOS Version"
                    />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-slate-900 rounded-b-xl"></div>
                  </div>
                </div>
                {/* Secondary Android Mockup */}
                <div className="absolute  ltr:lg:right-0 ltr:-right-4 rtl:left-4 rtl:lg:left-0 bottom-[-20px] z-10 bg-slate-50 rounded-[2rem] shadow-xl border-[4px] border-slate-300 p-1 w-40 md:w-56 transform ltr:rotate-12 rtl:-rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[9/19] bg-slate-900 rounded-[1.7rem] overflow-hidden">
                    <img
                      src={content?.compatibility?.image_2 || project.image}
                      className="w-full h-full object-cover grayscale opacity-60"
                      alt="Android Version"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-brand-600  text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
                {content?.compatibility?.label}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {content?.compatibility?.title}
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                {content?.compatibility?.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(content?.compatibility?.metrics || []).map(
                  (metric: any, i: number) => {
                    // Colors were hardcoded in loop in original
                    const colors = [
                      "text-brand-600",
                      "text-brand-600",
                      "text-green-600",
                    ];
                    return (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center"
                      >
                        <div
                          className={`text-4xl font-black ${colors[i % 3]} mb-1 tracking-tighter`}
                        >
                          {metric.score}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight tracking-widest">
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
