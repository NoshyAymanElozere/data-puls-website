import React, {useEffect, useRef} from "react";
import {Link} from "@/components/RouterShim";

interface HeroProps {
  content: {
    badge: string;
    title_line1: string;
    title_line2: string;
    subtitle: string;
    scroll_label: string;
  };
}

export default function AboutHero({content}: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --------------------------------------------------------------------------
  // HERO ANIMATION: "The Blueprint Network" (PRESERVED)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {alpha: true});
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let points: Point[] = [];

    const SPHERE_RADIUS = 400;
    const POINT_COUNT = 300;
    const CONNECTION_DIST = 70;
    const ROTATION_SPEED = 0.0008;
    const PERSPECTIVE = 1000;

    const NODE_COLOR = "rgba(255, 255, 255, 0.4)";
    const LINE_COLOR = "rgba(67, 97, 238, 0.25)";
    const PULSE_COLOR = "rgba(110, 145, 255, 0.8)";

    class Point {
      x: number;
      y: number;
      z: number;
      px: number = 0;
      py: number = 0;
      scale: number = 0;
      pulse: number = 0;
      pulseSpeed: number = 0;

      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.pulse = Math.random();
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }
      rotateY(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.z * sin;
        const z = this.z * cos + this.x * sin;
        this.x = x;
        this.z = z;
      }
      rotateX(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const y = this.y * cos - this.z * sin;
        const z = this.z * cos + this.y * sin;
        this.y = y;
        this.z = z;
      }
      project(w: number, h: number) {
        this.scale = PERSPECTIVE / (PERSPECTIVE + this.z + SPHERE_RADIUS);
        this.px = w / 2 + this.x * this.scale;
        this.py = h / 2 + this.y * this.scale;
      }
      draw() {
        if (!ctx || this.z < -SPHERE_RADIUS * 0.5) return;
        this.pulse += this.pulseSpeed;
        const brightness = (Math.sin(this.pulse) + 1) / 2;
        const activeColor = brightness > 0.9 ? PULSE_COLOR : NODE_COLOR;
        const size = brightness > 0.9 ? 2.5 : 1.5;
        const s = size * this.scale;
        ctx.beginPath();
        ctx.fillStyle = activeColor;
        ctx.moveTo(this.px, this.py - s);
        ctx.lineTo(this.px + s, this.py);
        ctx.lineTo(this.px, this.py + s);
        ctx.lineTo(this.px - s, this.py);
        ctx.fill();
      }
    }

    const init = () => {
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      points = [];
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < POINT_COUNT; i++) {
        const y = 1 - (i / (POINT_COUNT - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const responsiveRadius = Math.min(width, height) * 0.4;
        points.push(
          new Point(
            x * responsiveRadius,
            y * responsiveRadius,
            z * responsiveRadius,
          ),
        );
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      points.forEach((p) => {
        p.rotateY(ROTATION_SPEED);
        p.rotateX(ROTATION_SPEED * 0.3);
        p.project(width, height);
      });
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        if (p1.z < -100) continue;
        let connections = 0;
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            connections++;
            const alpha = (1 - Math.sqrt(distSq) / CONNECTION_DIST) * p1.scale;
            ctx.beginPath();
            ctx.strokeStyle = LINE_COLOR.replace(
              "0.25",
              (alpha * 0.4).toString(),
            );
            const p1Bright = (Math.sin(p1.pulse) + 1) / 2 > 0.9;
            ctx.lineWidth = p1Bright ? 1 : 0.5;
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
            if (connections > 4) break;
          }
        }
        p1.draw();
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
    <section className="relative h-screen min-h-[800px] flex items-center justify-center bg-[#020617] text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020617_85%)] z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#020408] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center">
        <div
          className="mb-10 animate-reveal-up opacity-0"
          style={{animationDelay: "0.2s", animationFillMode: "forwards"}}
        >
          <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-brand-500/20 bg-brand-950/50 backdrop-blur-xl">
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
          className="max-w-5xl text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8 animate-reveal-up opacity-0"
          style={{animationDelay: "0.4s", animationFillMode: "forwards"}}
        >
          <span className="block text-white drop-shadow-xl pb-8">
            {content.title_line1}
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-brand-300 animate-text-shine pb-2 text-5xl md:text-5xl lg:text-7xl">
            {content.title_line2}
          </span>
        </h1>
        <p
          className="text-lg md:text-xl text-white font-light leading-relaxed max-w-2xl mx-auto mb-12 animate-reveal-up opacity-0"
          style={{animationDelay: "0.6s", animationFillMode: "forwards"}}
        >
          {content.subtitle}
        </p>
      </div>
      <Link
        to="/services"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 animate-fade-in z-20 cursor-pointer group"
        style={{animationDelay: "1.5s", animationFillMode: "forwards"}}
      >
        <span className="text-[11px] uppercase tracking-[0.25em] text-white font-bold group-hover:text-brand-300 transition-colors">
          {content.scroll_label}
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-100 to-transparent group-hover:from-brand-300 transition-colors"></div>
      </Link>
    </section>
  );
}
