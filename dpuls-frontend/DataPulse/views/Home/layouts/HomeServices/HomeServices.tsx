import React, {useRef} from "react";
import {Section, SectionHeader} from "../../../../components/UI";
import {useLanguage} from "../../../../components/LanguageContext";
import {Link} from "@/components/RouterShim";
import {Reveal} from "../../../../components/Reveal";

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
}

interface HomeServicesProps {
  services: ServiceItem[];
  content: {
    title: string;
    subtitle: string;
    view_details: string;
    view_services: string;
    badge?: string;
    headline_part1?: string;
    headline_accent1?: string;
    headline_part2?: string;
    headline_accent2?: string;
    headline_part3?: string;
  };
}

export default function HomeServices({services, content}: HomeServicesProps) {
  const {dir} = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!services || services.length === 0 || !content?.title) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstCard = container.firstElementChild as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth : 350;
      const gap = 24;
      const scrollAmount = cardWidth + gap;

      const newScrollLeft =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section className="bg-brand-50 pt-32 pb-12 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div className="max-w-3xl">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/20 bg-brand-50 text-brand-600 font-bold text-xs mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                <span>{content.badge || content.title}</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.2]">
                {content.headline_part1 ? (
                  <>
                    {content.headline_part1}{" "}
                    <span className="text-brand-600 font-bold">
                      {content.headline_accent1}
                    </span>{" "}
                    {content.headline_part2}{" "}
                    <span className="text-brand-600 font-bold">
                      {content.headline_accent2}
                    </span>{" "}
                    {content.headline_part3}
                  </>
                ) : (
                  content.title
                )}
              </h2>

              {/* Subtitle / Description */}
              {content.subtitle && (
                <p className="text-lg text-gray-600 leading-relaxed font-normal">
                  {content.subtitle}
                </p>
              )}

              <div className="h-1.5 w-24 bg-brand-600 mt-6 rounded-full"></div>
            </div>

            {/* Top Left Link: View All Services */}
            <div className="hidden md:block">
              <Link
                to="/services"
                className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:text-brand-600"
              >
                <span>{content.view_services}</span>
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} transform transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1`}
                ></i>
              </Link>
            </div>
          </div>
          {/* Custom Navigation Controls */}
          <div className="flex flex-col md:flex-row justify-end items-center mb-4 gap-8">
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scroll(dir === "rtl" ? "right" : "left")}
                className="w-14 h-14 rounded-full border border-gray-200 bg-white text-gray-400 flex items-center justify-center hover:bg-brand-800 hover:text-white hover:border-brand-800 transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none group"
                aria-label="Previous"
              >
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-right" : "fa-arrow-left"} text-lg group-hover:scale-110 transition-transform`}
                ></i>
              </button>
              <button
                onClick={() => scroll(dir === "rtl" ? "left" : "right")}
                className="w-14 h-14 rounded-full border border-gray-200 bg-white text-gray-400 flex items-center justify-center hover:bg-brand-800 hover:text-white hover:border-brand-800 transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none group"
                aria-label="Next"
              >
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-lg group-hover:scale-110 transition-transform`}
                ></i>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-16 pt-4 snap-x snap-mandatory scroll-smooth hide-scrollbar px-2"
            style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
          >
            {services.map((service, index) => {
              const isFirst = index === 0;
              return (
                <Link
                  to={`/services/${service.slug}`}
                  key={service.id}
                  className="min-w-[85%] md:min-w-[40%] lg:min-w-[28%] snap-start group relative"
                >
                  <div
                    className={`h-full bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(25,38,82,0.1)] hover:border-brand-100/50 flex flex-col overflow-hidden relative isolate ${isFirst ? "shadow-[0_20px_40px_-15px_rgba(25,38,82,0.1)] border-brand-100/50" : ""}`}
                  >
                    {/* Active State Accents */}
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 to-brand-400 transform transition-transform duration-500 origin-left z-20 ${isFirst ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                    ></div>

                    <div
                      className={`absolute -right-12 -top-12 w-40 h-40 bg-brand-50/50 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none -z-10 ${isFirst ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    ></div>

                    {/* Header: Icon & Index */}
                    <div className="flex justify-between items-start mb-8">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-600/20 ${isFirst ? "scale-110 bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "bg-gray-50 text-brand-600"}`}
                      >
                        <i className={`fa-solid fa-${service.icon}`}></i>
                      </div>
                      <span
                        className={`text-6xl font-black select-none transition-colors duration-500 group-hover:text-brand-50/60 font-sans tracking-tighter ${isFirst ? "text-brand-50/60" : "text-gray-100"}`}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <h3
                        className={`text-2xl font-bold mb-4 group-hover:text-brand-800 transition-colors ${isFirst ? "text-brand-800" : "text-gray-900"}`}
                      >
                        {service.title}
                      </h3>

                      <p className="text-black leading-relaxed mb-8 flex-grow">
                        {service.shortDescription}
                      </p>

                      {/* Footer Action */}
                      <div
                        className={`mt-auto pt-6 border-t transition-colors flex items-center justify-between ${isFirst ? "border-gray-100" : "border-gray-50 group-hover:border-gray-100"}`}
                      >
                        <span
                          className={`text-sm font-bold uppercase tracking-widest group-hover:text-brand-600 transition-colors ${isFirst ? "text-brand-600" : "text-black"}`}
                        >
                          {content.view_details}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${isFirst ? `bg-brand-600 text-white ${dir === "rtl" ? "-translate-x-1" : "translate-x-1"}` : "bg-gray-50 text-brand-600"}`}
                        >
                          <i
                            className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"}`}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
