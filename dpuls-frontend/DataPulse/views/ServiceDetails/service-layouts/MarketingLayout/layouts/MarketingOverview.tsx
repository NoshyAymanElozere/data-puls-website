import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingOverview({categoryContent}: Props) {
  return (
    <section className="py-24 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <h2 className="text-3xl font-bold mb-6 ">
                {categoryContent?.overview?.title}
              </h2>
              <p className="text-lg text-slate-900 leading-relaxed mb-8">
                {categoryContent?.overview?.desc_1}
              </p>
              <p className="text-lg text-slate-900 leading-relaxed">
                {categoryContent?.overview?.desc_2}
              </p>
            </Reveal>
          </div>
          <div className="relative">
            <Reveal delay={200}>
              <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden relative">
                <img
                  src="https://picsum.photos/800/1000?grayscale&blur=2"
                  alt="Strategic Planning"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-brand-900/10 mix-blend-multiply"></div>
                <div className="absolute bottom-8 left-8 bg-white p-6 shadow-lg max-w-xs">
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">
                    {categoryContent?.overview?.focus_area_label}
                  </div>
                  <div className="text-xl  font-bold text-brand-950">
                    {categoryContent?.overview?.focus_area_title}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
