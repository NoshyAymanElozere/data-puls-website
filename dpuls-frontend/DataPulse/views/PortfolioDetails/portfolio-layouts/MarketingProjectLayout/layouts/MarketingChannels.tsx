import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingChannels({project, content}: Props) {
  return (
    <section className="py-32 bg-[#020617] text-white relative overflow-hidden">
      {/* Animated Data Streams (Fast Duration Loops) */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="signal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4361ee" stopOpacity="0" />
              <stop offset="50%" stopColor="#4361ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#4361ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 L1440,400"
            stroke="url(#signal-grad)"
            strokeWidth="1"
            strokeDasharray="100 500"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="600"
              to="0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,400 L1440,100"
            stroke="url(#signal-grad)"
            strokeWidth="1"
            strokeDasharray="100 500"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="600"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="text-[10px]  font-bold uppercase tracking-[0.4em] text-brand-400">
                {content?.channels?.label}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              {content?.channels?.title}
            </h2>
            <p className="text-slate-500  text-xs uppercase tracking-widest">
              {content?.channels?.sub_label}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {project.marketingSpec?.channels.map((channel, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group relative bg-[#0f172a] border border-white/5 p-10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-brand-500/50 hover:shadow-[0_0_50px_rgba(67,97,238,0.15)] hover:-translate-y-2 h-full flex flex-col">
                {/* Status & Signal Indicator (High Vis) */}
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-sm">
                      <i
                        className={`fa-solid ${i % 2 === 0 ? "fa-rss" : "fa-wave-square"} text-lg`}
                      ></i>
                    </div>
                    <div>
                      <span className="block text-[8px]  text-slate-500 uppercase tracking-[0.2em] mb-0.5">
                        {content?.channels?.node_label}
                      </span>
                      <span className="block text-[10px] font-bold text-white ">
                        {content?.channels?.node_prefix}0{i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">
                      {content?.channels?.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tight mb-4 text-white group-hover:text-brand-400 transition-colors">
                  {channel.name}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed flex-grow">
                  {channel.role}
                </p>

                {/* Real-time Data Viz (High Vis) */}
                <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-end gap-1 mb-4 h-12">
                    {[...Array(12)].map((_, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-brand-500/20 group-hover:bg-brand-500 transition-all duration-300 rounded-t-sm"
                        style={{
                          height: `${30 + Math.random() * 70}%`,
                          transitionDelay: `${idx * 50}ms`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px]  text-slate-500 uppercase tracking-widest">
                    <span>{content?.channels?.sentiment}</span>
                    <span className="text-brand-400 font-bold">98.4%</span>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-[-25px] right-[-25px] w-20 h-20 bg-brand-500/20 rotate-45"></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
