import React, {useRef} from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function WebsiteGallery({project, content}: Props) {
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

  if (!project.gallery || project.gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-32 bg-[#F8FAFC] border-t border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {content?.gallery?.title}
              </h2>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 hidden md:block">
                {content?.gallery?.subtitle}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex gap-4">
              <button
                onClick={() => scrollGallery("left")}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all flex items-center justify-center shadow-sm hover:shadow-lg"
                aria-label="Previous Slide"
              >
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-right" : "fa-arrow-left"}`}
                ></i>
              </button>
              <button
                onClick={() => scrollGallery("right")}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all flex items-center justify-center shadow-sm hover:shadow-lg"
                aria-label="Next Slide"
              >
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"}`}
                ></i>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Slider Container */}
        <Reveal delay={200}>
          <div
            ref={galleryRef}
            className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar scroll-smooth"
            style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
          >
            {project.gallery.map((img, i) => (
              <div
                key={i}
                className="min-w-[90%] md:min-w-[65%] snap-center first:pl-2 last:pr-2"
              >
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-slate-200 cursor-zoom-in aspect-video">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 duration-300"></div>
                  <img
                    src={img}
                    alt={`Project Screenshot ${i + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                      {content?.gallery?.fullscreen}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs  text-slate-400 px-1">
                  <span>
                    {content?.gallery?.fig_prefix} 0{i + 1}
                  </span>
                  <span>{content?.gallery?.render_label}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
