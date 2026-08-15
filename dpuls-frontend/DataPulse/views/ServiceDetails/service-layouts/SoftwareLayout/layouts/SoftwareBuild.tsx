import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareBuild({categoryContent}: Props) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Reveal>
              <div className="aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 p-8  text-xs text-brand-200 opacity-60 whitespace-pre-wrap">
                  {categoryContent?.build?.code_snippet}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-white font-bold text-2xl mb-2">
                    {categoryContent?.build?.card_title}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {categoryContent?.build?.card_desc}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal delay={100}>
              <h2 className="text-3xl font-bold mb-8 text-slate-900">
                {categoryContent?.what_we_build_title}
              </h2>
              <p className="text-slate-900 mb-10 text-lg">
                {categoryContent?.what_we_build_subtitle}
              </p>
              <div className="space-y-4">
                {categoryContent?.details?.features?.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs">
                        <i className="fa-solid fa-check"></i>
                      </span>
                      <span className="font-bold text-slate-900">{item}</span>
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
