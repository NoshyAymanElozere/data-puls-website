import React from "react";
import {Link} from "@/components/RouterShim";
import {SectionHeader, Button} from "../../../../components/UI";
import {useLanguage} from "../../../../components/LanguageContext";
import {Reveal} from "../../../../components/Reveal";

interface HomeAboutProps {
  content: {
    about: {
      title: string;
      highlight_part1: string;
      highlight_part2: string;
      highlight_part3: string;
      highlight_part4: string;
      desc: string;
      cta: string;
      headquarters: string;
      image: string;
      stats: {
        years: string;
        yearsNum: string;
        yearsDesc?: string;
        projects: string;
        projectsNum: string;
        projectsDesc?: string;
        clients: string;
        clientsNum: string;
        clientsDesc?: string;
        experts: string;
        expertsNum: string;
        expertsDesc?: string;
      };
      features?: Array<{
        title: string;
        desc: string;
        icon?: string;
      }>;
    };
  };
}

export default function HomeAbout({content: sectionData}: HomeAboutProps) {
  const {dir} = useLanguage();
  const content = sectionData.about;

  return (
    <section className="relative z-30 -mt-32 px-4 md:px-6 pb-20 pointer-events-none">
      <div className="container mx-auto pointer-events-auto">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-12 lg:p-20 border border-gray-100 relative overflow-hidden">
          {/* Wave decoration: LTR = spine on right, RTL = spine mirrored to left */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              className={`absolute inset-0 w-full h-full ${dir === "ltr" ? "scale-x-[-1]" : ""}`}
              preserveAspectRatio="none"
            >
              {/* Primary connected shape: bottom blob rises into right vertical wave */}
              <path
                fill="#4361ee"
                fillOpacity="0.12"
                d="M0,100 L0,76 C12,70 24,78 38,72 C52,66 64,71 74,76 C77,78 79,74 80,66 C82,52 86,36 82,22 C79,10 78,4 79,0 L100,0 L100,100 Z"
              />
              {/* Second layer for depth */}
              <path
                fill="#2b3ff0"
                fillOpacity="0.07"
                d="M0,100 L0,86 C18,83 36,89 55,86 C68,83 77,86 82,85 C84,84 87,78 88,65 C92,50 94,34 91,18 C89,8 88,3 88,0 L100,0 L100,100 Z"
              />
            </svg>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Text Content */}
            <div
              className={`order-2 lg:order-1 ${dir === "rtl" ? "lg:pl-8" : "lg:pr-8"}`}
            >
              <Reveal>
                <SectionHeader title={content.title} />

                <h3 className="text-5xl font-semibold text-brand-900 mb-6 leading-[5rem]">
                  {content.highlight_part1}{" "}
                  <span className="text-brand-600 font-bold">
                    {content.highlight_part2}
                  </span>{" "}
                  {content.highlight_part3}{" "}
                  <span className="text-brand-600 font-bold">
                    {content.highlight_part4}
                  </span>
                </h3>

                <p className="text-lg text-black mb-8 leading-relaxed">
                  {content.desc}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition-colors">
                    <div className="text-2xl font-bold text-brand-600 mb-1">
                      {content.stats.clientsNum}
                    </div>
                    <div className="text-sm text-black font-bold uppercase tracking-wider mb-1">
                      {content.stats.clients}
                    </div>
                    {content.stats.clientsDesc && (
                      <p className="text-[13px] text-black font-normal leading-relaxed">
                        {content.stats.clientsDesc}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition-colors">
                    <div className="text-2xl font-bold text-brand-600 mb-1">
                      {content.stats.expertsNum}
                    </div>
                    <div className="text-sm text-black font-bold uppercase tracking-wider mb-1">
                      {content.stats.experts}
                    </div>
                    {content.stats.expertsDesc && (
                      <p className="text-[13px] text-black font-normal leading-relaxed">
                        {content.stats.expertsDesc}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition-colors">
                    <div className="text-2xl font-bold text-brand-600 mb-1">
                      {content.stats.yearsNum}
                    </div>
                    <div className="text-sm text-black font-bold uppercase tracking-wider mb-1">
                      {content.stats.years}
                    </div>
                    {content.stats.yearsDesc && (
                      <p className="text-[13px] text-black font-normal leading-relaxed">
                        {content.stats.yearsDesc}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition-colors">
                    <div className="text-2xl font-bold text-brand-600 mb-1">
                      {content.stats.projectsNum}
                    </div>
                    <div className="text-sm text-black font-bold uppercase tracking-wider mb-1">
                      {content.stats.projects}
                    </div>
                    {content.stats.projectsDesc && (
                      <p className="text-[13px] text-black font-normal leading-relaxed">
                        {content.stats.projectsDesc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <Link to="/about">
                    <Button
                      variant="outline"
                      className="border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white transition-all"
                    >
                      {content.cta}
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Image / Visual Column with Features underneath */}
            <div className="flex flex-col order-1 lg:order-2 relative items-center justify-center gap-8">
              <Reveal delay={300} className="relative w-full max-w-lg">
                <div className="relative">
                  <img
                    src={content.image}
                    alt="Data Pulse Illustration"
                    className="w-full h-auto relative z-10 transform transition-transform duration-700"
                  />
                </div>
              </Reveal>

              {content.features && content.features.length > 0 && (
                <Reveal delay={400} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                    {content.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center sm:items-start sm:text-start gap-1.5 p-3 rounded-2xl bg-gray-50/60 border border-gray-100/60 hover:border-brand-200/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm shadow-2xs mb-0.5">
                          <i
                            className={`fa-solid ${
                              feat.icon === "target"
                                ? "fa-bullseye"
                                : feat.icon === "lightbulb"
                                  ? "fa-lightbulb"
                                  : "fa-shield-halved"
                            }`}
                          ></i>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {feat.title}
                        </h4>
                        <p className="text-[13px] text-black leading-relaxed font-light">
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
