import React, {useRef} from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingGallery({project, content}: Props) {
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
    <section className="py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">
                {content?.gallery?.title}
              </h2>
              <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mt-3">
                {content?.gallery?.sub_label}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => scrollGallery("left")}
                className="w-16 h-16 rounded-full border-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center shadow-lg"
              >
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-right" : "fa-arrow-left"}`}
                ></i>
              </button>
              <button
                onClick={() => scrollGallery("right")}
                className="w-16 h-16 rounded-full border-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center shadow-lg"
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
            className="flex gap-12 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar scroll-smooth px-4"
          >
            {project.gallery.map((img, i) => (
              <div key={i} className="min-w-[85%] md:min-w-[60%] snap-center">
                <div className="group relative overflow-hidden rounded-[3rem] bg-white shadow-2xl border border-slate-200 aspect-video cursor-zoom-in">
                  <img
                    src={img}
                    alt={`${content?.gallery?.alt_text || "Asset"} ${i + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-brand-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="mt-8 flex justify-between items-end px-6">
                  <div>
                    <span className="block text-[10px]  font-bold text-slate-400 uppercase mb-1">
                      {content?.gallery?.visual_prefix}0{i + 1}
                    </span>
                    <h4 className="text-2xl font-black uppercase tracking-tighter">
                      {content?.gallery?.interface_title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-brand-600 uppercase border border-brand-600 px-3 py-1 rounded">
                    {content?.gallery?.approved_badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
