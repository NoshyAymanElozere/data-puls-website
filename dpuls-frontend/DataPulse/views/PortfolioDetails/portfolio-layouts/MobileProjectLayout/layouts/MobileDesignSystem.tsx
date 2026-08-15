import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileDesignSystem({project, content}: Props) {
  const colors = project.design?.colors || [
    "#000000",
    "#ffffff",
    "#f5f5f5",
    "#e2e8f0",
  ];
  const fonts = project.design?.typography || "San Francisco / Roboto";

  return (
    <section className="py-32 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Typography Specimen */}
            <div>
              <span className="text-slate-400  text-xs uppercase mb-6 block">
                {content?.design?.typography?.label}
              </span>
              <div className="border-l-4 border-slate-900 pl-6 py-2 mb-12">
                <h3 className="text-5xl font-bold text-slate-900 mb-2">Aa</h3>
                <p className="text-xl text-slate-600">{fonts}</p>
                <p className="text-sm text-slate-400 mt-2">
                  {content?.design?.typography?.type_label}
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-3xl font-bold text-slate-900 leading-tight">
                  {content?.design?.typography?.quote}
                </p>
                <p className="text-base text-slate-600 ">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ <br />
                  abcdefghijklmnopqrstuvwxyz <br />
                  0123456789
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  {content?.design?.typography?.specimen_label}
                </p>
              </div>
            </div>

            {/* Right: Color Palette & UI Snippet */}
            <div>
              <span className="text-slate-400  text-xs uppercase mb-6 block">
                {content?.design?.colors?.label}
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
                      {content?.design?.colors?.palette_prefix} {i + 1}00
                    </div>
                  </div>
                ))}
              </div>

              {/* UI Component Snippet */}
              <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400  text-xs uppercase mb-4 block">
                  {content?.design?.components?.label}
                </span>
                <div className="flex gap-4 items-center">
                  <button className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-brand-600/20">
                    {content?.design?.components?.action_btn}
                  </button>
                  <button className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold">
                    {content?.design?.components?.cancel_btn}
                  </button>
                  <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-brand-600 text-xs shadow-sm">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
