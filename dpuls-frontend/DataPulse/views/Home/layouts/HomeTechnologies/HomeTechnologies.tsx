import React, {useEffect, useRef, useMemo} from "react";
import {Section} from "../../../../components/UI";
import {useLanguage} from "../../../../components/LanguageContext";
import {Reveal} from "../../../../components/Reveal";

interface HomeTechnologiesProps {
  content: {
    technologies: {
      badge: string;
      title: string;
      subtitle: string;
      cards: Array<{
        id: string;
        title: string;
        icon: string;
        description: string;
        tags: string[];
      }>;
    };
  };
}

export default function HomeTechnologies({content}: HomeTechnologiesProps) {
  const {t, dir, language} = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const displayContent = content.technologies;
  const techCategories = displayContent.cards;

  // Parallax Logic
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !parallaxRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const winHeight = window.innerHeight;
      if (rect.top <= winHeight && rect.bottom >= 0) {
        const speed = 0.15;
        const offset = (winHeight - rect.top) * speed;
        parallaxRef.current.style.transform = `translate3d(0, ${-offset}px, 0)`;
      }
    };
    window.addEventListener("scroll", handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate Wavy Paths
  const waves = useMemo(() => {
    const generateWavePath = (
      radius: number,
      waves: number,
      amplitude: number,
    ) => {
      let d = "";
      const points = 360;
      const center = 500;
      for (let i = 0; i <= points; i++) {
        const angle = (i * Math.PI) / 180;
        const r = radius + amplitude * Math.sin(waves * angle);
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        d += (i === 0 ? "M" : "L") + `${x.toFixed(1)},${y.toFixed(1)}`;
      }
      return d + "Z";
    };

    return [
      {
        d: generateWavePath(350, 5, 20),
        color: "stroke-brand-200",
        width: 2,
        duration: "40s",
        direction: "normal",
      },
      {
        d: generateWavePath(280, 7, 25),
        color: "stroke-brand-100",
        width: 1.5,
        duration: "50s",
        direction: "reverse",
      },
      {
        d: generateWavePath(200, 4, 15),
        color: "stroke-brand-200",
        width: 1,
        duration: "60s",
        direction: "normal",
      },
      {
        d: generateWavePath(420, 3, 10),
        color: "stroke-brand-50",
        width: 3,
        duration: "80s",
        direction: "reverse",
      },
    ];
  }, []);

  return (
    <Section className="relative overflow-hidden py-24 lg:py-32 bg-white">
      <div ref={sectionRef} className="absolute inset-0 pointer-events-none" />

      <div
        ref={parallaxRef}
        className={`absolute z-0 pointer-events-none w-[1000px] h-[1000px] transition-transform duration-100 will-change-transform ease-linear
          ${dir === "rtl" ? "left-[-300px] bottom-[-200px]" : "right-[-300px] bottom-[-200px]"}`}
      >
        <svg
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-60"
        >
          {waves.map((wave, i) => (
            <path
              key={i}
              d={wave.d}
              className={`${wave.color} origin-center animate-spin`}
              strokeWidth={wave.width}
              style={{
                animationDuration: wave.duration,
                animationDirection: wave.direction,
              }}
            />
          ))}
          <circle
            cx="500"
            cy="500"
            r="150"
            className="fill-brand-50/50 blur-[80px]"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-16 gap-6 border-b border-brand-900/5 pb-8">
            <div className="max-w-2xl w-full">
              <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-2 block">
                {displayContent.badge}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-brand-900 tracking-tight">
                {displayContent.title}
              </h2>
            </div>
            <p className="max-w-md text-black text-lg leading-relaxed md:text-end rtl:md:text-start">
              {displayContent.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((cat, index) => {
            const isFirst = index === 0;
            return (
              <Reveal key={cat.id} delay={index * 100}>
                <div
                  className={`group relative bg-white h-full p-8 rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 ${
                    isFirst
                      ? "shadow-2xl shadow-gray-200/50 border-brand-100/50 -translate-y-1"
                      : "border-gray-100"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent transition-opacity duration-500 rounded-2xl ${
                      isFirst
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center text-2xl transition-colors duration-300 shadow-sm ${
                        isFirst
                          ? "bg-brand-800 text-white shadow-brand-800/20"
                          : "bg-gray-50 text-brand-800 group-hover:bg-brand-800 group-hover:text-white group-hover:shadow-brand-800/20"
                      }`}
                    >
                      <i className={cat.icon}></i>
                    </div>

                    <h3
                      className={`text-xl font-bold mb-3 transition-colors ${
                        isFirst
                          ? "text-brand-700"
                          : "text-gray-900 group-hover:text-brand-700"
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p className="text-black text-sm leading-relaxed mb-6 min-h-[40px]">
                      {cat.description}
                    </p>

                    <div
                      className={`h-px w-full mb-6 transition-colors ${
                        isFirst
                          ? "bg-brand-100"
                          : "bg-gray-100 group-hover:bg-brand-100"
                      }`}
                    ></div>

                    <div className="flex flex-wrap gap-2">
                      {cat.tags.map((tech) => (
                        <span
                          key={tech}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                            isFirst
                              ? "bg-white text-brand-600 border-brand-100 shadow-sm"
                              : "text-black bg-gray-50 border-gray-200/60 group-hover:bg-white group-hover:text-brand-600 group-hover:border-brand-100 group-hover:shadow-sm"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
