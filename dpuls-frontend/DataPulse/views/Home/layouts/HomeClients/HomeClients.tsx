import React, {useRef, useEffect} from "react";
import {Section} from "./../../../../components/UI";
import {useLanguage} from "./../../../../components/LanguageContext";
import {Reveal} from "./../../../../components/Reveal";

interface HomeClientsProps {
  content: {
    clients: {
      badge: string;
      title: string;
      subtitle: string;
      companyLogos: Array<{
        name: string;
        logo: string;
      }>;
    };
  };
}

export default function HomeClients({content}: HomeClientsProps) {
  const {t, dir, language} = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayContent = content.clients;
  const clients = displayContent.companyLogos;
  const scrollList = Array(12).fill(clients).flat();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Set dimensions to match container
    const updateDimensions = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    updateDimensions();

    // Grid configuration
    const dotSpacing = 40; // Distance between dots
    const dotSize = 1.5;
    const waveSpeed = 0.015;
    let time = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        time += waveSpeed;
      }

      // Calculate grid dimensions
      const cols = Math.ceil(canvas.width / dotSpacing) + 1;
      const rows = Math.ceil(canvas.height / dotSpacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * dotSpacing;
          const baseY = j * dotSpacing;

          // Create a 3D undulating wave effect using sine and cosine interaction
          // i * 0.3 creates variation along X-axis, j * 0.2 creates variation along Y-axis
          const noise = Math.sin(i * 0.25 + time) + Math.cos(j * 0.2 + time);
          const yOffset = noise * 8; // Amplitude of the wave

          const y = baseY + yOffset;

          // Dynamic Opacity:
          // 1. Calculate distance from center to fade edges slightly
          // 2. Use the 'noise' value to make dots shimmer slightly as they move
          const opacityBase = (noise + 2) * 0.1; // Range approx 0.1 to 0.3

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(67, 97, 238, ${Math.max(0.05, opacityBase)})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      updateDimensions();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <Section
      className="bg-white !py-20 !md:py:20 relative overflow-hidden"
      id="clients"
    >
      {/* Local Styles for Marquee Animation */}
      <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-scroll-rtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          .animate-marquee-infinite {
            animation: marquee-scroll 250s linear infinite;
            width: max-content;
            display: flex;
          }
          .animate-marquee-infinite-rtl {
            animation: marquee-scroll-rtl 250s linear infinite;
            width: max-content;
            display: flex;
          }
          .pause-on-hover:hover {
            animation-play-state: paused;
          }
        `}</style>

      {/* ANIMATED CANVAS BACKGROUND: 'Harmonic Data Grid' */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="container mx-auto px-2 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-gray-100 pb-6 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600"></span>
                </span>
                <span className="text-xs  font-bold text-brand-600 uppercase tracking-widest">
                  {displayContent.badge}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {displayContent.title}
              </h2>
            </div>

            <div className="md:text-right max-w-sm">
              <p className="text-md text-black font-medium leading-relaxed">
                {displayContent.subtitle}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="relative w-full overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none"></div>

            <div
              className={`pause-on-hover ${dir === "rtl" ? "animate-marquee-infinite-rtl" : "animate-marquee-infinite"}`}
            >
              {scrollList.map((client, index) => (
                <div key={`${client.name}-${index}`} className="mx-12 md:mx-16">
                  <div className="group relative flex items-center justify-center opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="h-12 md:h-16 w-auto object-contain max-w-[200px] pointer-events-none select-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
