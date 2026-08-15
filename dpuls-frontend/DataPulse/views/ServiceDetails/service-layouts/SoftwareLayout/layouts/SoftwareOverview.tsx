import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareOverview({categoryContent}: Props) {
  return (
    <section className="py-24 border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">
                {categoryContent?.overview_title}
              </h2>
              <div className="w-16 h-1 bg-brand-600 mb-8"></div>
              <p className="text-lg text-slate-900 leading-relaxed mb-6">
                {categoryContent?.overview_desc_1}
              </p>
              <p className="text-lg text-slate-900 leading-relaxed">
                {categoryContent?.overview_desc_2}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-4 text-xl">
                    <i className="fa-solid fa-crosshairs"></i>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3">
                    {categoryContent?.overview?.problem?.title}
                  </h3>
                  <p className="text-slate-900 text-sm leading-relaxed text-start">
                    {categoryContent?.overview?.problem?.desc}
                  </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-4 text-xl">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3">
                    {categoryContent?.overview?.solution?.title}
                  </h3>
                  <p className="text-slate-900 text-sm leading-relaxed text-start">
                    {categoryContent?.overview?.solution?.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
