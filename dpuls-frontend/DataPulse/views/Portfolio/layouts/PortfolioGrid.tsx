import React from "react";
import {Section} from "../../../components/UI";
import {Reveal} from "../../../components/Reveal";
import {Link} from "@/components/RouterShim";
import {PortfolioItem} from "../../PortfolioDetails/portfolio-layouts/data/portfolio";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  categoryId: string;
  coverImage: string;
  logo: string;
}

interface PortfolioGridProps {
  content: {
    badge: string;
    title: string;
    subtitle: string;
    categories: Record<string, string>;
    no_projects: string;
  };
  categories: Category[];
  filter: string;
  onFilterChange: (filter: string) => void;
  filteredProjects: Project[];
  dir: string;
}

export default function PortfolioGrid({
  content,
  categories,
  filter,
  onFilterChange,
  filteredProjects,
  dir,
}: PortfolioGridProps) {
  return (
    <Section className="py-24 bg-white relative isolate z-10">
      <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden">
        <svg
          viewBox="0 0 1440 1000"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id="blur-soft-portfolio"
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
            filter="url(#blur-soft-portfolio)"
            opacity="0.8"
          />
          <circle
            cx="1200"
            cy="800"
            r="600"
            fill="#f0f4ff"
            filter="url(#blur-soft-portfolio)"
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
            id="grid-pattern-portfolio"
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
            fill="url(#grid-pattern-portfolio)"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div className="flex flex-col items-start mb-8 lg:mb-12">
                  <div className="inline-flex items-center gap-3 mb-4 lg:mb-6">
                    <span className="w-2 h-2 bg-brand-600 rounded-sm"></span>
                    <span className="text-brand-900 text-xs lg:text-sm font-bold uppercase tracking-widest">
                      {content.badge}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-none mb-4 lg:mb-6">
                    {content.title}
                  </h2>
                  <p className="text-base lg:text-lg text-black font-light">
                    {content.subtitle}
                  </p>
                </div>

                {/* Categories Tab List */}
                <div
                  className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 space-x-4 lg:space-x-0 lg:space-y-1 scrollbar-hide border-b lg:border-b-0 lg:border-s-2 border-slate-100"
                  role="tablist"
                  aria-label="Portfolio Categories"
                >
                  {categories.map((cat) => {
                    const isActive = filter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => onFilterChange(cat.id)}
                        className={`
                          group flex items-center justify-between px-5 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all duration-300 relative lg:-ms-[2px] whitespace-nowrap lg:whitespace-normal lg:border-s-2 text-start rounded-full lg:rounded-none
                          ${
                            isActive
                              ? "bg-brand-600 text-white lg:bg-gray-50 lg:text-brand-900 lg:border-brand-600 shadow-md lg:shadow-none"
                              : "bg-transparent text-slate-400 hover:text-brand-600 lg:border-transparent lg:hover:border-slate-300 lg:hover:bg-gray-50/50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <i
                            className={`${cat.icon} text-base lg:text-lg w-5 lg:w-6 text-center transition-colors ${isActive ? "text-white lg:text-brand-600" : "text-slate-300 group-hover:text-brand-600"}`}
                          ></i>
                          <span>{cat.label}</span>
                        </div>
                        <i
                          className={`hidden lg:block fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
                        ></i>
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8" key={filter}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 lg:gap-y-16 lg:animate-in lg:fade-in lg:slide-in-from-bottom-4 lg:duration-700">
              {filteredProjects.map((project, idx) => {
                const category = categories.find(
                  (c) => c.id === project.categoryId,
                );
                return (
                  <Reveal key={project.id} delay={idx * 50}>
                    <Link
                      to={`/portfolio/${project.slug}`}
                      className="group block cursor-pointer h-full"
                    >
                      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] aspect-[4/3] mb-6 lg:mb-8 bg-gray-100 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-700 [isolation:isolate] [backface-visibility:hidden]">
                        <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors duration-500 z-10"></div>
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-105 will-change-transform"
                        />
                        <div
                          className={`absolute bottom-6 ${dir === "rtl" ? "left-6" : "right-6"} w-16 h-16 bg-white/90 backdrop-blur-md border border-white rounded-full flex items-center justify-center z-20 transition-all duration-500 ease-out shadow-xl overflow-hidden translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
                        >
                          <div className="absolute inset-0 bg-brand-600 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] translate-y-full group-hover:translate-y-0"></div>
                          <i
                            className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-lg lg:text-xl relative z-10 transition-colors duration-300 text-brand-900 group-hover:text-white`}
                          ></i>
                        </div>
                      </div>
                      <div className="flex justify-between items-start border-t border-slate-100 pt-5 lg:pt-6 transition-colors duration-500 group-hover:border-brand-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                            <span className="text-brand-600 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]">
                              {category?.label || project.categoryId}
                            </span>
                          </div>
                          <h3 className="text-xl lg:text-3xl font-bold text-slate-900 leading-tight group-hover:text-brand-700 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <span className="text-4xl lg:text-5xl font-light font-serif italic text-slate-100 group-hover:text-brand-100 transition-colors duration-500 select-none">
                          {project.id.padStart(2, "0")}
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
            {filteredProjects.length === 0 && (
              <Reveal>
                <div className="text-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                  <i className="fa-solid fa-folder-open text-4xl text-slate-200 mb-4"></i>
                  <p className="text-slate-400 font-light italic">
                    {content.no_projects}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
