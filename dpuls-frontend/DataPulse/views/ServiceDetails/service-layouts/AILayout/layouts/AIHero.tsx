import React from "react";
import {useLanguage} from "../../../../../components/LanguageContext";
import {ServiceItem} from "../../data/services";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  service: ServiceItem;
  categoryContent: any;
}

export default function AIHero({service, categoryContent}: Props) {
  const {t} = useLanguage();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Abstract Neural Background */}
      <div className="absolute inset-0 bg-[#020617]">
        {/* Pulsing Gradient Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>

        {/* Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #4361ee 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-900/40 backdrop-blur-md shadow-[0_0_15px_rgba(67,97,238,0.2)]">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-100">
                {categoryContent?.hero_tag || "Artificial Intelligence Module"}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              <span className="block text-white mix-blend-overlay opacity-1 text-2xl md:text-4xl mb-2 font-light uppercase tracking-widest">
                {categoryContent?.breadcrumbs?.services || "Services"} /{" "}
                {categoryContent?.hero_tag} /{" "}
                {categoryContent?.breadcrumbs?.sys_id || "SYS-ID"}: {service.id}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500">
                {(() => {
                  const parts = service?.titleKey?.split(".") || [];
                  const cat = parts[0];
                  const key = parts[1];
                  return categoryContent?.services?.[cat]?.[key]?.title;
                })()}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white font-light max-w-3xl mx-auto leading-relaxed mb-12">
              {(() => {
                const parts = service?.descKey?.split(".") || [];
                const cat = parts[0];
                const key = parts[1];
                return categoryContent?.services?.[cat]?.[key]?.desc;
              })()}
            </p>

            {/* Tech Badges */}
            <div className="flex flex-wrap justify-center gap-3 opacity-1">
              {(categoryContent?.hero_badges || []).map((tag: any) => (
                <span
                  key={tag}
                  className="px-3 py-1 border border-white rounded-md text-xs  uppercase tracking-wider text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
