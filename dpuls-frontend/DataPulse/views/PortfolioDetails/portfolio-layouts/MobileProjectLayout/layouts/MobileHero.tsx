import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileHero({project, content}: Props) {
  return (
    <section className="relative min-h-[90vh] pt-40 pb-20 flex flex-col justify-center bg-[#020617] overflow-hidden border-b border-slate-800 group/hero">
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Soft Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full py-20 lg:py-0">
        {/* Left: Technical Spec */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-brand-600 text-white text-[10px]  uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                {content?.hero?.prefix}
                {project.id}
              </span>
              <div className="h-px flex-1 bg-slate-700"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                {content?.hero?.live_status}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.85] uppercase">
              {project.title.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h1>

            {/* Project Metadata Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10 max-w-md">
              <div className="border-l-2 border-brand-500 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pr-4 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.client}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.client || content?.hero?.defaults?.client}
                </span>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pr-4 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.role}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.role || content?.hero?.defaults?.role}
                </span>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pr-4 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.year}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.year || "2024"}
                </span>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pr-4 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.platform}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.tags?.[0] || content?.hero?.defaults?.platform}
                </span>
              </div>
            </div>

            <p className="text-xl text-slate-400 font-light leading-snug max-w-lg mb-12">
              {project.shortDesc}
            </p>

            {/* Action Buttons: Enhanced App Store & Google Play */}
            <div className="flex flex-wrap gap-4">
              {/* App Store Button */}
              <div className="group relative">
                <button className="group relative px-6 py-3.5 bg-white text-slate-900 rounded-xl overflow-hidden hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 border border-transparent hover:border-white/20">
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                    <i className="fa-brands fa-apple text-2xl"></i>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">
                        {content?.hero?.buttons?.app_store_sub}
                      </span>
                      <span className="text-sm font-black uppercase tracking-tighter">
                        {content?.hero?.buttons?.app_store}
                      </span>
                    </div>
                  </span>
                  <div className="absolute inset-0 bg-brand-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </button>

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  {content?.hero?.buttons?.tooltip}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-600"></div>
                </div>
              </div>

              {/* Google Play Button */}
              <div className="group relative">
                <button className="group relative px-6 py-3.5 bg-slate-900 text-white rounded-xl overflow-hidden hover:shadow-[0_0_40px_rgba(67,97,238,0.2)] transition-all duration-300 border border-slate-800 hover:border-brand-500">
                  <span className="relative z-10 flex items-center gap-3">
                    <i className="fa-brands fa-google-play text-xl"></i>
                    <div className="flex flex-col items-start leading-tight text-left">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                        {content?.hero?.buttons?.google_play_sub}
                      </span>
                      <span className="text-sm font-black uppercase tracking-tighter">
                        {content?.hero?.buttons?.google_play}
                      </span>
                    </div>
                  </span>
                  <div className="absolute inset-0 bg-brand-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                </button>

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  {content?.hero?.buttons?.tooltip}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-600"></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: Floating Mobile Interface */}
        <div className="relative h-[600px] flex items-center justify-center perspective-[2000px] order-1 lg:order-2">
          {/* Decorative Backdrops */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-transparent rounded-full opacity-30 blur-3xl transform translate-x-20"></div>

          {/* Mobile Device Mockup with Perspective */}
          <div className="relative w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-[#1e293b] shadow-2xl transform rotate-y-[-12deg] rotate-x-[4deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out overflow-hidden ring-1 ring-white/10">
            <img
              src={project.image}
              alt="App Interface"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
          </div>

          {/* Floating Data Modules */}
          <div className="absolute -bottom-4 -left-4 bg-black/80 backdrop-blur-xl text-slate-300 p-6 rounded-lg  text-[10px] shadow-xl border border-slate-700 transform translate-z-[50px] hidden md:block">
            <div className="mb-2 text-brand-400 opacity-50">
              {content?.hero?.config?.label}
            </div>
            <div>
              {content?.hero?.config?.sync}{" "}
              <span className="text-green-400">
                {content?.hero?.config?.sync_val}
              </span>
            </div>
            <div>
              {content?.hero?.config?.biometrics}{" "}
              <span className="text-blue-400">
                {content?.hero?.config?.biometrics_val}
              </span>
            </div>
            <div>
              {content?.hero?.config?.storage}{" "}
              <span className="text-amber-400">
                {content?.hero?.config?.storage_val}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
