import React, {useRef} from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectGallery({project, content}: Props) {
  const {dir} = useLanguage();
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const scrollAmount = galleryRef.current.clientWidth * 0.6;
      galleryRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!project.gallery || project.gallery.length === 0) return null;

  return (
    <section className="py-32 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">
                {content?.gallery?.title}
              </h2>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                {content?.gallery?.subtitle}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => scrollGallery("left")}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
              >
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-right" : "fa-arrow-left"}`}
                ></i>
              </button>
              <button
                onClick={() => scrollGallery("right")}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
              >
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"}`}
                ></i>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div
            ref={galleryRef}
            className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar scroll-smooth"
          >
            {project.gallery.map((img, i) => (
              <div key={i} className="min-w-[85%] md:min-w-[65%] snap-center">
                <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-200 shadow-2xl aspect-video cursor-zoom-in">
                  <img
                    src={img}
                    alt={`${content?.gallery?.alt_text} ${i + 1}`}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-10 left-10 text-white">
                    <span className="block  text-[10px] uppercase tracking-widest opacity-60">
                      {content?.gallery?.frame_prefix}0{i + 1}
                    </span>
                    <span className="block font-bold text-xl uppercase tracking-tighter">
                      {content?.gallery?.output_label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
