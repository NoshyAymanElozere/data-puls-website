import React from "react";
import {Reveal} from "../../../components/Reveal";

interface PortfolioHeroProps {
  content: {
    badge: string;
    title_line1: string;
    title_line2: string;
    subtitle: string;
    stats: {
      projects_label: string;
      projects_value: string;
      quality_label: string;
      quality_value: string;
      uptime_label: string;
      uptime_value: string;
    };
  };
}

export default function PortfolioHero({content}: PortfolioHeroProps) {
  return (
    <section className="relative h-screen min-h-[800px] flex flex-col items-center justify-center bg-[#020617] text-white overflow-hidden pt-20">
      {/* NEW VECTOR BACKGROUND: The Digital Loom (Enhanced & Faster) */}
      <div
        className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden animate-fade-in"
        style={{animationDuration: "0.8s"}}
      >
        <svg
          viewBox="0 0 1440 900"
          className="w-full h-full opacity-70"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="loom-beam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4361ee" stopOpacity="0" />
              <stop offset="20%" stopColor="#4361ee" stopOpacity="0.3" />
              <stop offset="80%" stopColor="#4361ee" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4361ee" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="loom-card-surface"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>

            <filter id="loom-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter
              id="loom-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="10"
                stdDeviation="15"
                floodColor="#000"
                floodOpacity="0.5"
              />
            </filter>

            {/* Reusable UI Components for Cards */}
            <g id="ui-browser">
              <rect
                width="280"
                height="180"
                rx="8"
                fill="url(#loom-card-surface)"
                stroke="#4361ee"
                strokeWidth="1"
                strokeOpacity="0.4"
                filter="url(#loom-shadow)"
              />
              <rect
                x="0"
                y="0"
                width="280"
                height="28"
                rx="8"
                fill="#4361ee"
                fillOpacity="0.15"
              />
              <circle cx="15" cy="14" r="3" fill="#ef4444" opacity="0.6" />
              <circle cx="25" cy="14" r="3" fill="#eab308" opacity="0.6" />
              <circle cx="35" cy="14" r="3" fill="#22c55e" opacity="0.6" />
              <rect
                x="20"
                y="48"
                width="80"
                height="112"
                rx="4"
                fill="#4361ee"
                fillOpacity="0.1"
              />
              <rect
                x="115"
                y="48"
                width="145"
                height="50"
                rx="4"
                fill="#fff"
                fillOpacity="0.08"
              />
              <rect
                x="115"
                y="110"
                width="65"
                height="50"
                rx="4"
                fill="#fff"
                fillOpacity="0.05"
              />
              <rect
                x="195"
                y="110"
                width="65"
                height="50"
                rx="4"
                fill="#fff"
                fillOpacity="0.05"
              />
            </g>

            <g id="ui-mobile">
              <rect
                width="140"
                height="240"
                rx="16"
                fill="url(#loom-card-surface)"
                stroke="#4361ee"
                strokeWidth="1"
                strokeOpacity="0.4"
                filter="url(#loom-shadow)"
              />
              <rect
                x="50"
                y="12"
                width="40"
                height="4"
                rx="2"
                fill="#fff"
                fillOpacity="0.2"
              />
              <circle cx="70" cy="65" r="24" fill="#4361ee" fillOpacity="0.2" />
              <rect
                x="20"
                y="110"
                width="100"
                height="8"
                rx="4"
                fill="#fff"
                fillOpacity="0.15"
              />
              <rect
                x="20"
                y="130"
                width="70"
                height="8"
                rx="4"
                fill="#fff"
                fillOpacity="0.08"
              />
              <rect
                x="20"
                y="160"
                width="100"
                height="60"
                rx="4"
                fill="#fff"
                fillOpacity="0.05"
              />
            </g>
          </defs>

          {/* TRACK 1: Left (Snappier Start) */}
          <g transform="translate(350, 0)" opacity="0.5">
            <rect
              x="-0.5"
              y="0"
              width="1"
              height="900"
              fill="url(#loom-beam)"
              opacity="0.15"
            />
            <g className="animate-[loom-flow_12s_cubic-bezier(0.16,1,0.3,1)_infinite]">
              <g transform="translate(-70, 0) scale(0.9)">
                <use href="#ui-mobile" />
              </g>
            </g>
            <g
              className="animate-[loom-flow_12s_cubic-bezier(0.16,1,0.3,1)_infinite]"
              style={{animationDelay: "6s"}}
            >
              <g transform="translate(-140, 0) scale(0.8)">
                <use href="#ui-browser" />
              </g>
            </g>
          </g>

          {/* TRACK 2: Center (Main Focus - Optimized Path) */}
          <g transform="translate(720, 0)">
            <rect
              x="-1"
              y="0"
              width="2"
              height="900"
              fill="url(#loom-beam)"
              opacity="0.4"
            />
            <g
              className="animate-[loom-flow_16s_cubic-bezier(0.16,1,0.3,1)_infinite]"
              style={{animationDelay: "1s"}}
            >
              <g transform="translate(-140, 0) scale(1.15)">
                <use href="#ui-browser" />
                <circle
                  cx="140"
                  cy="0"
                  r="3"
                  fill="#4361ee"
                  filter="url(#loom-glow)"
                  opacity="0.8"
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </g>
          </g>

          {/* TRACK 3: Right (Responsive Flow) */}
          <g transform="translate(1090, 0)" opacity="0.6">
            <rect
              x="-0.5"
              y="0"
              width="1"
              height="900"
              fill="url(#loom-beam)"
              opacity="0.15"
            />
            <g
              className="animate-[loom-flow_14s_cubic-bezier(0.16,1,0.3,1)_infinite]"
              style={{animationDelay: "3s"}}
            >
              <g transform="translate(-140, 0) scale(0.85)">
                <use href="#ui-browser" />
              </g>
            </g>
            <g
              className="animate-[loom-flow_14s_cubic-bezier(0.16,1,0.3,1)_infinite]"
              style={{animationDelay: "10s"}}
            >
              <g transform="translate(-70, 0) scale(0.9)">
                <use href="#ui-mobile" />
              </g>
            </g>
          </g>

          {/* Atmosphere: Scanning lines */}
          <g opacity="0.08">
            <line
              x1="0"
              y1="-100"
              x2="1440"
              y2="-100"
              stroke="#4361ee"
              strokeWidth="1"
              className="animate-[scan-down_8s_linear_infinite]"
            />
            <line
              x1="0"
              y1="-500"
              x2="1440"
              y2="-500"
              stroke="#4361ee"
              strokeWidth="1"
              className="animate-[scan-down_12s_linear_infinite]"
            />
          </g>
        </svg>
      </div>

      {/* GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)] z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#020408] via-[#020617]/50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>

      {/* HERO CONTENT */}
      <div className="container mx-auto px-6 relative z-20 text-center">
        <Reveal>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-brand-500/20 bg-brand-950/40 backdrop-blur-md shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-xs  font-bold uppercase tracking-[0.25em] text-brand-100">
                {content.badge}
              </span>
            </div>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9] animate-reveal-up opacity-0"
            style={{animationDelay: "0.2s", animationFillMode: "forwards"}}
          >
            <span className="block text-white opacity-90">
              {content.title_line1}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-brand-200 to-brand-600">
              {content.title_line2}
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-xl text-slate-400 font-light leading-relaxed mb-12 animate-reveal-up opacity-0"
            style={{animationDelay: "0.4s", animationFillMode: "forwards"}}
          >
            {content.subtitle}
          </p>

          {/* Technical Stats Bar */}
          <div
            className="flex flex-wrap justify-center gap-12 border-t border-white/10 pt-8 max-w-4xl mx-auto animate-fade-in opacity-0"
            style={{animationDelay: "0.6s", animationFillMode: "forwards"}}
          >
            <div className="text-center">
              <div className="text-xs  text-brand-500 uppercase tracking-widest mb-2">
                {content.stats.projects_label}
              </div>
              <div className="text-3xl font-bold text-white">
                {content.stats.projects_value}
              </div>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-xs  text-brand-500 uppercase tracking-widest mb-2">
                {content.stats.quality_label}
              </div>
              <div className="text-3xl font-bold text-white">
                {content.stats.quality_value}
              </div>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-xs  text-brand-500 uppercase tracking-widest mb-2">
                {content.stats.uptime_label}
              </div>
              <div className="text-3xl font-bold text-white">
                {content.stats.uptime_value}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        /* 
           THE DIGITAL LOOM ANIMATION (FAST START)
           Logic: Initial entry happens within the first 8% for immediate visual impact.
        */
        @keyframes loom-flow {
           0% { 
              transform: translateY(-300px) scale(0.5); 
              opacity: 0; 
           }
           8% { 
              transform: translateY(150px) scale(1); 
              opacity: 1; 
           }
           60% { 
              transform: translateY(550px) scale(1); 
              opacity: 1; 
           }
           100% { 
              transform: translateY(1100px) scale(0.6); 
              opacity: 0; 
           }
        }
        
        @keyframes scan-down {
           0% { transform: translateY(0); opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { transform: translateY(1000px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
