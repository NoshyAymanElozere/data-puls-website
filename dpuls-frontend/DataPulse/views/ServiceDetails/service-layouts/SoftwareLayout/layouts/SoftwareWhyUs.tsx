import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareWhyUs({categoryContent}: Props) {
  return (
    <section className="py-24 bg-brand-900 text-white relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-4xl font-bold mb-6">
              {categoryContent?.why_us?.title}
            </h2>
            <p className="text-white text-lg leading-relaxed mb-8">
              {categoryContent?.why_us?.desc}
            </p>
            <ul className="space-y-4">
              {categoryContent?.why_us?.list?.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-brand-400"></i>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {categoryContent?.why_us?.stats?.map((stat: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/10 text-center"
                >
                  <div className="text-4xl font-bold text-brand-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest opacity-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
