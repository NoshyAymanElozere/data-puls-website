import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {ServiceItem} from "../../data/services";

interface Props {
  service: ServiceItem;
  categoryContent: any;
}

export default function SoftwareHero({service, categoryContent}: Props) {
  const {t} = useLanguage();

  // Extract the specific service key (e.g., "web" from "software.web")
  const titleKey = service.titleKey.split(".").pop();
  const localTitle = categoryContent?.services?.[titleKey]?.title;
  const localDesc = categoryContent?.services?.[titleKey]?.desc;

  return (
    <section className="relative bg-[#0f172a] text-white pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Decorative Radar/Circle */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          {/* System Breadcrumb */}
          <div className="flex items-center gap-3 text-xs  text-brand-300 mb-8 uppercase tracking-widest">
            <span>{categoryContent?.breadcrumbs?.services || "Services"}</span>
            <span className="text-slate-600">/</span>
            <span>{categoryContent?.hero_tag}</span>
            <span className="text-slate-600">/</span>
            <span className="text-white">
              {categoryContent?.breadcrumbs?.sys_id || "SYS-ID"}: {service.id}
            </span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              {localTitle}
            </h1>
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl border-s-4 border-brand-500 ps-6">
              {localDesc}
            </p>
          </div>

          {/* Metric badges */}
          <div className="mt-12 flex flex-wrap gap-6">
            {categoryContent?.hero?.badges?.map((badge: any, idx: number) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 px-6 py-3 rounded text-sm backdrop-blur-sm"
              >
                <span className="block text-brand-400  text-xs uppercase mb-1">
                  {badge.label}
                </span>
                <span className="font-bold">{badge.value}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
