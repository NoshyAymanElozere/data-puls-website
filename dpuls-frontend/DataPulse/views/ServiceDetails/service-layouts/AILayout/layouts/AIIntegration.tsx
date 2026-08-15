import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIIntegration({categoryContent}: Props) {
  return (
    <section className="py-24 bg-[#020617] text-white overflow-hidden relative">
      {/* Background connecting lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full">
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-4">
                {categoryContent?.integration?.title}
              </h2>
              <p className="text-white">{categoryContent?.integration?.desc}</p>
            </div>

            {/* Visual Connector */}
            <div className="md:w-2/3 flex items-center justify-center gap-4 md:gap-8">
              <div className="p-4 bg-slate-800 rounded-lg text-xs  border border-slate-700">
                {categoryContent?.integration?.labels?.your_data}
              </div>
              <div className="flex-1 h-px bg-brand-500 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-brand-400 rounded-full animate-ping"></div>
              </div>
              <div className="p-6 bg-brand-900 rounded-xl border border-brand-500 shadow-[0_0_30px_rgba(67,97,238,0.3)] z-10">
                <i className="fa-solid fa-brain text-3xl text-white"></i>
              </div>
              <div className="flex-1 h-px bg-brand-500 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-brand-400 rounded-full animate-ping"></div>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg text-xs  border border-slate-700">
                {categoryContent?.integration?.labels?.actionable_output}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
