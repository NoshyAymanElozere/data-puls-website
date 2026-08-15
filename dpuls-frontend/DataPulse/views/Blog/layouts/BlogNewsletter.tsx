import React from "react";
import {Reveal} from "../../../components/Reveal";

interface BlogNewsletterProps {
  content: {
    badge: string;
    title_line1: string;
    title_line2: string;
    subtitle: string;
    join_text: string;
    placeholder: string;
    button: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
}

export default function BlogNewsletter({content}: BlogNewsletterProps) {
  return (
    <section className="py-40 bg-white relative overflow-hidden text-center border-b border-slate-100">
      {/* Background Visual: Animated Geometric Vector Flux */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-full opacity-[0.4]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="flux-grad-1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4361ee" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#4361ee" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4361ee" stopOpacity="0.05" />
            </linearGradient>
            <filter id="flux-blur">
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>

          {/* Animated Paths for "Flux" look */}
          <g filter="url(#flux-blur)">
            <path
              d="M-100 300 C 200 100, 500 500, 800 300 S 1200 100, 1540 300"
              fill="none"
              stroke="url(#flux-grad-1)"
              strokeWidth="80"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M-100 300 C 200 100, 500 500, 800 300 S 1200 100, 1540 300;
                        M-100 400 C 200 600, 500 200, 800 400 S 1200 600, 1540 400;
                        M-100 300 C 200 100, 500 500, 800 300 S 1200 100, 1540 300"
                dur="20s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M-100 200 C 300 400, 600 100, 900 200 S 1200 400, 1540 200"
              fill="none"
              stroke="#e0eaff"
              strokeWidth="60"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M-100 200 C 300 400, 600 100, 900 200 S 1200 400, 1540 200;
                        M-100 100 C 300 0, 600 300, 900 100 S 1200 0, 1540 100;
                        M-100 200 C 300 400, 600 100, 900 200 S 1200 400, 1540 200"
                dur="15s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Geometric Grid Dots */}
          <pattern
            id="dot-pattern-blog"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#4361ee" opacity="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern-blog)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-50 border border-brand-100 text-brand-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-sm">
              {content.badge}
            </div>
            <h2 className="text-6xl md:text-[8rem] font-black text-slate-900 uppercase tracking-tighter leading-[0.8] mb-12">
              {content.title_line1} <br />
              <span className="text-brand-600">{content.title_line2}</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 font-light mb-16 leading-relaxed max-w-3xl mx-auto">
              {content.subtitle} {content.join_text}
            </p>

            {/* Integrated Subscription Form (Updated for Light Mode) */}
            <div className="max-w-2xl mx-auto">
              <form
                className="relative flex flex-col md:flex-row gap-4 p-2 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-brand-500/10 transition-all hover:shadow-brand-500/20"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder={content.placeholder}
                  className="flex-1 bg-transparent border-none rounded-2xl px-8 py-5 text-slate-900 text-lg focus:outline-none placeholder:text-slate-400"
                />
                <button className="px-12 py-5 bg-brand-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-brand-600 transition-all shadow-xl hover:shadow-brand-500/20 active:scale-95">
                  {content.button}
                </button>
              </form>
              <div className="mt-10 flex flex-wrap justify-center gap-8 text-[10px]  font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2 transition-colors hover:text-brand-600 cursor-default">
                  <i className="fa-solid fa-shield-halved text-brand-600"></i>{" "}
                  {content.feature1}
                </span>
                <span className="flex items-center gap-2 transition-colors hover:text-brand-600 cursor-default">
                  <i className="fa-solid fa-bolt text-brand-600"></i>{" "}
                  {content.feature2}
                </span>
                <span className="flex items-center gap-2 transition-colors hover:text-brand-600 cursor-default">
                  <i className="fa-solid fa-ghost text-brand-600"></i>{" "}
                  {content.feature3}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
