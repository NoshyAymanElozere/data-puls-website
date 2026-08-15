import React from "react";
import {Section} from "../../../components/UI";
import {Reveal} from "../../../components/Reveal";

interface ValuesProps {
  content: {
    label: string;
    title: string;
    subtitle: string;
    v1_title: string;
    v1_desc: string;
    v2_title: string;
    v2_desc: string;
    v3_title: string;
    v3_desc: string;
    v4_title: string;
    v4_desc: string;
  };
}

export default function AboutValues({content}: ValuesProps) {
  return (
    <Section className="relative bg-white py-32 lg:py-48 overflow-hidden border-t border-slate-100 isolate">
      {/* NEW BACKGROUND VECTOR: "Abstract Geometric Flow" */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden">
        <svg
          viewBox="0 0 1440 1000"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="blur-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" result="blur" />
            </filter>
          </defs>

          {/* Background Gradient Mesh - Very Subtle */}
          <path d="M0 0 H1440 V1000 H0 Z" fill="white" />
          <circle
            cx="200"
            cy="200"
            r="500"
            fill="#f0f4ff"
            filter="url(#blur-soft)"
            opacity="0.8"
          />
          <circle
            cx="1200"
            cy="800"
            r="600"
            fill="#f0f4ff"
            filter="url(#blur-soft)"
            opacity="0.8"
          />

          {/* Geometric Shape 1: Rotating Cube Frame */}
          <g
            className="origin-center animate-[spin_60s_linear_infinite]"
            style={{transformOrigin: "20% 40%"}}
          >
            <rect
              x="100"
              y="200"
              width="300"
              height="300"
              rx="40"
              fill="none"
              stroke="#e0eaff"
              strokeWidth="40"
              opacity="0.6"
            />
            <rect
              x="150"
              y="250"
              width="200"
              height="200"
              rx="30"
              fill="none"
              stroke="#e0eaff"
              strokeWidth="20"
              opacity="0.8"
            />
          </g>

          {/* Geometric Shape 2: Floating Triangle */}
          <path
            d="M1200 100 L1400 500 L1000 500 Z"
            fill="none"
            stroke="#c7d9ff"
            strokeWidth="2"
            opacity="0.3"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,50; 0,0"
              dur="10s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 1200 300; 10 1200 300; 0 1200 300"
              dur="15s"
              repeatCount="indefinite"
              additive="sum"
            />
          </path>

          {/* Geometric Shape 3: The Flowing Ribbon */}
          <path
            d="M-100 800 C 400 600, 800 1100, 1540 800"
            fill="none"
            stroke="#dbeafe"
            strokeWidth="80"
            strokeLinecap="round"
            opacity="0.4"
            className="animate-pulse"
            style={{animationDuration: "8s"}}
          />
          <path
            d="M-100 850 C 400 650, 800 1150, 1540 850"
            fill="none"
            stroke="#eff6ff"
            strokeWidth="40"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Geometric Shape 4: Grid Dots */}
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="2" fill="#e0eaff" />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#grid-pattern)"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col items-start mb-24 max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-brand-600 rounded-sm"></span>
              <span className="text-brand-900  text-sm font-bold uppercase tracking-widest">
                {content.label}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-none mb-6">
              {content.title}
            </h2>
            <p className="text-xl text-black font-light max-w-lg">
              {content.subtitle}
            </p>
          </div>
        </Reveal>

        {/* THE MANIFESTO LIST (NO CARDS) */}
        <div className="flex flex-col border-t border-slate-200">
          {[1, 2, 3, 4].map((v) => (
            <Reveal key={v} delay={v * 100}>
              <div className="group relative py-12 border-b border-slate-200 transition-colors duration-500 hover:bg-slate-50/80 cursor-default">
                {/* Hover Line Highlight */}
                <div className="absolute left-0 top-0 w-0 h-[1px] bg-brand-600 transition-all duration-700 group-hover:w-full"></div>

                <div className="flex flex-col md:flex-row items-baseline gap-8 md:gap-16">
                  {/* 01. Numeral */}
                  <div className="flex-shrink-0 w-24">
                    <span className=" text-4xl font-light text-slate-900 group-hover:text-brand-600 transition-colors duration-300">
                      0{v}
                    </span>
                  </div>

                  {/* 02. Title */}
                  <div className="flex-shrink-0 w-full md:w-1/3">
                    <h4 className="text-3xl font-bold text-slate-900 tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                      {content[`v${v}_title` as keyof typeof content]}
                    </h4>
                  </div>

                  {/* 03. Description */}
                  <div className="flex-grow max-w-xl">
                    <p className="text-lg text-slate-900 leading-relaxed font-light group-hover:text-slate-800 transition-colors duration-300">
                      {content[`v${v}_desc` as keyof typeof content]}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
