import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function CloudSecurity({categoryContent}: Props) {
  const securityLayers = categoryContent?.security?.layers || [];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">
            {categoryContent?.security?.title}
          </h2>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-2">
            {securityLayers.map((layer: any, idx: number) => (
              <Reveal key={idx} delay={idx * 100}>
                <div
                  className="flex items-center justify-between p-6 rounded-lg text-white font-bold relative overflow-hidden transition-transform hover:scale-[1.01]"
                  style={{
                    backgroundColor: `rgba(25, 38, 82, ${1 - idx * 0.15})`, // Fading brand colors
                    marginLeft: `${idx * 20}px`, // Indentation effect
                    marginRight: `${idx * 20}px`,
                  }}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="text-xs opacity-50 uppercase tracking-widest">
                      Layer 0{idx + 1}
                    </span>
                    <span className="text-lg">{layer.title}</span>
                  </div>
                  <span className="text-sm font-normal opacity-80 relative z-10">
                    {layer.desc}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
