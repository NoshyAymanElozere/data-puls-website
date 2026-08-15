import React from "react";
import {Section} from "./../../../../components/UI";
import {useLanguage} from "./../../../../components/LanguageContext";
import {Project} from "../../../../components/types";
import {Link} from "@/components/RouterShim";
import {Reveal} from "./../../../../components/Reveal";
// Import HomePortfolio section content from static-content
import enContent from "../../../../static-content/Home/Home-Projects/en.json";
import arContent from "../../../../static-content/Home/Home-Projects/ar.json";

// Define PortfolioProject type
interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  categoryId: string;
  coverImage: string;
  logo: string;
}

interface HomePortfolioProps {
  homeProjects: PortfolioProject[];
}

export default function HomePortfolio({homeProjects}: HomePortfolioProps) {
  const {t, dir, language} = useLanguage();

  const displayContent =
    language === "ar" ? arContent.portfolio : enContent.portfolio;

  // Map projects from props to internal Project interface
  const projects = homeProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.categoryId,
    image: project.coverImage,
    descKey: "desc",
    tags: [], // Tags can be added from project details if needed
  }));

  const leftColumnProjects = projects.filter((_, i) => i % 2 === 0);
  const rightColumnProjects = projects.filter((_, i) => i % 2 !== 0);

  const ProjectCard = ({
    project,
    isActive = false,
  }: {
    project: Project;
    isActive?: boolean;
  }) => (
    <div className="group relative block mb-20 w-full cursor-pointer">
      <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] md:aspect-[4/3] mb-8 bg-gray-900 border border-white/5 shadow-2xl [isolation:isolate] [backface-visibility:hidden] [transform:translate3d(0,0,0)]">
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 transition-opacity duration-500 z-10 ${isActive ? "opacity-40" : "opacity-60"}`}
        />
        <img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover transform transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "scale-110" : "scale-100 group-hover:scale-110"} will-change-transform`}
        />
        <div
          className={`absolute bottom-8 ${dir === "rtl" ? "left-8" : "right-8"} w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center z-20 transition-all duration-500 ease-out shadow-xl overflow-hidden ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"}`}
        >
          <div
            className={`absolute inset-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isActive ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"}`}
          ></div>
          <i
            className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-2xl relative z-10 transition-colors duration-300 ${isActive ? "text-brand-900" : "text-white group-hover:text-brand-900"}`}
          ></i>
        </div>
      </div>

      <div
        className={`flex justify-between items-end border-t pt-6 transition-colors duration-500 ${isActive ? "border-white/30" : "border-white/10 group-hover:border-white/30"}`}
      >
        <div>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">
              {project.category}
            </span>
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
            <div className="flex gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded border border-white/10 text-[10px] text-gray-400 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h3
            className={`text-3xl md:text-5xl font-bold font-sans tracking-tight leading-none transition-colors duration-300 ${isActive ? "text-brand-200" : "text-white group-hover:text-brand-200"}`}
          >
            {project.title}
          </h3>
        </div>
        <span
          className={`text-6xl font-light font-serif italic transition-colors duration-500 transform ${isActive ? "text-white/30 -translate-y-2" : "text-white/30 group-hover:text-white/30 group-hover:-translate-y-2"}`}
        >
          0{project.id}
        </span>
      </div>
    </div>
  );

  return (
    <Section className="bg-[#05080f] py-32 lg:py-48 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#05080f]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-900/40 blur-[150px] rounded-full mix-blend-screen"></div>

        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] opacity-40">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full animate-[spin_120s_linear_infinite]"
          >
            <circle
              cx="500"
              cy="500"
              r="480"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="20 20"
            />
            <circle
              cx="500"
              cy="500"
              r="380"
              fill="none"
              stroke="rgba(67, 97, 238, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="40 60"
              className="origin-center animate-[spin_60s_linear_infinite_reverse]"
            />
            <circle
              cx="500"
              cy="500"
              r="280"
              fill="none"
              stroke="rgba(110, 145, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="10 30"
              className="origin-center animate-[spin_80s_linear_infinite]"
            />
            <circle
              cx="500"
              cy="500"
              r="100"
              fill="none"
              stroke="rgba(67, 97, 238, 0.1)"
              strokeWidth="50"
              className="animate-pulse"
            />
          </svg>
        </div>

        <div className="absolute inset-0 w-full h-full">
          <div className="absolute left-[15%] top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50">
            <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-brand-400 to-transparent animate-[shimmer_5s_infinite]"></div>
          </div>
          <div className="absolute right-[15%] top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50">
            <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-transparent via-brand-400 to-transparent animate-[shimmer_7s_infinite_reverse]"></div>
          </div>
        </div>

        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row justify-between items-end mb-32 border-b border-white/5 pb-12">
            <div className="max-w-3xl w-full">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-brand-500"></span>
                <span className="text-brand-400 font-bold tracking-[0.2em] uppercase text-sm">
                  {displayContent.badge}
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                {displayContent.title_primary} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
                  {displayContent.title_secondary}
                </span>
              </h2>
            </div>
            <div className="mt-12 lg:mt-0 lg:max-w-sm flex flex-col">
              <p className="text-white text-lg leading-relaxed mb-8">
                {displayContent.subtitle}
              </p>
              <Link
                to="/portfolio"
                className="group flex items-center gap-4 text-white pb-2 hover:text-brand-300 transition-all"
              >
                <span className="font-bold tracking-widest uppercase text-sm border-b border-white/30 group-hover:border-brand-300 pb-1 transition-colors">
                  {displayContent.view_all}
                </span>
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-sm transform group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-300`}
                ></i>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-32">
          <div className="flex flex-col">
            {leftColumnProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 150}>
                <Link
                  to={`/portfolio/${project.slug}`}
                  className="block transform hover:scale-[1.02] transition-transform duration-700"
                >
                  <ProjectCard
                    project={project}
                    isActive={project.id === "1"}
                  />
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col lg:mt-48">
            {rightColumnProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 150 + 150}>
                <Link
                  to={`/portfolio/${project.slug}`}
                  className="block transform hover:scale-[1.02] transition-transform duration-700"
                >
                  <ProjectCard project={project} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
