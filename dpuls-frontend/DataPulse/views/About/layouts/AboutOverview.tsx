import React, {useEffect, useRef} from "react";
import {Reveal} from "../../../components/Reveal";
import {useLanguage} from "../../../components/LanguageContext";

interface OverviewProps {
  content: {
    label: string;
    title_line1: string;
    title_line2: string;
    title_accent: string;
    quote: string;
    text: string;
    stat1_value: string;
    stat1_label: string;
    stat2_value: string;
    stat2_label: string;
    stat3_value: string;
    stat3_label: string;
    marquee_text1: string;
    marquee_text2: string;
    pulse_glyph: string;
  };
}

export default function AboutOverview({content}: OverviewProps) {
  const {dir} = useLanguage();
  const overviewCanvasRef = useRef<HTMLCanvasElement>(null);

  // --------------------------------------------------------------------------
  // OVERVIEW VECTOR: "Kinetic Logic Grid" (PRESERVED)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = overviewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let time = 0;

    const init = () => {
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      const r = 25,
        g = 38,
        b = 82; // Brand-800
      const spacing = 60;

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(${r},${g},${b}, 0.05)`;

      // Draw subtle grid
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw "Logical Path"
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${r},${g},${b}, 0.1)`;
      let px = 0;
      let py = height * 0.5;
      ctx.moveTo(px, py);

      for (let i = 0; i < 20; i++) {
        const step = width / 15;
        const offset = Math.sin(time + i) * 80;
        px += step;
        ctx.lineTo(px, py + offset);
        ctx.strokeRect(px - 2, py + offset - 2, 4, 4);
      }
      ctx.stroke();

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
  }, [dir]);

  return (
    <section className="relative bg-white text-brand-800 py-24 lg:py-48 overflow-hidden">
      <canvas
        ref={overviewCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40"
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3 mb-12  text-xs uppercase tracking-widest text-black">
                <span className="w-8 h-px bg-brand-500"></span>
                {content.label}
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-[80px] font-bold tracking-tighter leading-[0.85] mb-16">
                {content.title_line1} <br />
                {content.title_line2}{" "}
                <span className="text-brand-500">{content.title_accent}</span>
              </h2>
              <div className="max-w-xl space-y-8">
                <p className="text-xl md:text-2xl text-black font-light leading-tight">
                  {content.quote}
                </p>
                <p className="text-lg text-black font-light leading-relaxed">
                  {content.text}
                </p>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end">
            <Reveal delay={200}>
              <div className="space-y-12">
                <div className="group border-t border-brand-800/10 pt-8 flex justify-between items-start transition-all">
                  <div>
                    <h3 className="text-4xl font-bold tracking-tight mb-2">
                      {content.stat1_value}
                    </h3>
                    <p className="text-xs  uppercase tracking-[0.2em] text-black">
                      {content.stat1_label}
                    </p>
                  </div>
                  <div className="w-10 h-10 border border-brand-800/10 rounded-full flex items-center justify-center group-hover:bg-brand-800 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-plus text-[10px]"></i>
                  </div>
                </div>
                <div className="group border-t border-brand-800/10 pt-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-4xl font-bold tracking-tight mb-2">
                      {content.stat2_value}
                    </h3>
                    <p className="text-xs  uppercase tracking-[0.2em] text-black">
                      {content.stat2_label}
                    </p>
                  </div>
                  <div className="w-10 h-10 border border-brand-800/10 rounded-full flex items-center justify-center group-hover:bg-brand-800 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-globe text-[10px]"></i>
                  </div>
                </div>
                <div className="group border-t border-brand-800/10 pt-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-4xl font-bold tracking-tight mb-2">
                      {content.stat3_value}
                    </h3>
                    <p className="text-xs  uppercase tracking-[0.2em] text-black">
                      {content.stat3_label}
                    </p>
                  </div>
                  <div className="w-10 h-10 border border-brand-800/10 rounded-full flex items-center justify-center group-hover:bg-brand-800 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-shield-check text-[10px]"></i>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-12 text-[450px] font-bold text-brand-700 leading-none select-none pointer-events-none tracking-tighter animate-pulse-glyph origin-bottom-right">
          {content.pulse_glyph}
        </div>
      </div>
      <div className="mt-32 border-y border-brand-800/10 py-5 bg-gray-50/50 backdrop-blur-sm relative z-10">
        <div className={`flex whitespace-nowrap gap-14 animate-marquee-slow`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="text-xl md:text-xl font-bold text-brand-700 opacity-[0.7] uppercase tracking-tighter">
                {content.marquee_text1}
              </span>
              <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
              <span className="text-xl md:text-xl font-light text-brand-700 opacity-[0.7] uppercase tracking-tighter">
                {content.marquee_text2}
              </span>
              <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
