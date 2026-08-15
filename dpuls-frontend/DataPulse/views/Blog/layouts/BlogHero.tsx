import React from "react";
import {Reveal} from "../../../components/Reveal";
import {useLanguage} from "../../../components/LanguageContext";

interface BlogHeroProps {
  content: {
    badge: string;
    title: string;
    title_accent: string;
    subtitle: string;
    label_left: string;
    label_right: string;
    index_label: string;
  };
  scrollProgress: number;
}

export default function BlogHero({content, scrollProgress}: BlogHeroProps) {
  const {dir, language} = useLanguage();

  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center items-center pt-36 pb-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-white to-white border-b border-slate-100">
      {/* Kinetic Ambient Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Shifting Gradient Glow Spheres */}
        <div
          className="absolute -top-[15%] right-[-5%] w-[550px] h-[550px] bg-gradient-to-br from-brand-400/20 to-brand-600/10 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate3d(${scrollProgress * -80}px, ${scrollProgress * 40}px, 0) rotate(${scrollProgress * 12}deg)`,
          }}
        ></div>
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/15 to-brand-300/20 rounded-full blur-[100px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate3d(${scrollProgress * 60}px, ${scrollProgress * -25}px, 0) rotate(${scrollProgress * -8}deg)`,
          }}
        ></div>

        {/* Delicate Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <Reveal>
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            {/* Glassmorphic Badge Pill */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-brand-500/25 bg-brand-50/80 backdrop-blur-md text-brand-700 text-xs font-bold uppercase tracking-[0.25em] mb-8 shadow-[0_4px_20px_-4px_rgba(67,97,238,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
              <span>{content.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tight text-slate-900 leading-[1.05] mb-6">
              <span className="inline-block drop-shadow-sm">
                {content.title}
              </span>{" "}
              <span className="inline-block bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 bg-clip-text text-transparent   px-2">
                {content.title_accent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed font-light mx-auto">
              {content.subtitle}
            </p>

            {/* Highlight Badges Strip */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-2xs text-xs font-bold text-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-code text-brand-500"></i>
                <span>
                  {language === "ar"
                    ? "مقالات برمجية متخصصة"
                    : "Software Insights"}
                </span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-2xs text-xs font-bold text-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-brain text-brand-500"></i>
                <span>
                  {language === "ar"
                    ? "الذكاء الاصطناعي والأتمتة"
                    : "AI & Automation"}
                </span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-2xs text-xs font-bold text-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-cloud text-brand-500"></i>
                <span>
                  {language === "ar"
                    ? "البنية التحتية السحابية"
                    : "Cloud & Infrastructure"}
                </span>
              </div>
            </div>

            {/* Divider Index */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-200"></div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {content.index_label}
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-200"></div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Side Decorative Vertical Labels */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${dir === "rtl" ? "right-8" : "left-8"} hidden xl:block z-10 pointer-events-none`}
      >
        <div className="flex flex-col gap-10 text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.5em] [writing-mode:vertical-rl] rotate-180">
          <span>{content.label_left}</span>
          <span>{content.label_right}</span>
        </div>
      </div>
    </section>
  );
}
