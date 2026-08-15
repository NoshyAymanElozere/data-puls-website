import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIHitl({categoryContent}: Props) {
  return (
    <section className="py-24 border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              {/* Graphic representation of HITL */}
              <div className="aspect-square rounded-full border border-brand-500/30 flex items-center justify-center relative animate-pulse-slow">
                <div className="absolute inset-0 border border-brand-500/10 rounded-full scale-150"></div>
                <div className="w-2/3 h-2/3 bg-brand-900/50 backdrop-blur-md rounded-full border border-brand-400/50 flex items-center justify-center relative z-10">
                  <div className="text-center">
                    <div className="text-brand-300 font-bold text-sm uppercase tracking-widest mb-1">
                      {categoryContent?.hitl?.metrics?.confidence_score?.label}
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {categoryContent?.hitl?.metrics?.confidence_score?.value}
                    </div>
                    <div className="text-[10px] text-white mt-2">
                      {categoryContent?.hitl?.metrics?.confidence_score?.sub}
                    </div>
                  </div>
                </div>
                {/* Orbiting element */}
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h2 className="text-3xl font-bold text-white mb-6">
              {categoryContent?.hitl?.title}
            </h2>
            <p className="text-lg text-white mb-8 leading-relaxed">
              {categoryContent?.hitl?.desc}
            </p>
            <ul className="space-y-4">
              {(categoryContent?.hitl?.features || []).map(
                (feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-white">
                    <i
                      className={`fa-solid ${idx === 0 ? "fa-sliders" : idx === 1 ? "fa-rotate-right" : "fa-user-shield"} text-brand-500`}
                    ></i>
                    <span>{feature}</span>
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
