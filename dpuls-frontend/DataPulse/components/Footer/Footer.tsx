import React from "react";
import {Link} from "@/components/RouterShim";
import {useLanguage} from "../LanguageContext";
import {Logo, LogoIcon, LogoText} from "../Branding";

interface FooterProps {
  content: {
    footer: {
      headline: {
        start: string;
        highlight: string;
        end: string;
        description: string;
        cta: string;
      };
      brand: {
        description: string;
        newsletterPlaceholder: string;
      };
      sections: Array<{
        title: string;
        links: Array<{label: string; href: string}>;
      }>;
      contact: {
        title: string;
        email: string;
        phone: string;
        address: string;
      };
      socials: Array<{icon: string; url: string}>;
      bottom: {
        copyright: string;
        rights: string;
        backToTop: string;
      };
    };
  };
}

export const Footer = ({content: propsContent}: FooterProps) => {
  const {dir, language} = useLanguage();
  const content = propsContent.footer;

  // Split links into two columns for the "Explore" section
  const exploreSection = content.sections[0]; // Assuming first section is Explore
  const exploreLinks = exploreSection?.links || [];
  const midPoint = Math.ceil(exploreLinks.length / 2);
  const col1Links = exploreLinks.slice(0, midPoint);
  const col2Links = exploreLinks.slice(midPoint);

  return (
    <footer className="relative bg-[#020408] text-white pt-20 pb-10 overflow-hidden isolate">
      {/* 
        CONCEPT: The Digital Monolith
        A solid, dark, structural aesthetic. No "fluff". 
        Uses deep brand colors and grid lines to feel like a control panel.
      */}

      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* Top Border Gradient - The 'Horizon' Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-70"></div>

        {/* Abstract Flowing Lines Animation - Premium & Subtle */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
        >
          <defs>
            <linearGradient
              id="flow-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#192652" stopOpacity="0" />
              <stop offset="50%" stopColor="#4361ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#192652" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Wave 1 - Primary Flow */}
          <path
            fill="none"
            stroke="url(#flow-gradient)"
            strokeWidth="1.5"
            d="M-200,300 C300,200 900,500 1640,300"
          >
            <animate
              attributeName="d"
              dur="25s"
              repeatCount="indefinite"
              values="
                     M-200,300 C300,200 900,500 1640,300;
                     M-200,300 C300,450 900,150 1640,300;
                     M-200,300 C300,200 900,500 1640,300"
            />
          </path>

          {/* Wave 2 - Accent Line (Darker Brand Color) */}
          <path
            fill="none"
            stroke="#192652"
            strokeWidth="1"
            opacity="0.6"
            d="M-200,400 C400,500 1000,300 1640,400"
          >
            <animate
              attributeName="d"
              dur="30s"
              repeatCount="indefinite"
              values="
                     M-200,400 C400,500 1000,300 1640,400;
                     M-200,400 C400,300 1000,500 1640,400;
                     M-200,400 C400,500 1000,300 1640,400"
            />
          </path>
        </svg>

        {/* Slow Pulsing Glow Center - Reduced intensity */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#192652] opacity-20 blur-[120px] rounded-full animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* --- PART 1: THE HEADLINE BLOCK --- */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {content.headline.start}{" "}
              <span className="text-brand-400">
                {content.headline.highlight}
              </span>{" "}
              {content.headline.end}
            </h2>
            <p className="mt-4 text-white text-lg leading-relaxed max-w-lg">
              {content.headline.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href={`https://wa.me/966551958719?text=${encodeURIComponent(
                language === "ar"
                  ? "مرحباً، أود البدء في مشروع جديد."
                  : "Hello, I would like to start a new project.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-[#020408] rounded-lg font-bold text-lg transition-transform duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">{content.headline.cta}</span>
              <i
                className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} relative z-10 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1`}
              ></i>
              {/* Button Hover Fill */}
              <div className="absolute inset-0 bg-brand-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-0"></div>
            </a>
          </div>
        </div>

        {/* --- PART 2: THE DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 border-t border-white/5 pt-16 mb-16">
          {/* BRAND MODULE (Col 1-4) */}
          <div className="md:col-span-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center mb-6 brightness-0 invert">
                <Logo className="w-40 h-auto" />
              </div>
              <p className="text-white text-sm leading-relaxed mb-8 max-w-xs">
                {content.brand.description}
              </p>
            </div>
          </div>

          {/* LINKS MODULE (Col 5-8) */}
          <div className="md:col-span-4">
            <span className="block text-xs font-bold uppercase tracking-widest text-brand-500 mb-6">
              {exploreSection?.title}
            </span>
            <div className="grid grid-cols-2 gap-4">
              {/* Column A */}
              <div className="flex flex-col gap-3">
                {col1Links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-white hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Column B */}
              <div className="flex flex-col gap-3">
                {col2Links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-white hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CONNECT MODULE (Col 9-12) */}
          <div className="md:col-span-4 flex flex-col items-start">
            <span className="block text-xs font-bold uppercase tracking-widest text-brand-500 mb-6">
              {content.contact.title}
            </span>

            <a
              href={`mailto:${content.contact.email}`}
              className="text-2xl font-light text-white hover:text-brand-400 transition-colors mb-2"
            >
              {content.contact.email}
            </a>
            <p className="text-white text-sm mb-8 ">
              {content.contact.phone} <br />
              {content.contact.address}
            </p>

            <div className="flex gap-3">
              {content.socials.map((social) => (
                <a
                  key={social.icon}
                  href={social.url}
                  className="w-10 h-10 rounded bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                  aria-label={social.icon}
                >
                  <i className={`fa-brands fa-${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- PART 3: THE FOOTER BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-white gap-4">
          <div className="flex items-center gap-4">
            <span>{content.bottom.copyright}</span>
            <span className="hidden md:inline text-gray-800">|</span>
            <span className="hover:text-white cursor-pointer transition-colors">
              {content.bottom.rights}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              {content.bottom.backToTop}
              <i className="fa-solid fa-arrow-up transform group-hover:-translate-y-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
