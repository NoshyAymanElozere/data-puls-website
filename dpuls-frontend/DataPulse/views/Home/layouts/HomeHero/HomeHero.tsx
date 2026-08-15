import React, {useEffect, useRef, useState} from "react";
import {useLanguage} from "../../../../components/LanguageContext";

// --------------------------------------------------------------------------
// HELPER: Animated Title Component
// --------------------------------------------------------------------------
const AnimatedTitle = ({
  text,
  baseDelay = 0,
  isRTL = false,
}: {
  text: string;
  baseDelay?: number;
  isRTL?: boolean;
}) => {
  if (isRTL) {
    const words = text.split(" ");
    return (
      <span
        aria-label={text}
        className="inline-flex flex-wrap justify-center gap-x-3"
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block animate-reveal-up opacity-0"
            style={{
              animationDelay: `${baseDelay + i * 0.15}s`,
              animationFillMode: "forwards",
            }}
          >
            {word}&nbsp;
          </span>
        ))}
      </span>
    );
  }

  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      aria-label={text}
      className="inline-flex flex-wrap justify-center gap-x-3"
    >
      {words.map((word, wIndex) => (
        <span key={wIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((char, cIndex) => {
            const delay = baseDelay + globalCharIndex * 0.04;
            globalCharIndex++;
            return (
              <span
                key={cIndex}
                className="inline-block animate-reveal-up opacity-0"
                style={{
                  animationDelay: `${delay}s`,
                  animationFillMode: "forwards",
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

interface HomeHeroProps {
  content: {
    hero: {
      badge: string;
      staticText: string;
      typingWords: string[];
      subheadline: string;
      cta_primary: string;
      cta_secondary: string;
      scroll: string;
      follow_us: string;
      social_links: Array<{
        name: string;
        icon: string;
        url: string;
      }>;
    };
  };
}

export default function HomeHero({content}: HomeHeroProps) {
  const {dir, language} = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  const displayContent = content.hero;
  // Ensure we have a default array to prevent crashes if JSON hasn't reloaded yet
  const socialIcons = displayContent.social_links || [];

  // --------------------------------------------------------------------------
  // TYPING EFFECT
  // --------------------------------------------------------------------------
  useEffect(() => {
    setDisplayedText("");
    setWordIndex(0);
    setIsDeleting(false);
    setStartTyping(false);

    const startTimeout = setTimeout(() => {
      setStartTyping(true);
    }, 1200);

    return () => clearTimeout(startTimeout);
  }, [language]);

  useEffect(() => {
    if (!startTyping) return;

    const currentWord = displayContent.typingWords[wordIndex];
    if (!currentWord) return;

    const typeSpeed = isDeleting ? 50 : 150;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const handleTyping = () => {
      if (isDeleting) {
        setDisplayedText((prev) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedText((prev) => currentWord.substring(0, prev.length + 1));
      }

      if (!isDeleting && displayedText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % displayContent.typingWords.length);
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deleteSpeed : typeSpeed,
    );
    return () => clearTimeout(timer);
  }, [
    displayedText,
    isDeleting,
    wordIndex,
    startTyping,
    displayContent.typingWords,
  ]);

  // --------------------------------------------------------------------------
  // CANVAS BACKGROUND: "ETHEREAL DATA WAVES"
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const lines = 25;
    const step = 15;
    const baseAmplitude = 30;
    const speed = 0.002;
    let time = 0;

    let gradient: CanvasGradient;

    const createGradient = () => {
      gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "rgba(25, 38, 82, 0)");
      gradient.addColorStop(0.2, "rgba(67, 97, 238, 0.3)");
      gradient.addColorStop(0.5, "rgba(110, 145, 255, 0.5)");
      gradient.addColorStop(0.8, "rgba(67, 97, 238, 0.3)");
      gradient.addColorStop(1, "rgba(25, 38, 82, 0)");
    };
    createGradient();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        time += speed;
      }

      ctx.lineWidth = 1.5;
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const yNorm = i / lines;
        const yBase = height * 0.2 + yNorm * height * 0.8;
        ctx.strokeStyle = gradient;
        const frequency = 0.001 + i * 0.0002;
        const lineTime = time * (1 + i * 0.1);

        for (let x = 0; x <= width; x += step) {
          const yOffset =
            Math.sin(x * frequency + lineTime) * baseAmplitude * (1 - yNorm) +
            Math.sin(x * frequency * 2.5 - lineTime) * (baseAmplitude * 0.5);

          const distFromCenter = Math.abs(x - width / 2) / (width / 2);
          const dampener = 1 - Math.pow(distFromCenter, 2);

          if (x === 0) ctx.moveTo(x, yBase + yOffset * dampener);
          else ctx.lineTo(x, yBase + yOffset * dampener);
        }
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createGradient();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: "smooth",
    });
  };

  const whatsappNumber = "966551958719";
  const primaryMsg =
    language === "ar"
      ? "مرحباً، أريد تحويل فكرتي إلى واقع"
      : "Hello, I would like to turn my idea into reality";
  const secondaryMsg =
    language === "ar"
      ? "مرحباً، أود الحصول على استشارة مجانية"
      : "Hello, I would like a free consultation";

  const primaryWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(primaryMsg)}`;
  const secondaryWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(secondaryMsg)}`;

  return (
    <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-brand-950">
        <canvas ref={canvasRef} className="absolute inset-0 top-[-20px]" />
      </div>

      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-reveal-up opacity-0 shadow-[0_0_20px_-5px_rgba(67,97,238,0.3)]"
          style={{animationDelay: "0.1s", animationFillMode: "forwards"}}
        >
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
          <span className="text-xs font-medium text-brand-100 uppercase tracking-widest">
            {displayContent.badge}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-8 leading-tight drop-shadow-2xl flex flex-col items-center z-10">
          <div className="mb-2">
            <AnimatedTitle
              text={displayContent.staticText}
              baseDelay={0.3}
              isRTL={dir === "rtl"}
            />
          </div>

          <div
            className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500 animate-reveal-up opacity-0 min-h-[1.2em] relative"
            style={{animationDelay: "1.2s", animationFillMode: "forwards"}}
          >
            <div className="absolute inset-0 blur-xl bg-brand-500/20 -z-10"></div>
            {displayedText}
            <span
              className={`animate-pulse text-brand-400 ${startTyping ? "opacity-100" : "opacity-0"}`}
            >
              |
            </span>
          </div>
        </h1>

        <p
          className="max-w-2xl mx-auto text-lg md:text-xl text-white mb-12 leading-relaxed font-light animate-reveal-up opacity-0 z-10"
          style={{animationDelay: "1.6s", animationFillMode: "forwards"}}
        >
          {displayContent.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 z-10">
          <a
            href={primaryWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-reveal-up opacity-0"
            style={{animationDelay: "1.9s", animationFillMode: "forwards"}}
          >
            <button className="px-8 py-4 bg-brand-600 text-white font-bold rounded-full hover:bg-brand-500 transition-all shadow-[0_0_40px_-10px_rgba(67,97,238,0.5)] hover:shadow-[0_0_60px_-10px_rgba(67,97,238,0.7)] hover:-translate-y-1 flex items-center gap-3 group">
              <i className="fa-brands fa-whatsapp text-2xl text-green-400 group-hover:scale-110 transition-transform"></i>
              <span>{displayContent.cta_primary}</span>
            </button>
          </a>
          <a
            href={secondaryWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-reveal-up opacity-0"
            style={{animationDelay: "2.1s", animationFillMode: "forwards"}}
          >
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm flex items-center gap-3 group">
              <i className="fa-solid fa-paper-plane text-2xl text-blue-400 group-hover:scale-110 transition-transform"></i>
              <span>{displayContent.cta_secondary}</span>
            </button>
          </a>
        </div>
      </div>

      <div
        className="absolute end-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8 z-20 animate-fade-in opacity-0"
        style={{animationDelay: "2.8s", animationFillMode: "forwards"}}
      >
        <div className="flex flex-col gap-5 p-3 rounded-full bg-brand-900/40 backdrop-blur-md border border-white/10 shadow-2xl ring-1 ring-white/5">
          {socialIcons.map((s) => (
            <a
              key={s.name}
              href={s.url}
              className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-brand-500 text-brand-200 hover:text-white transition-all duration-300"
              aria-label={s.name}
            >
              <i
                className={`${s.icon} text-lg transform group-hover:scale-110 transition-transform`}
              ></i>
              <span className="absolute end-full me-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap">
                {s.name}
              </span>
            </a>
          ))}
        </div>
        <div className="h-16 w-px bg-gradient-to-b from-brand-500/50 to-transparent"></div>
        <div
          style={{writingMode: "vertical-rl"}}
          className="text-[10px] font-bold tracking-[0.3em] text-brand-400/60 uppercase rotate-180"
        >
          {displayContent.follow_us}
        </div>
      </div>
    </section>
  );
}
