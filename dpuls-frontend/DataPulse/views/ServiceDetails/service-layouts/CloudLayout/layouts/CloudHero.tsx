import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {ServiceItem} from "../../data/services";

interface Props {
  service: ServiceItem;
  categoryContent: any;
}

export default function CloudHero({service, categoryContent}: Props) {
  const {t} = useLanguage();

  return (
    <section className="relative bg-[#0f172a] text-white pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden border-b border-slate-700">
      {/* Isometric Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(30deg, #334155 1px, transparent 1px), linear-gradient(150deg, #334155 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Abstract "Stable Core" Visual */}
      <div className="absolute top-1/2 right-10 lg:right-40 transform -translate-y-1/2 w-64 h-64 opacity-20 pointer-events-none hidden lg:block">
        <div className="absolute inset-0 border-4 border-brand-500 rounded-lg transform rotate-12"></div>
        <div className="absolute inset-0 border-4 border-white rounded-lg transform -rotate-6 scale-90"></div>
        <div className="absolute inset-0 border-4 border-brand-300 rounded-lg transform rotate-3 scale-75"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="flex items-center gap-3 text-xs  text-brand-400 mb-8 uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>
              {categoryContent?.hero?.status_label}:{" "}
              {categoryContent?.hero?.status_value}
            </span>
            <span className="text-slate-600">|</span>
            <span>{categoryContent?.hero_tag || "Infrastructure"}</span>
            <span className="text-slate-600">/</span>
            <span className="text-white">{service.slug}</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              {(() => {
                const parts = service.titleKey.split(".");
                const local =
                  categoryContent?.services?.[parts[0]]?.[parts[1]]?.title;
                return local;
              })()}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl pl-6 border-l-2 border-brand-500">
              {(() => {
                const parts = service.descKey.split(".");
                const local =
                  categoryContent?.services?.[parts[0]]?.[parts[1]]?.desc;
                return local;
              })()}
            </p>
          </div>

          {/* Deployment Badge */}
          <div className="mt-12 inline-flex items-center gap-6 bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {categoryContent?.hero?.deployments_label}
              </span>
              <span className="text-lg  font-bold text-white">
                {categoryContent?.hero?.deployments_value}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {categoryContent?.hero?.compliance_label}
              </span>
              <span className="text-lg  font-bold text-white">
                {categoryContent?.hero?.compliance_value}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
