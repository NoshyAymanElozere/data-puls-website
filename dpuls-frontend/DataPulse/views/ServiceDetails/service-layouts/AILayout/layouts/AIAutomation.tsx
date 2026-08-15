import React from "react";
import {useLanguage} from "../../../../../components/LanguageContext";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function AIAutomation({categoryContent}: Props) {
  const {dir} = useLanguage();

  return (
    <section className="py-24 bg-[#080c1a]">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-16 text-center">
            {categoryContent?.automation?.title}
          </h2>
        </Reveal>

        <div className="space-y-12">
          {(categoryContent?.automation?.scenarios || []).map(
            (scenario: any, idx: number) => (
              <Reveal key={idx} delay={idx * 150}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10 rounded-xl p-8 bg-black/20">
                  <div className="lg:col-span-4">
                    <h3 className="text-xl font-bold text-white">
                      {scenario.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-3 flex items-center gap-4 text-white">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className=" text-sm">{scenario.before}</span>
                  </div>

                  <div className="lg:col-span-1 flex justify-center text-brand-500">
                    <i
                      className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"}`}
                    ></i>
                  </div>

                  <div className="lg:col-span-3 flex items-center gap-4 text-white">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className=" text-sm">{scenario.after}</span>
                  </div>

                  <div className="lg:col-span-1 text-right">
                    <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded border border-green-500/20">
                      {scenario.impact}
                    </span>
                  </div>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
