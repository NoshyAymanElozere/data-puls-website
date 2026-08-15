import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectHero({project, content}: Props) {
  return (
    <section className="relative min-h-[90vh] pt-40 pb-20 flex flex-col justify-center bg-[#020617] overflow-hidden border-b border-brand-900/30 group/hero">
      {/* AI Specific Background: Floating Neurons/Nodes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-20"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="node-grid"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#4361ee" />
              <path
                d="M0 0 L100 100 M100 0 L0 100"
                stroke="#4361ee"
                strokeWidth="0.2"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#node-grid)" />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 blur-[150px] rounded-full animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
        <div className="flex flex-col justify-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-brand-600 text-white text-[10px]  uppercase tracking-[0.2em] rounded-sm shadow-[0_0_15px_rgba(67,97,238,0.4)]">
                {content?.hero?.subsystem_prefix}
                {project.id}
              </span>
              <div className="h-px flex-1 bg-slate-700"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                {content?.hero?.status_active}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.85] uppercase">
              {project.title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="block last:text-transparent last:bg-clip-text last:bg-gradient-to-r last:from-white last:to-brand-500"
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* AI Metadata Dash */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-y border-white/5 py-8">
              <div>
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.accuracy}
                </span>
                <span className="block text-white font-bold text-2xl">
                  {project.aiSpec?.accuracy || "98.2%"}
                </span>
              </div>
              <div>
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.inference}
                </span>
                <span className="block text-white font-bold text-2xl">
                  {project.aiSpec?.inferenceTime || "12ms"}
                </span>
              </div>
              <div className="hidden md:block">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.year}
                </span>
                <span className="block text-white font-bold text-2xl">
                  {project.year || "2024"}
                </span>
              </div>
              <div className="hidden md:block">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.status}
                </span>
                <span className="block text-green-400 font-bold text-2xl uppercase">
                  {content?.hero?.status_value}
                </span>
              </div>
            </div>

            <p className="text-xl text-slate-400 font-light leading-snug max-w-lg mb-12">
              {project.shortDesc}
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group relative px-10 py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all border border-transparent hover:border-brand-500">
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                  {content?.hero?.cta} <i className="fa-solid fa-microchip"></i>
                </span>
                <div className="absolute inset-0 bg-brand-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="relative h-[600px] hidden lg:flex items-center justify-center">
          {/* 3D Visualization Placeholder / SVG Abstract Animation */}
          <div className="relative w-full aspect-square max-w-md">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="#4361ee"
                strokeWidth="0.5"
                strokeDasharray="5 5"
                className="animate-spin-slow"
              />
              <circle
                cx="200"
                cy="200"
                r="140"
                fill="none"
                stroke="#4361ee"
                strokeWidth="1"
                opacity="0.3"
              />
              <g
                className="origin-center animate-spin-slow"
                style={{animationDuration: "30s"}}
              >
                {[...Array(12)].map((_, i) => (
                  <circle
                    key={i}
                    cx={200 + 140 * Math.cos((i * Math.PI) / 6)}
                    cy={200 + 140 * Math.sin((i * Math.PI) / 6)}
                    r="3"
                    fill="#4361ee"
                  />
                ))}
              </g>
              <path
                d="M200,60 L200,340 M60,200 L340,200"
                stroke="#4361ee"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <rect
                x="150"
                y="150"
                width="100"
                height="100"
                rx="8"
                fill="#0f172a"
                stroke="#4361ee"
                strokeWidth="2"
                className="animate-pulse shadow-2xl"
              />
              <text
                x="200"
                y="205"
                textAnchor="middle"
                fill="#4361ee"
                className="text-[10px]  font-bold tracking-widest uppercase"
              >
                {content?.hero?.visual_label}
              </text>
            </svg>

            {/* Floating Metric Bubble */}
            <div className="absolute top-10 right-0 bg-brand-600 text-white p-4 rounded-xl  text-[10px] shadow-2xl border border-white/20 transform translate-y-[-20%] animate-bounce-slow">
              <div>{content?.hero?.floating_metrics?.loss}</div>
              <div>{content?.hero?.floating_metrics?.f1}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
