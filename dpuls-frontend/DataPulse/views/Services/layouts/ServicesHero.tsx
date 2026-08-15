import React, {useEffect, useRef} from "react";
import {useLanguage} from "../../../components/LanguageContext";

interface ServicesHeroProps {
  content: {
    badge: string;
    title_line1: string;
    title_line2: string;
    scroll_label: string;
  };
  subtitle: string;
}

export default function ServicesHero({content, subtitle}: ServicesHeroProps) {
  const {t} = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {alpha: true});
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let time = 0;

    const GRID_SIZE = 16;
    const TILE_WIDTH = 50;
    const TILE_HEIGHT = 25;
    const WAVE_SPEED = 0.007;
    const WAVE_AMPLITUDE = 60;

    const COLOR_STROKE = "rgba(67, 97, 238, 0.3)";
    const COLOR_FILL_LOW = "rgba(25, 38, 82, 0.2)";
    const COLOR_FILL_HIGH = "rgba(67, 97, 238, 0.4)";
    const COLOR_HIGHLIGHT = "rgba(255, 255, 255, 0.8)";

    const project = (x: number, y: number, z: number) => {
      const isoX = (x - y) * TILE_WIDTH;
      const isoY = (x + y) * TILE_HEIGHT - z;
      return {
        x: isoX + width / 2,
        y: isoY + height / 3,
      };
    };

    const drawTile = (x: number, y: number, z: number, intensity: number) => {
      const top = project(x, y, z);
      const right = project(x + 1, y, z);
      const bottom = project(x + 1, y + 1, z);
      const left = project(x, y + 1, z);

      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(right.x, right.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.lineTo(left.x, left.y);
      ctx.closePath();

      ctx.strokeStyle = COLOR_STROKE;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = intensity > 0.7 ? COLOR_FILL_HIGH : COLOR_FILL_LOW;
      ctx.fill();

      if (intensity > 0.85) {
        ctx.fillStyle = COLOR_HIGHLIGHT;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(67, 97, 238, 0.6)";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    const init = () => {
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      time += WAVE_SPEED;

      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const dx = x - GRID_SIZE / 2;
          const dy = y - GRID_SIZE / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const wave1 = Math.sin(dist * 0.4 - time * 2);
          const wave2 = Math.cos(x * 0.3 + time);
          const combinedWave = (wave1 + wave2) / 2;
          const intensity = (combinedWave + 1) / 2;
          const z = combinedWave * WAVE_AMPLITUDE;
          drawTile(x, y, z, intensity);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => init());
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    init();
    animate();
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes text-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-text-shine {
          background-size: 200% auto;
          animation: text-shine 5s linear infinite;
        }
      `}</style>

      <section className="relative h-screen min-h-[800px] flex items-center justify-center bg-[#020617] text-white overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)] z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#020408] via-[#020617]/50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>

        <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center">
          <div
            className="mb-10 animate-reveal-up opacity-0"
            style={{animationDelay: "0.2s", animationFillMode: "forwards"}}
          >
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-brand-500/20 bg-brand-950/40 backdrop-blur-md shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-xs  font-bold uppercase tracking-[0.25em] text-brand-100">
                {content.badge}
              </span>
            </div>
          </div>

          <h1
            className="max-w-5xl text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8 animate-reveal-up opacity-0 drop-shadow-2xl"
            style={{animationDelay: "0.4s", animationFillMode: "forwards"}}
          >
            <span className="block text-white">{content.title_line1}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-brand-300 animate-text-shine pb-2">
              {content.title_line2}
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-white font-light leading-relaxed max-w-2xl mx-auto mb-12 animate-reveal-up opacity-0 mix-blend-screen"
            style={{animationDelay: "0.6s", animationFillMode: "forwards"}}
          >
            {subtitle}
          </p>
        </div>

        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 animate-fade-in z-20"
          style={{animationDelay: "1.5s", animationFillMode: "forwards"}}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">
            {content.scroll_label}
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-100 to-transparent"></div>
        </div>
      </section>
    </>
  );
}
