import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIOverview({categoryContent}: Props) {
  return (
    <section className="py-24 border-b border-white/10 bg-[#050a1f]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-6">
              {categoryContent?.overview_title}
            </h2>
            <p className="text-lg text-white leading-relaxed mb-6">
              {categoryContent?.overview_desc_1}
            </p>
            <p className="text-lg text-white leading-relaxed">
              {categoryContent?.overview_desc_2}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-2">
                  {categoryContent?.labels?.designed_for}
                </div>
                <p className="text-white">
                  {categoryContent?.overview_cards?.designed_for_text}
                </p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-2">
                  {categoryContent?.labels?.solves}
                </div>
                <p className="text-white">
                  {categoryContent?.overview_cards?.solves_text}
                </p>
              </div>
              <div className="col-span-2 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-between">
                <div>
                  <div className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-1">
                    {categoryContent?.labels?.architecture}
                  </div>
                  <p className="text-white">
                    {categoryContent?.overview_cards?.architecture_text}
                  </p>
                </div>
                <i className="fa-solid fa-server text-2xl text-white"></i>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
