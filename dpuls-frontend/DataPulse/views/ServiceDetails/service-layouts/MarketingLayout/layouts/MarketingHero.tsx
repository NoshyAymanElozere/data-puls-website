import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {ServiceItem} from "../../data/services";

interface Props {
  service: ServiceItem;
  categoryContent: any;
}

export default function MarketingHero({service, categoryContent}: Props) {
  const {t} = useLanguage();

  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 container mx-auto">
      <Reveal>
        <div className="max-w-5xl mx-auto text-center lg:text-start">
          <div className="inline-flex items-center gap-3 mb-8 border-b border-brand-900 pb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-900">
              {categoryContent?.hero_tag || "Strategic Growth"}
            </span>
            <span className="text-brand-400">/</span>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {service.id}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl  font-medium text-brand-950 tracking-tight leading-[0.9] mb-10">
            {(() => {
              const parts = service.titleKey.split(".");
              const local =
                categoryContent?.services?.[parts[0]]?.[parts[1]]?.title;
              return local || t(`services.${service.titleKey}.title`);
            })()}
          </h1>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-2xl">
              {(() => {
                const parts = service.descKey.split(".");
                return categoryContent?.services?.[parts[0]]?.[parts[1]]?.desc;
              })()}
            </p>

            {/* Insight Badge */}
            <div className="hidden lg:block p-6 bg-white border border-slate-100 shadow-xl rounded-tl-3xl rounded-br-3xl max-w-xs rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="text-brand-600 text-4xl mb-2">
                <i className="fa-solid fa-quote-left"></i>
              </div>
              <p className="text-sm font-medium text-slate-800 italic">
                "{categoryContent?.hero?.quote}"
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
