import React, {useEffect, useRef} from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {Link} from "@/components/RouterShim";
import {Reveal} from "../../../../components/Reveal";

interface HomeCTAProps {
  content: {
    cta: {
      badge: string;
      title: string;
      subtitle: string;
      button: string;
      security: string;
      support: string;
    };
  };
}

export default function HomeCTA({content}: HomeCTAProps) {
  const {t, dir, language} = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const displayContent = content.cta;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let particles: Particle[] = [];

    const PARTICLE_COLOR = "rgba(67, 97, 238, 0.5)";
    const LINE_COLOR = "67, 97, 238";
    const CONNECTION_DISTANCE = 150;
    const PARTICLE_SPEED = 0.3;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
        this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
      }
    }

    const init = () => {
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const area = width * height;
      const particleCount = Math.floor(area / 9000);

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.update();
        p.draw();
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${LINE_COLOR}, ${1 - distance / CONNECTION_DISTANCE})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => init());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    init();
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[600px] flex items-center bg-[#0b1021] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full opacity-80" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-900/40 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0b1021_85%)] z-10 pointer-events-none"></div>

      <div
        className="absolute inset-0 opacity-[0.09] z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-20">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 backdrop-blur-md mb-8 shadow-[0_0_25px_-5px_rgba(67,97,238,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
              </span>
              <span className="text-brand-100 text-[11px] font-bold uppercase tracking-[0.2em]">
                {displayContent.badge}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8 leading-[1.1] drop-shadow-2xl">
              {displayContent.title}
            </h2>

            <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed font-light max-w-2xl mx-auto">
              {displayContent.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href={`https://wa.me/966551958719?text=${encodeURIComponent(
                  language === "ar"
                    ? "مرحباً، أود البدء في مشروع جديد."
                    : "Hello, I would like to start a new project.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full sm:w-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-brand-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>

                <button className="relative w-full sm:w-auto px-10 py-5 bg-white text-brand-950 font-bold text-lg rounded-full flex items-center justify-center gap-4 transition-all duration-300 transform group-hover:-translate-y-0.5 shadow-xl hover:shadow-2xl">
                  {displayContent.button}
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <i
                      className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-xs`}
                    ></i>
                  </div>
                </button>
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-500 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-white font-medium">
              <span>{displayContent.security}</span>
              <span className="hidden md:block w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>{displayContent.support}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
