import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingVoice({categoryContent}: Props) {
  const tags = categoryContent?.voice?.tags || [];
  const metrics = categoryContent?.voice?.metrics || [];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="text-brand-500 font-bold tracking-widest uppercase text-xs mb-4 block">
              {categoryContent?.voice?.label}
            </span>
            <h2 className="text-4xl  font-bold mb-8 text-brand-950">
              {categoryContent?.voice?.title}
            </h2>
            <p className="text-lg text-slate-900 mb-6 leading-relaxed">
              {categoryContent?.voice?.desc_1}
            </p>
            <p className="text-lg text-slate-900 mb-8 leading-relaxed">
              {categoryContent?.voice?.desc_2}
            </p>
            <div className="flex gap-4">
              {tags.map((tag: string, idx: number) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-slate-100 rounded text-sm font-medium text-slate-700"
                >
                  {tag}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            {/* Abstract Visual of Voice */}
            <div className="bg-brand-950 p-10 text-white rounded-tr-[4rem] rounded-bl-[4rem]">
              <div
                className=" text-3xl italic mb-6"
                dangerouslySetInnerHTML={{
                  __html: categoryContent?.voice?.quote,
                }}
              ></div>
              <div className="space-y-4">
                {metrics.map((metric: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-24 text-xs font-bold uppercase tracking-wider text-brand-300">
                      {metric.label}
                    </div>
                    <div className="flex-1 h-1 bg-white/20 rounded-full">
                      <div
                        className="h-full bg-brand-400 rounded-full"
                        style={{width: metric.value}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
