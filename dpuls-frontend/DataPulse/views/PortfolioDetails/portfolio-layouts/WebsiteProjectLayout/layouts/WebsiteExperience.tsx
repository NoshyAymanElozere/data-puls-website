import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function WebsiteExperience({project, content}: Props) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="mb-12 flex justify-between items-end">
            <div>
              <span className="text-brand-600 font-bold text-xs uppercase tracking-widest">
                {content?.experience?.label}
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mt-2">
                {content?.experience?.title}
              </h2>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-xs  text-slate-400">
                {content?.experience?.res_label}
              </div>
              <div className="text-xs  text-slate-400">
                {content?.experience?.scale_label}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="rounded-xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-50">
            {/* Browser Bar */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
              <div className="flex-1 bg-slate-100 h-8 rounded px-4 flex items-center text-xs text-slate-400 ">
                {project.liveUrl || content?.experience?.default_url}
              </div>
            </div>

            {/* Viewport Content */}
            <div className="aspect-[16/9] overflow-y-auto overflow-x-hidden relative group hide-scrollbar">
              <img
                src={project.experienceImage || project.image}
                alt="Full Website Mockup"
                className="w-full h-auto object-top transition-transform duration-[10s] ease-linear group-hover:-translate-y-[calc(100%-56.25%)]"
              />

              {/* Overlay hint */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <span className="text-white font-bold uppercase tracking-widest border border-white px-4 py-2">
                  {content?.experience?.scrolling_preview}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
