import React from "react";
import {Reveal} from "../../../components/Reveal";

interface Article {
  id: string;
  uid: string;
  category: string;
  title: string;
  title_accent?: string;
  subtitle: string;
  lead: string;
  author: {
    name: string;
    role: string;
    image: string;
    id: string;
  };
  meta: {
    date: string;
    readTime: string;
    hash: string;
    security: string;
  };
}

interface BlogDetailHeroProps {
  content: {
    dispatch_prefix: string;
    read_label: string;
    label_left: string;
    label_right_prefix: string;
    scroll_label: string;
  };
  article: Article;
  scrollPercentage: number;
  isRTL: boolean;
}

export default function BlogDetailHero({
  content,
  article,
  scrollPercentage,
  isRTL,
}: BlogDetailHeroProps) {
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center items-center pt-36 pb-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-white to-white border-b border-slate-100">
      {/* Kinetic Ambient Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Shifting Gradient Glow Spheres */}
        <div
          className="absolute -top-[15%] right-[-5%] w-[550px] h-[550px] bg-gradient-to-br from-brand-400/20 to-brand-600/10 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate3d(${scrollPercentage * -80}px, ${scrollPercentage * 40}px, 0) rotate(${scrollPercentage * 12}deg)`,
          }}
        ></div>
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/15 to-brand-300/20 rounded-full blur-[100px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate3d(${scrollPercentage * 60}px, ${scrollPercentage * -25}px, 0) rotate(${scrollPercentage * -8}deg)`,
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
              <span>
                {content.dispatch_prefix} {article.uid}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tight text-slate-900 leading-[1.05] mb-6">
              <span className="inline-block drop-shadow-sm">
                {article.title}
              </span>{" "}
              {article.title_accent && (
                <span className="inline-block bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 bg-clip-text text-transparent px-2">
                  {article.title_accent}
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed font-light mx-auto">
              {article.subtitle}
            </p>

            {/* Author & Meta Pill Card */}
            <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-md shadow-slate-900/5">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.image}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full border border-brand-200 object-cover shadow-xs"
                />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {article.author.name}
                </span>
              </div>

              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <i className="fa-regular fa-calendar text-brand-500 text-xs"></i>
                <span>{article.meta.date}</span>
              </div>

              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <i className="fa-regular fa-clock text-brand-500 text-xs"></i>
                <span>
                  {article.meta.readTime} {content.read_label}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Side Decorative Vertical Labels */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-8" : "left-8"} hidden xl:block z-10 pointer-events-none`}
      >
        <div className="flex flex-col gap-10 text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.5em] [writing-mode:vertical-rl] rotate-180">
          <span>{content.label_left}</span>
          <span>
            {content.label_right_prefix}
            {article.meta.hash}
          </span>
        </div>
      </div>
    </section>
  );
}
