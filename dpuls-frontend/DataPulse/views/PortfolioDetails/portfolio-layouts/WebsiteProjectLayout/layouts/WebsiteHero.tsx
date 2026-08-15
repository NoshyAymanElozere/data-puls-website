import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function WebsiteHero({project, content}: Props) {
  return (
    <section className="relative min-h-[90vh] pt-40 pb-20 flex flex-col justify-center bg-[#020617] overflow-hidden border-b border-slate-800">
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

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
        {/* Left: Technical Spec */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-brand-600 text-white text-[10px]  uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                {content?.hero?.prefix}
                {project.id}
              </span>
              <div className="h-px flex-1 bg-slate-700"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {content?.hero?.status}
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
              <div className="border-l-2 border-brand-500 pl-4 rtl:pr-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.client}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.client}
                </span>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 rtl:pr-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.role}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.role}
                </span>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 rtl:pr-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.year}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.year || content?.hero?.defaults?.year}
                </span>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 rtl:pr-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0">
                <span className="block text-[10px]  uppercase text-slate-500 mb-1 tracking-widest">
                  {content?.hero?.labels?.core}
                </span>
                <span className="block text-white font-bold text-lg">
                  {project.tags[0]}
                </span>
              </div>
            </div>

            <p className="text-xl text-slate-400 font-light leading-snug max-w-lg mb-12">
              {project.shortDesc}
            </p>

            <div className="flex flex-wrap gap-6">
              {project.liveUrl && (
                <div className="group/btn relative">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative px-8 py-4 bg-white text-slate-900 font-bold text-sm uppercase tracking-widest overflow-hidden hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3"
                  >
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                      {content?.hero?.cta?.live_preview}{" "}
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </span>
                    <div className="absolute inset-0 bg-brand-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                  </a>

                  {/* Auth Tooltip */}
                  {content?.authTooltip && (
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 px-5 py-3 bg-[#0f172a] text-white border border-slate-700 rounded-lg shadow-2xl opacity-0 scale-95 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                      <div className="text-brand-400 text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-slate-700/50 pb-1">
                        {content.authTooltip.label}
                      </div>
                      <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                        <div className="flex justify-between gap-6">
                          <span className="text-slate-500 uppercase">{content.authTooltip.emailLabel || "Email"}:</span>
                          <span className="text-slate-200">{content.authTooltip.email}</span>
                        </div>
                        <div className="flex justify-between gap-6">
                          <span className="text-slate-500 uppercase">{content.authTooltip.passwordLabel || "Pass"}:</span>
                          <span className="text-slate-200">{content.authTooltip.password}</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#0f172a]"></div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Links (e.g., Providers Portal) */}
              {content?.additionalLinks?.map((link: any, idx: number) => (
                <div key={idx} className="group/btn relative">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative px-8 py-4 bg-slate-900 text-white border border-slate-700 font-bold text-sm uppercase tracking-widest overflow-hidden hover:border-brand-500 transition-all flex items-center gap-3"
                  >
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                      {link.label}{" "}
                      <i className="fa-solid fa-arrow-up-right-from-square text-slate-500 group-hover:text-brand-400"></i>
                    </span>
                    <div className="absolute inset-0 bg-slate-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  </a>

                  {/* Auth Tooltip for Additional Link */}
                  {link.authTooltip && (
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 px-5 py-3 bg-[#0f172a] text-white border border-slate-700 rounded-lg shadow-2xl opacity-0 scale-95 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                      <div className="text-brand-400 text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-slate-700/50 pb-1">
                        {link.authTooltip.label}
                      </div>
                      <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                        <div className="flex justify-between gap-6">
                          <span className="text-slate-500 uppercase">{link.authTooltip.emailLabel || "Email"}:</span>
                          <span className="text-slate-200">{link.authTooltip.email}</span>
                        </div>
                        <div className="flex justify-between gap-6">
                          <span className="text-slate-500 uppercase">{link.authTooltip.passwordLabel || "Pass"}:</span>
                          <span className="text-slate-200">{link.authTooltip.password}</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#0f172a]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: Floating Interface */}
        <div className="relative hidden lg:flex items-center justify-center perspective-[2000px]">
          {/* Decorative Backdrops */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-transparent rounded-full opacity-30 blur-3xl transform translate-x-20"></div>

          {/* Main Card */}
          <div className="relative w-fit max-w-full h-auto bg-[#0f172a] rounded-lg shadow-2xl border border-slate-700 transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out p-1">
            <div className="absolute top-4 left-4 flex gap-2 z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <div className="h-full w-full overflow-hidden bg-slate-900 rounded border border-slate-800 relative group">
              <img
                src={project.image}
                alt="Interface"
                className="w-auto max-w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity rounded"
              />
              {/* Scanline Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-y-full transition-all duration-1000 ease-linear pointer-events-none"
                style={{height: "20%"}}
              ></div>
            </div>
          </div>

          {/* Floating Code Snippet */}
          <div className="absolute -bottom-10 -left-10 bg-black/80 backdrop-blur-xl text-slate-300 p-6 rounded-lg  text-xs shadow-xl border border-slate-700 transform translate-z-[50px] hidden xl:block">
            <div className="mb-2 text-brand-400 opacity-50">
              {content?.hero?.system_config?.label}
            </div>
            <div>
              {content?.hero?.system_config?.status}{" "}
              <span className="text-green-400">
                {content?.hero?.system_config?.status_val}
              </span>
            </div>
            <div>
              {content?.hero?.system_config?.latency}{" "}
              <span className="text-amber-400">
                {content?.hero?.system_config?.latency_val}
              </span>
            </div>
            <div>
              {content?.hero?.system_config?.render}{" "}
              <span className="text-blue-400">
                {content?.hero?.system_config?.render_val}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
