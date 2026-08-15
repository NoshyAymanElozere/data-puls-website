import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function WebsiteDesignSystem({project, content}: Props) {
  // Fallback data if specific fields are missing
  const colors = project.design?.colors || ["#0f172a", "#3b82f6", "#ffffff"];
  const fonts = project.design?.typography || "Inter / Roboto";

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Typography */}
            <div>
              <span className="text-slate-400  text-xs uppercase mb-6 block">
                {content?.design_system?.typography?.label}
              </span>
              <div className="border-l-4 border-slate-900 pl-6 py-2 mb-12">
                <h3 className="text-5xl font-bold text-slate-900 mb-2">Aa</h3>
                <p className="text-xl text-slate-600">{fonts}</p>
                <p className="text-sm text-slate-400 mt-2">
                  {content?.design_system?.typography?.type_desc}
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-3xl font-bold text-slate-900 leading-tight">
                  {content?.design_system?.typography?.quote}
                </p>
                <p className="text-base text-slate-600 ">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ <br />
                  abcdefghijklmnopqrstuvwxyz <br />
                  0123456789
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  {content?.design_system?.typography?.specimen_label}
                </p>
              </div>
            </div>

            {/* Right: Color Palette */}
            <div>
              <span className="text-slate-400  text-xs uppercase mb-6 block">
                {content?.design_system?.colors?.label}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="aspect-square flex flex-col group cursor-pointer"
                  >
                    <div
                      className="flex-1 rounded-lg shadow-sm border border-slate-100 mb-3 transition-transform group-hover:scale-105"
                      style={{backgroundColor: color}}
                    ></div>
                    <div className="text-xs  text-slate-500 uppercase">
                      {color}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {content?.design_system?.colors?.palette_prefix} {i + 1}00
                    </div>
                  </div>
                ))}
              </div>

              {/* UI Component Snippet */}
              <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <span className="text-slate-400  text-xs uppercase mb-4 block">
                    {content?.design_system?.components?.label}
                  </span>
                  <div className="flex gap-4 items-center mb-8">
                    <button className="px-6 py-2 bg-brand-600 text-white rounded text-sm font-bold shadow-lg shadow-brand-600/20">
                      {content?.design_system?.components?.submit_btn}
                    </button>
                    <button className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded text-sm font-bold">
                      {content?.design_system?.components?.cancel_btn}
                    </button>
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 text-xs">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                </div>
                {project.designImage && (
                  <div className="flex-1">
                    <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        src={project.designImage}
                        alt="Design Specimen"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
