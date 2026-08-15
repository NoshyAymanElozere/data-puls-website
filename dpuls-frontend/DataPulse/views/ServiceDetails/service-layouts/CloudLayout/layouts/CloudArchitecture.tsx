import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudArchitecture({categoryContent}: Props) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="mb-16">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-xs">
              {categoryContent?.arch?.topology_label}
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {categoryContent?.philosophy_title || "The Architecture of Scale"}
            </h2>
          </div>
        </Reveal>

        {/* Architecture Visualization */}
        <Reveal delay={200}>
          <div className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12 shadow-sm overflow-hidden relative">
            <div className="absolute top-4 right-4 text-xs  text-slate-400 border border-slate-200 px-2 py-1 rounded">
              {categoryContent?.arch?.diagram_label}
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              {/* Load Balancer */}
              <div className="flex flex-col items-center gap-4 text-center z-10">
                <div className="w-24 h-24 bg-slate-100 rounded-lg border-2 border-slate-200 flex items-center justify-center relative">
                  <i className="fa-solid fa-arrows-split-up-and-left text-3xl text-slate-400"></i>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  {categoryContent?.arch?.lb}
                </span>
              </div>

              {/* Connector */}
              <div className="h-16 w-1 lg:h-1 lg:flex-1 bg-slate-300 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-300 px-2 py-1 rounded text-[10px]  text-slate-500">
                  {categoryContent?.arch?.https}
                </div>
              </div>

              {/* App Cluster */}
              <div className="p-6 border-2 border-dashed border-brand-200 bg-brand-50/50 rounded-xl relative z-10">
                <div className="absolute -top-3 left-4 bg-brand-100 text-brand-700 px-2 py-0.5 text-[10px] font-bold uppercase rounded">
                  {categoryContent?.arch?.app_cluster}
                </div>
                <div className="flex gap-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="w-16 h-20 bg-white border border-brand-200 rounded flex flex-col items-center justify-center gap-2 shadow-sm"
                    >
                      <i className="fa-solid fa-microchip text-brand-400"></i>
                      <span className="text-[10px]  text-slate-400">
                        {categoryContent?.arch?.node} {n}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector */}
              <div className="h-16 w-1 lg:h-1 lg:flex-1 bg-slate-300 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-300 px-2 py-1 rounded text-[10px]  text-slate-500">
                  {categoryContent?.arch?.private_link}
                </div>
              </div>

              {/* Database */}
              <div className="flex flex-col items-center gap-4 text-center z-10">
                <div className="w-24 h-24 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center relative shadow-lg">
                  <i className="fa-solid fa-database text-3xl text-white"></i>
                  <div className="absolute bottom-2 right-2 text-[10px] text-green-400 ">
                    {categoryContent?.arch?.replica_ok}
                  </div>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  {categoryContent?.arch?.db}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
