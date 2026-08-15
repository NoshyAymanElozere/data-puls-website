import React from "react";
import {Reveal} from "../../../components/Reveal";

interface MissionVisionProps {
  content: {
    mission_title: string;
    mission_heading: string;
    mission_heading_accent: string;
    mission_text: string;
    vision_title: string;
    vision_heading: string;
    vision_heading_accent: string;
    vision_text: string;
  };
}

export default function AboutMissionVision({content}: MissionVisionProps) {
  return (
    <section className="relative bg-[#020617] py-32 lg:py-48 overflow-hidden isolate">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020617_85%)] z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#020408] to-transparent z-0 pointer-events-none"></div>

      {/* BACKGROUND: "The Cybernetic Turbine" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] lg:w-[1400px] lg:h-[1400px] opacity-15 pointer-events-none z-0">
        <svg
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient
              id="turbineGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4361ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2b3ff0" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Main Rotating Turbine */}
          <g className="origin-center animate-[spin_60s_linear_infinite]">
            <circle
              cx="400"
              cy="400"
              r="380"
              stroke="#4361ee"
              strokeWidth="1"
              strokeDasharray="10 40"
            />
            <circle
              cx="400"
              cy="400"
              r="350"
              stroke="#4361ee"
              strokeWidth="0.5"
            />

            {/* Blades */}
            {[...Array(8)].map((_, i) => (
              <path
                key={i}
                d={`M400,400 L${400 + 350 * Math.cos((i * Math.PI) / 4)},${400 + 350 * Math.sin((i * Math.PI) / 4)}`}
                stroke="#4361ee"
                strokeWidth="1"
                opacity="0.2"
              />
            ))}
          </g>

          {/* Counter-Rotating Inner Ring */}
          <g className="origin-center animate-[spin_40s_linear_infinite_reverse]">
            <circle
              cx="400"
              cy="400"
              r="250"
              stroke="url(#turbineGrad)"
              strokeWidth="2"
              strokeDasharray="50 50"
            />
            <path
              d="M400,150 L400,650 M150,400 L650,400"
              stroke="#4361ee"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </g>

          {/* Static Reactor Core */}
          <circle
            cx="400"
            cy="400"
            r="100"
            stroke="#4361ee"
            strokeWidth="1"
            fill="#4361ee"
            fillOpacity="0.05"
            className="animate-pulse"
          />
          <circle
            cx="400"
            cy="400"
            r="60"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Mission Card */}
          <Reveal>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-10 lg:p-14 rounded-[2rem] hover:bg-white/[0.05] hover:border-brand-500/30 transition-all duration-500 group flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                    <i className="fa-solid fa-bullseye text-xl"></i>
                  </span>
                  <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">
                    {content.mission_title}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {
                    content.mission_heading.split(
                      content.mission_heading_accent,
                    )[0]
                  }
                  <span className="text-brand-500">
                    {content.mission_heading_accent}
                  </span>
                  {
                    content.mission_heading.split(
                      content.mission_heading_accent,
                    )[1]
                  }
                </h3>
                <p className="text-white text-lg leading-relaxed font-light">
                  {content.mission_text}
                </p>
              </div>

              <div className="mt-12 w-full h-px bg-gradient-to-r from-brand-500/50 to-transparent group-hover:from-brand-500 group-hover:via-brand-400 transition-all duration-700"></div>
            </div>
          </Reveal>

          {/* Vision Card */}
          <Reveal delay={200}>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-10 lg:p-14 rounded-[2rem] hover:bg-white/[0.05] hover:border-brand-500/30 transition-all duration-500 group flex flex-col justify-between mt-0 md:mt-16 lg:mt-24">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                    <i className="fa-solid fa-eye text-xl"></i>
                  </span>
                  <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">
                    {content.vision_title}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {
                    content.vision_heading.split(
                      content.vision_heading_accent,
                    )[0]
                  }
                  <span className="text-brand-500">
                    {content.vision_heading_accent}
                  </span>
                  {
                    content.vision_heading.split(
                      content.vision_heading_accent,
                    )[1]
                  }
                </h3>
                <p className="text-white text-lg leading-relaxed font-light">
                  {content.vision_text}
                </p>
              </div>

              <div className="mt-12 w-full h-px bg-gradient-to-r from-brand-500/50 to-transparent group-hover:from-brand-500 group-hover:via-brand-400 transition-all duration-700"></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
