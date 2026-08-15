import React, {useState, useEffect, useMemo} from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MobileGallery({project, content}: Props) {
  const {dir} = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => {
    return project.gallery && project.gallery.length > 0
      ? project.gallery
      : [project.image, project.image, project.image];
  }, [project.gallery, project.image]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-32 bg-[#F8FAFC] border-t border-slate-200 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_#e2e8f0_0%,_transparent_70%)] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                {content?.gallery?.title || "Interface Index"}
              </h2>
              <div className="w-24 h-1.5 bg-brand-600 mx-auto rounded-full mb-6"></div>
              <p className="text-slate-500 max-w-lg mx-auto font-medium">
                {content?.gallery?.subtitle ||
                  "Explore the high-fidelity screens of the application."}
              </p>
            </div>
          </Reveal>
        </div>

        {/* 5-Image Fluid Carousel */}
        <div className="w-full relative py-10 min-h-[750px] flex flex-col items-center justify-center overflow-hidden">
          {/* Decorative Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Navigation Controls - Global Position */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 md:px-12 lg:px-24 z-50 pointer-events-none">
            <button
              onClick={prevSlide}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-2xl flex items-center justify-center text-slate-600 hover:bg-brand-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 group pointer-events-auto"
            >
              <i
                className={`fa-solid ${dir === "rtl" ? "fa-arrow-right" : "fa-arrow-left"} text-lg transition-transform group-hover:scale-110`}
              ></i>
            </button>

            <button
              onClick={nextSlide}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-2xl flex items-center justify-center text-slate-600 hover:bg-brand-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 group pointer-events-auto"
            >
              <i
                className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-lg transition-transform group-hover:scale-110`}
              ></i>
            </button>
          </div>

          {/* Carousel Track */}
          <div className="relative flex items-center justify-center w-full h-[650px] md:h-[750px]">
            {images.map((img: string, i: number) => {
              // Calculate relative position to currentIndex for circular array
              let offset = i - currentIndex;
              if (offset > images.length / 2) offset -= images.length;
              if (offset < -images.length / 2) offset += images.length;

              const isActive = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={i}
                  className="absolute transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{
                    transform: `translateX(${offset * 300}px) scale(${isActive ? 1 : 1 - Math.abs(offset) * 0.15})`,
                    zIndex: 20 - Math.abs(offset),
                    opacity: 1 - Math.abs(offset) * 0.4,
                    filter: isActive ? "none" : "blur(2px) grayscale(40%)",
                  }}
                >
                  {/* Phone Mockup Wrapper */}
                  <div
                    className={`relative transition-all duration-500 ${isActive ? "w-[280px] sm:w-[320px] md:w-[350px]" : "w-[240px] sm:w-[280px] md:w-[300px]"} aspect-[9/19]`}
                  >
                    {isActive ? (
                      // ACTIVE CENTRAL MOCKUP
                      <div className="w-full h-full bg-slate-900 border-[10px] border-slate-950 rounded-[3.5rem] p-2.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative">
                        {/* Internal Hardware Bezel */}
                        <div className="absolute inset-0 rounded-[2.8rem] border-4 border-slate-800 pointer-events-none z-30"></div>

                        {/* Dynamic Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-40 flex items-center justify-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-pulse"></div>
                          <div className="w-10 h-1 rounded-full bg-slate-800"></div>
                        </div>

                        {/* Screen Content */}
                        <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-950 relative">
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover transition-opacity duration-300"
                          />
                          {/* Glass Reflective Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>
                        </div>

                        {/* Virtual Home Bar */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-40"></div>
                      </div>
                    ) : (
                      // SIDE GHOST PREVIEWS
                      <div className="w-full h-full bg-slate-200 shadow-xl overflow-hidden rounded-[3rem] border-4 border-white/50">
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="container mx-auto px-6">
            {/* Metadata & Indicators */}
            <div className="mt-8 flex flex-col items-center">
              <Reveal delay={400}>
                <div className="flex gap-2.5 mb-8">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-10 bg-brand-600" : "w-1.5 bg-slate-300"}`}
                      aria-label={`Go to screen ${i + 1}`}
                    />
                  ))}
                </div>
              </Reveal>

              <Reveal delay={500}>
                <div className="flex items-center gap-6 px-8 py-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      {content?.gallery?.fig_prefix || "SCAN."} 0
                      {currentIndex + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {content?.gallery?.render_label || "INTERFACE_INDEX"}
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-100"></div>
                  <button className="text-brand-600 text-xs font-black uppercase tracking-widest hover:text-brand-700 transition-colors">
                    {content?.gallery?.fullscreen || "View Resolution"}
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
