import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  content: any;
}

export default function AIProjectDeployment({content}: Props) {
  return (
    <section className="py-32 bg-[#0a0f1d] border-t border-white/5 relative overflow-hidden">
      {/* Tech-Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-24">
            <span className="text-brand-500  text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
              {content?.deployment?.label}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              {content?.deployment?.title ? (
                <>
                  {content.deployment.title.split(".").slice(0, -1).join(".")}{" "}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-700">
                    .
                  </span>
                </>
              ) : (
                "Inference Fabric."
              )}
            </h2>
          </div>

          {/* The Blueprint Console */}
          <div className="max-w-6xl mx-auto bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative">
            {/* Decorative corner accents */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-brand-500/30"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-brand-500/30"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
              {/* PHASE 1: Data Ingress */}
              <div className="flex flex-col items-center group w-full md:w-1/4">
                <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-brand-500/50 transition-all duration-500 mb-6 group-hover:shadow-[0_0_30px_rgba(67,97,238,0.2)]">
                  <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 group-hover:text-brand-400 transition-colors"></i>
                  {/* Status Pulse */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#020617] animate-pulse"></div>
                </div>
                <div className="text-center">
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-2">
                    {content?.deployment?.ingress?.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 ">
                    {content?.deployment?.ingress?.detail}
                  </p>
                  <div className="mt-4 flex gap-1 justify-center opacity-30">
                    <div className="w-1 h-3 bg-brand-500"></div>
                    <div className="w-1 h-3 bg-brand-500"></div>
                  </div>
                </div>
              </div>

              {/* CONNECTOR 1: Animated Flow */}
              <div className="hidden md:flex flex-1 items-center justify-center relative h-12">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M0,24 L200,24"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                  <circle r="3" fill="#4361ee">
                    <animateMotion
                      path="M0,24 L200,24"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
                <span className="absolute -top-4 text-[8px]  text-brand-500/60 uppercase tracking-widest">
                  {content?.deployment?.auth_handshake}
                </span>
              </div>

              {/* PHASE 2: Intelligence Hub (Neural Node) */}
              <div className="flex flex-col items-center group w-full md:w-1/3">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* Outer Orbit */}
                  <div
                    className="absolute inset-0 rounded-[2.5rem] border border-brand-500/20 animate-spin-slow"
                    style={{animationDuration: "10s"}}
                  ></div>
                  {/* Middle Glow */}
                  <div className="absolute inset-4 rounded-[2rem] bg-brand-600/10 blur-xl group-hover:bg-brand-600/20 transition-all"></div>
                  {/* The Core */}
                  <div className="relative w-20 h-20 bg-brand-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(67,97,238,0.4)] z-10">
                    <i className="fa-solid fa-brain text-4xl animate-pulse"></i>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <h4 className="text-brand-400 font-bold tracking-widest uppercase text-sm mb-2">
                    {content?.deployment?.gateway?.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 ">
                    {content?.deployment?.gateway?.detail}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping"></span>
                    <span className="text-[8px]  text-brand-400">
                      {content?.deployment?.gateway?.latency_prefix} 0.12ms
                    </span>
                  </div>
                </div>
              </div>

              {/* CONNECTOR 2: Animated Flow */}
              <div className="hidden md:flex flex-1 items-center justify-center relative h-12">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M0,24 L200,24"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                  <circle r="3" fill="#4361ee">
                    <animateMotion
                      path="M0,24 L200,24"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="1s"
                    />
                  </circle>
                </svg>
                <span className="absolute -top-4 text-[8px]  text-brand-500/60 uppercase tracking-widest">
                  {content?.deployment?.packet}
                </span>
              </div>

              {/* PHASE 3: API Egress */}
              <div className="flex flex-col items-center group w-full md:w-1/4">
                <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-brand-500/50 transition-all duration-500 mb-6">
                  <i className="fa-solid fa-terminal text-3xl text-slate-400 group-hover:text-brand-400"></i>
                </div>
                <div className="text-center">
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-2">
                    {content?.deployment?.egress?.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 ">
                    {content?.deployment?.egress?.detail}
                  </p>
                  <div className="mt-4 flex gap-1 justify-center opacity-30">
                    <div className="w-1 h-3 bg-brand-500"></div>
                    <div className="w-1 h-3 bg-brand-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Legend / Metrics */}
            <div className="mt-20 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12">
              {content?.deployment?.legend?.map((item: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="text-brand-500  text-xs font-black">
                    0{i + 1}
                  </div>
                  <div>
                    <h5 className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-slate-500  leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
