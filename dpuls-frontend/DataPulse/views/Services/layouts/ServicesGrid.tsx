import React from "react";
import {Section} from "../../../components/UI";
import {Reveal} from "../../../components/Reveal";
import {Link} from "@/components/RouterShim";
import {useLanguage} from "../../../components/LanguageContext";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  categoryId: string;
  icon: string;
  coverImage: string;
}

interface ServicesGridProps {
  content: {
    badge: string;
    title: string;
    subtitle: string;
    subtitle_extra: string;
  };
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  filteredServices: Service[];
  isAnimating: boolean;
}

export default function ServicesGrid({
  content,
  categories,
  activeCategory,
  onCategoryChange,
  filteredServices,
  isAnimating,
}: ServicesGridProps) {
  const {t, dir} = useLanguage();

  return (
    <Section className="bg-white py-24 relative isolate">
      {/* Background Vector */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden">
        <svg
          viewBox="0 0 1440 1000"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id="blur-soft-service"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="20" result="blur" />
            </filter>
          </defs>

          <path d="M0 0 H1440 V1000 H0 Z" fill="white" />
          <circle
            cx="200"
            cy="200"
            r="500"
            fill="#f0f4ff"
            filter="url(#blur-soft-service)"
            opacity="0.8"
          />
          <circle
            cx="1200"
            cy="800"
            r="600"
            fill="#f0f4ff"
            filter="url(#blur-soft-service)"
            opacity="0.8"
          />

          <g
            className="origin-center animate-[spin_60s_linear_infinite]"
            style={{transformOrigin: "20% 40%"}}
          >
            <rect
              x="100"
              y="200"
              width="300"
              height="300"
              rx="40"
              fill="none"
              stroke="#e0eaff"
              strokeWidth="40"
              opacity="0.6"
            />
            <rect
              x="150"
              y="250"
              width="200"
              height="200"
              rx="30"
              fill="none"
              stroke="#e0eaff"
              strokeWidth="20"
              opacity="0.8"
            />
          </g>

          <path
            d="M1200 100 L1400 500 L1000 500 Z"
            fill="none"
            stroke="#c7d9ff"
            strokeWidth="2"
            opacity="0.3"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,50; 0,0"
              dur="10s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 1200 300; 10 1200 300; 0 1200 300"
              dur="15s"
              repeatCount="indefinite"
              additive="sum"
            />
          </path>

          <path
            d="M-100 800 C 400 600, 800 1100, 1540 800"
            fill="none"
            stroke="#dbeafe"
            strokeWidth="80"
            strokeLinecap="round"
            opacity="0.4"
            className="animate-pulse"
            style={{animationDuration: "8s"}}
          />
          <path
            d="M-100 850 C 400 650, 800 1150, 1540 850"
            fill="none"
            stroke="#eff6ff"
            strokeWidth="40"
            strokeLinecap="round"
            opacity="0.6"
          />

          <pattern
            id="grid-pattern-service"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="2" fill="#e0eaff" />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#grid-pattern-service)"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* LEFT COLUMN: Header & Sticky Tabs */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <Reveal>
                {/* Header */}
                <div className="flex flex-col items-start mb-12">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 bg-brand-600 rounded-sm"></span>
                    <span className="text-brand-900  text-sm font-bold uppercase tracking-widest">
                      {content.badge}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-none mb-6">
                    {content.title}
                  </h2>
                  <p className="text-lg text-black font-light">
                    {content.subtitle} {content.subtitle_extra}
                  </p>
                </div>

                {/* Vertical Category List */}
                <div
                  className="flex flex-col space-y-2 border-s-2 border-gray-100"
                  role="tablist"
                  aria-label="Services Navigation"
                >
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="services-grid"
                        onClick={() => onCategoryChange(cat.id)}
                        className={`
                                group flex items-center justify-between px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative -ms-[2px] border-s-2 text-start
                                ${
                                  isActive
                                    ? "border-brand-600 text-brand-900 bg-gray-50"
                                    : "border-transparent text-gray-900 hover:text-brand-600 hover:border-gray-300 hover:bg-gray-50/50"
                                }
                              `}
                      >
                        <div className="flex items-center gap-3">
                          <i
                            className={`${cat.icon} text-lg w-6 text-center transition-colors ${isActive ? "text-brand-600" : "text-gray-900 group-hover:text-brand-600"}`}
                          ></i>
                          <span>{cat.label}</span>
                        </div>
                        <i
                          className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
                        ></i>
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>

          {/* RIGHT COLUMN: Grid Content */}
          <div className="lg:col-span-8">
            <div
              id="services-grid"
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[600px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isAnimating ? "opacity-0 translate-y-8 blur-sm" : "opacity-100 translate-y-0 blur-0"}`}
              role="tabpanel"
            >
              {filteredServices.map((service, index) => {
                const isFirst = index === 0;
                return (
                  <Reveal
                    key={service.id}
                    delay={index * 50}
                    className="h-full"
                  >
                    <Link
                      to={`/services/${service.slug}`}
                      className="group relative block h-full"
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
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-600/20 ${isFirst ? "scale-110 bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "bg-gray-50 text-brand-600"}`}
                          >
                            <i className={`fa-solid fa-${service.icon}`}></i>
                          </div>
                          <span
                            className={`text-5xl font-black select-none transition-colors duration-500 group-hover:text-brand-50/60 font-sans tracking-tighter ${isFirst ? "text-brand-50/60" : "text-gray-100"}`}
                          >
                            0{index + 1}
                          </span>
                        </div>

                        {/* Body Content */}
                        <div className="relative z-10 flex flex-col h-full">
                          <h3
                            className={`text-xl font-bold mb-4 group-hover:text-brand-800 transition-colors ${isFirst ? "text-brand-800" : "text-gray-900"}`}
                          >
                            {service.title}
                          </h3>

                          <p className="text-black leading-relaxed mb-8 flex-grow text-sm">
                            {service.shortDescription}
                          </p>

                          {/* Footer Action */}
                          <div
                            className={`mt-auto pt-6 border-t transition-colors flex items-center justify-between ${isFirst ? "border-gray-100" : "border-gray-50 group-hover:border-gray-100"}`}
                          >
                            <span
                              className={`text-xs font-bold uppercase tracking-widest group-hover:text-brand-600 transition-colors ${isFirst ? "text-brand-600" : "text-black"}`}
                            >
                              {t("common.view_details")}
                            </span>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${isFirst ? `bg-brand-600 text-white ${dir === "rtl" ? "-translate-x-1" : "translate-x-1"}` : "bg-gray-50 text-brand-600"}`}
                            >
                              <i
                                className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-xs`}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
