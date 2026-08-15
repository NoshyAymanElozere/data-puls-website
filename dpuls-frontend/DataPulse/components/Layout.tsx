import React, {useState, useEffect} from "react";
import {NavLink, Link, useLocation} from "@/components/RouterShim";
import {useLanguage} from "./LanguageContext";
import {NavLink as NavLinkType} from "./types";
import {AnimatedTextLink} from "./UI";
import {Logo, LogoIcon, LogoText} from "./Branding";

import servicesAllEn from "../static-content/Services/All/en.json";
import servicesAllAr from "../static-content/Services/All/ar.json";

export const Navbar = () => {
  const {t, language, setLanguage} = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<
    string | null
  >(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const location = useLocation();

  const servicesContent = language === "ar" ? servicesAllAr : servicesAllEn;
  const categories = (servicesContent.categories || []).map((cat: any) => {
    return {
      ...cat,
      icon:
        cat.id === "software"
          ? "fa-code"
          : cat.id === "ai"
            ? "fa-brain"
            : cat.id === "marketing"
              ? "fa-bullhorn"
              : "fa-cloud",
      services: (servicesContent.services || []).filter(
        (s: any) => s.categoryId === cat.id,
      ),
    };
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Reduced threshold to 20px for snappier response
          const isScrolled = window.scrollY > 20;
          if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, {passive: true});
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    setIsOpen(false);
    setDesktopDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks: NavLinkType[] = [
    {key: "about", path: "/about"},
    {key: "services", path: "/services"},
    {key: "portfolio", path: "/portfolio"},
    {key: "blog", path: "/blog"},
    {key: "contact", path: "/contact"},
  ];

  // Animation Constants
  const morphCurve = "ease-[cubic-bezier(0.16,1,0.3,1)]";
  const transitionDuration = "duration-400";

  // Dynamic Classes based on scroll state
  const containerClasses = scrolled
    ? `top-0 w-full rounded-none py-3 px-6 md:px-8 bg-white backdrop-blur-xl shadow-md border-b border-gray-100/50 transition-all ${transitionDuration}`
    : `top-7 w-[95%] max-w-7xl rounded-full py-4 px-8 bg-white backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 transition-all ${transitionDuration}`;

  return (
    <>
      <nav
        className={`fixed left-0 right-0 mx-auto z-50 transform-gpu transition-all ${transitionDuration} ${morphCurve} ${containerClasses}`}
      >
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Logo Section */}
          <Link to="/" className="flex items-center z-50 group">
            <div
              className={`transition-transform ${transitionDuration} ${morphCurve} scale-100 group-hover:scale-105`}
            >
              <LogoIcon className="w-10 h-auto md:w-11 md:h-auto" />
            </div>

            <div
              className={`flex items-center overflow-hidden transition-all ${transitionDuration} ${morphCurve} ${
                scrolled ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
              }`}
            >
              <div
                className={`flex items-center gap-3 ps-3 min-w-max transition-opacity ${transitionDuration} ${
                  scrolled ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="h-8 w-px bg-gray-300/60"></div>
                <LogoText className="h-8 w-auto" />
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <div
              className={`flex items-center gap-1 px-1 py-1 rounded-full transition-all ${transitionDuration} ${morphCurve}`}
            >
              {navLinks.map((link) => {
                if (link.key === "services") {
                  return (
                    <div
                      key={link.key}
                      className="relative"
                      onMouseEnter={() => setDesktopDropdownOpen(true)}
                      onMouseLeave={() => setDesktopDropdownOpen(false)}
                    >
                      <NavLink
                        to={link.path}
                        className={({isActive}: any) =>
                          `px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 relative inline-flex items-center gap-1.5 ${
                            isActive
                              ? "text-brand-700 bg-brand-50 shadow-sm font-bold"
                              : "text-black hover:text-brand-600 hover:bg-gray-100/50"
                          }`
                        }
                      >
                        <span>{t(`nav.${link.key}`)}</span>
                        <i
                          className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${
                            desktopDropdownOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </NavLink>

                      {/* Desktop Mega Dropdown */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[88vw] max-w-5xl transition-all duration-300 transform origin-top ${
                          desktopDropdownOpen
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 text-start">
                          <div className="grid grid-cols-4 gap-6">
                            {categories.map((cat: any) => (
                              <div key={cat.id} className="space-y-3">
                                <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                                    <i
                                      className={`fa-solid ${cat.icon} text-xs`}
                                    ></i>
                                  </div>
                                  <h4 className="font-bold text-slate-900 text-xs">
                                    {cat.label}
                                  </h4>
                                </div>
                                <ul className="space-y-1.5">
                                  {cat.services.map((s: any) => (
                                    <li key={s.id}>
                                      <Link
                                        to={`/services/${s.slug}`}
                                        onClick={() =>
                                          setDesktopDropdownOpen(false)
                                        }
                                        className="text-xs text-slate-600 hover:text-brand-600 hover:ps-1 font-medium transition-all block py-1"
                                      >
                                        {s.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">
                              {language === "ar"
                                ? "حلول رقمية متكاملة تسرّع نمو أعمالك"
                                : "Integrated digital solutions to accelerate your growth"}
                            </span>
                            <Link
                              to="/services"
                              onClick={() => setDesktopDropdownOpen(false)}
                              className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                            >
                              <span>
                                {language === "ar"
                                  ? "استكشف كافة الخدمات"
                                  : "Explore All Services"}
                              </span>
                              <i
                                className={`fa-solid ${
                                  language === "ar"
                                    ? "fa-arrow-left"
                                    : "fa-arrow-right"
                                }`}
                              ></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.key}
                    to={link.path}
                    className={({isActive}: any) =>
                      `px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 relative ${
                        isActive
                          ? "text-brand-700 bg-brand-50 shadow-sm font-bold"
                          : "text-black hover:text-brand-600 hover:bg-gray-100/50"
                      }`
                    }
                  >
                    {t(`nav.${link.key}`)}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold text-black hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
            >
              {language === "en" ? "AR" : "EN"}
            </button>
            <a
              href={`https://wa.me/966551958719?text=${encodeURIComponent(
                language === "ar"
                  ? "مرحباً، أود الاستفسار عن خدماتكم."
                  : "Hello, I would like to inquire about your services.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${transitionDuration} shadow-lg hover:-translate-y-0.5 active:translate-y-0 bg-brand-800 text-white hover:bg-brand-900 shadow-brand-800/20`}
              >
                {t("common.get_quote")}
              </button>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden z-50 text-gray-800 p-2 focus:outline-none relative"
            aria-label="Toggle Menu"
          >
            <i
              className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"} text-xl transition-all duration-300`}
            ></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-3xl z-50 overflow-y-auto pb-12 pt-24 px-5 flex flex-col items-center transition-all duration-500 md:hidden ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-gray-50/50 pointer-events-none"></div>

        {/* Mobile Header Bar Pinned */}
        <div className="fixed top-0 left-0 right-0 h-20 px-6 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between z-50 shadow-xs">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <LogoIcon className="w-9 h-auto" />
            <LogoText className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200/80 px-3 py-1.5 rounded-full"
            >
              {language === "en" ? "العربية" : "EN"}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-gray-100 text-slate-800 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close Menu"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md flex flex-col gap-3 text-start mt-2">
          {navLinks.map((link, idx) => {
            const isServices = link.key === "services";
            const iconMap: Record<string, string> = {
              about: "fa-building",
              services: "fa-layer-group",
              portfolio: "fa-briefcase",
              blog: "fa-newspaper",
              contact: "fa-paper-plane",
            };
            const icon = iconMap[link.key] || "fa-link";

            if (isServices) {
              return (
                <div
                  key={link.key}
                  className={`w-full rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 transform ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{transitionDelay: `${100 + idx * 40}ms`}}
                >
                  {/* Card Main Row */}
                  <div
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-brand-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-xs">
                        <i className={`fa-solid ${icon} text-base`}></i>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900">
                          {t(`nav.${link.key}`)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {language === "ar"
                            ? "استكشف تخصصاتنا وخدماتنا"
                            : "Explore our expertise & categories"}
                        </div>
                      </div>
                    </div>
                    <button
                      className="w-8 h-8 rounded-xl bg-gray-100 text-slate-700 flex items-center justify-center"
                      aria-label="Toggle Services"
                    >
                      <i
                        className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${
                          mobileServicesOpen ? "rotate-180 text-brand-600" : ""
                        }`}
                      ></i>
                    </button>
                  </div>

                  {/* Submenu Accordion */}
                  {mobileServicesOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-slate-50/60 space-y-3 animate-fade-in">
                      <Link
                        to="/services"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-3 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 hover:bg-brand-700 transition-colors"
                      >
                        <span>
                          {language === "ar"
                            ? "استكشف كافة الخدمات"
                            : "Explore All Services"}
                        </span>
                        <i
                          className={`fa-solid ${
                            language === "ar"
                              ? "fa-arrow-left"
                              : "fa-arrow-right"
                          }`}
                        ></i>
                      </Link>

                      {categories.map((cat: any) => {
                        const isCatExpanded = activeMobileCategory === cat.id;
                        return (
                          <div
                            key={cat.id}
                            className="rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-2xs"
                          >
                            <button
                              onClick={() =>
                                setActiveMobileCategory(
                                  isCatExpanded ? null : cat.id,
                                )
                              }
                              className="w-full px-4 py-3 flex items-center justify-between font-bold text-xs text-slate-800 hover:text-brand-600 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                                  <i
                                    className={`fa-solid ${cat.icon} text-xs`}
                                  ></i>
                                </div>
                                <span>{cat.label}</span>
                              </div>
                              <i
                                className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-300 ${
                                  isCatExpanded ? "rotate-180 text-brand-600" : ""
                                }`}
                              ></i>
                            </button>

                            {isCatExpanded && (
                              <div className="px-4 pb-3 pt-2 space-y-1.5 border-t border-gray-100 bg-gray-50/60">
                                {cat.services.map((s: any) => (
                                  <Link
                                    key={s.id}
                                    to={`/services/${s.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 text-xs text-slate-600 hover:text-brand-600 font-medium py-1.5 transition-all"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                                    <span>{s.title}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.key}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between hover:border-brand-200 transition-all duration-300 transform ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{transitionDelay: `${100 + idx * 40}ms`}}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <i className={`fa-solid ${icon} text-base`}></i>
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {t(`nav.${link.key}`)}
                  </span>
                </div>
                <i
                  className={`fa-solid ${
                    language === "ar" ? "fa-chevron-left" : "fa-chevron-right"
                  } text-xs text-gray-400`}
                ></i>
              </Link>
            );
          })}
        </div>

        {/* Mobile Action Footer */}
        <div
          className={`relative z-10 w-full max-w-md mt-6 pt-6 border-t border-gray-200/60 flex flex-col items-center gap-4 transition-all duration-500 delay-300 ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <a
            href={`https://wa.me/966551958719?text=${encodeURIComponent(
              language === "ar"
                ? "مرحباً، أود الاستفسار عن خدماتكم."
                : "Hello, I would like to inquire about your services.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl text-center text-base font-bold shadow-xl shadow-brand-600/25 flex items-center justify-center gap-3 group transition-transform active:scale-98"
          >
            <i className="fa-brands fa-whatsapp text-2xl text-green-400 group-hover:scale-110 transition-transform"></i>
            <span>{t("common.get_quote")}</span>
          </a>

          <div className="text-xs text-slate-500 font-medium text-center">
            {language === "ar"
              ? "تواصل معنا مباشرة عبر الواتساب للاستشارات السريعة"
              : "Contact us directly via WhatsApp for quick consultations"}
          </div>
        </div>
      </div>
    </>
  );
};

export {Footer} from "./Footer/Footer";
export {default as WhatsAppButton} from "./WhatsAppButton";
