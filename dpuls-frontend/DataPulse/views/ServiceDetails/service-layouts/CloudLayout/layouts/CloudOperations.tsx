import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudOperations({categoryContent}: Props) {
  const buttons = categoryContent?.operations?.buttons || [];
  const logs = categoryContent?.operations?.logs;

  return (
    <section className="py-24 bg-[#0f172a] text-white overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-3xl font-bold mb-6">
              {categoryContent?.operations?.title}
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              {categoryContent?.operations?.desc}
            </p>
            <div className="flex gap-4">
              {buttons.map((btn: string, idx: number) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-sm"
                >
                  {btn}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="bg-black rounded-lg border border-slate-700 p-4  text-xs shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2 text-slate-500">
                <span>{logs?.filename || "system_monitor.log"}</span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="opacity-50">10:42:01 {logs?.l1}</div>
                <div className="opacity-50">10:42:03 {logs?.l2}</div>
                <div>10:42:05 {logs?.l3}</div>
                <div className="text-green-400">10:42:06 {logs?.l4}</div>
                <div className="opacity-50">10:42:07 {logs?.l5}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
