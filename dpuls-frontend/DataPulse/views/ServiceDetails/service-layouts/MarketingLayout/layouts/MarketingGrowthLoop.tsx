import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";

interface Props {
  categoryContent: any;
}

export default function MarketingGrowthLoop({categoryContent}: Props) {
  const {dir} = useLanguage();
  const steps = categoryContent?.growth?.steps || [];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl  font-bold mb-4">
              {categoryContent?.growth?.title}
            </h2>
            <p className="text-slate-600">{categoryContent?.growth?.desc}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {steps.map((step: string, idx: number) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="relative p-6 bg-slate-50 rounded-full aspect-square flex flex-col items-center justify-center border-2 border-slate-100 hover:border-brand-500 transition-colors group">
                <div className="text-xs font-bold text-slate-400 mb-2">
                  Step 0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-brand-900 group-hover:text-brand-600 transition-colors">
                  {step}
                </h3>
                {idx < 3 && (
                  <div
                    className={`hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-300 z-10 ${dir === "rtl" ? "rotate-180 left-0 right-auto" : ""}`}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
