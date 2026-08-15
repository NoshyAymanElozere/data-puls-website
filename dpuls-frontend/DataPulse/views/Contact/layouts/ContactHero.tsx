import React from "react";
import {Reveal} from "../../../components/Reveal";

interface ContactHeroProps {
  content: {
    badge: string;
    title_line1: string;
    title_line2: string;
    subtitle: string;
    subtitle_extra: string;
    label_left: string;
    label_right: string;
    scroll_label: string;
  };
  isRTL: boolean;
}

export default function ContactHero({content, isRTL}: ContactHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex flex-col justify-center items-center pt-40 pb-20 overflow-hidden bg-[#020617] border-b border-brand-900/20">
      {/* Kinetic Layered Background (Matching App Design Language) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Shifting Glass Panes */}
        <div className="absolute top-[10%] right-[-5%] w-[50%] h-[80%] bg-brand-500/10 rounded-[4rem] blur-[120px] animate-pulse-slow"></div>
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[70%] bg-brand-400/5 rounded-[6rem] blur-[100px] animate-pulse-slow"
          style={{animationDelay: "2s"}}
        ></div>

        {/* Architectural Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="20"
            x2="100"
            y2="20"
            stroke="#4361ee"
            strokeWidth="0.1"
          />
          <line
            x1="0"
            y1="40"
            x2="100"
            y2="40"
            stroke="#4361ee"
            strokeWidth="0.1"
          />
          <line
            x1="0"
            y1="60"
            x2="100"
            y2="60"
            stroke="#4361ee"
            strokeWidth="0.1"
          />
          <line
            x1="0"
            y1="80"
            x2="100"
            y2="80"
            stroke="#4361ee"
            strokeWidth="0.1"
          />
          <line
            x1="25"
            y1="0"
            x2="25"
            y2="100"
            stroke="#4361ee"
            strokeWidth="0.1"
          />
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="#4361ee"
            strokeWidth="0.1"
          />
          <line
            x1="75"
            y1="0"
            x2="75"
            y2="100"
            stroke="#4361ee"
            strokeWidth="0.1"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <Reveal>
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-4 px-4 py-2 bg-brand-500/10 text-brand-400 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-12 shadow-sm border border-brand-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
              {content.badge}
            </div>

            <h1 className="relative">
              <span className="block text-6xl md:text-[8rem] font-black tracking-[-0.05em] leading-[0.82] uppercase text-white">
                {content.title_line1}
              </span>
              <span className="block text-4xl md:text-[5rem] font-serif italic text-brand-500 leading-none mt-4 md:-mt-4">
                {content.title_line2}
              </span>
            </h1>

            <div className="mt-16 max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
                {content.subtitle} {content.subtitle_extra}
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Side Vertical Label */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-10" : "left-10"} hidden xl:block`}
      >
        <div className="flex flex-col gap-12  text-[9px] font-bold text-slate-900 uppercase tracking-[0.5em] [writing-mode:vertical-rl] rotate-180 opacity-50">
          <span>{content.label_left}</span>
          <span>{content.label_right}</span>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <div className="w-px h-16 bg-gradient-to-b from-brand-600 to-transparent"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] rotate-90 origin-left mt-8 text-white">
          {content.scroll_label}
        </span>
      </div>
    </section>
  );
}
