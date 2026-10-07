import React, {useMemo, useState, useEffect} from "react";
import Head from "next/head";
import {useLanguage} from "../../components/LanguageContext";
import CTA from "./../Home/layouts/HomeCTA/HomeCTA";
import Technologies from "./../Home/layouts/HomeTechnologies/HomeTechnologies";
import Contact from "./../Home/layouts/HomeContact/HomeContact";
import Clients from "./../Home/layouts/HomeClients/HomeClients";
import enContent from "../../static-content/AboutUs/en.json";
import arContent from "../../static-content/AboutUs/ar.json";
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";
import AboutHero from "./layouts/AboutHero";
import AboutOverview from "./layouts/AboutOverview";
import AboutMissionVision from "./layouts/AboutMissionVision";
import AboutValues from "./layouts/AboutValues";
import { API_BASE_URL } from "../../config/api";

export default function About() {
  const {language} = useLanguage();

  const staticContent = useMemo(() => {
    return language === "ar" ? arContent : enContent;
  }, [language]);

  const [apiContent, setApiContent] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/about`, {
      headers: {
        "Accept-Language": language,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json && json.success && json.data) {
          setApiContent(json.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching about content from backend:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [language]);

  const content = apiContent || staticContent;

  const homeData = useMemo(() => {
    return language === "ar" ? homeAr : homeEn;
  }, [language]);

  return (
    <div className="overflow-hidden bg-white">
      <Head>
        <title>{content.seo?.title}</title>
        <meta name="description" content={content.seo?.description} />
        <meta name="keywords" content={content.seo?.keywords} />
        <meta property="og:title" content={content.seo?.title} />
        <meta property="og:description" content={content.seo?.description} />
      </Head>
      <style>{`
        @keyframes text-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-text-shine {
          background-size: 200% auto;
          animation: text-shine 5s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
        .clip-path-modular {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
        }
        @keyframes pulse-breath {
          0%, 100% { opacity: 0.01; transform: scale(1); letter-spacing: -0.05em; }
          50% { opacity: 0.04; transform: scale(1.02); letter-spacing: -0.02em; }
        }
        .animate-pulse-glyph {
          animation: pulse-breath 15s ease-in-out infinite;
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan-line 6s linear infinite;
        }
        @keyframes scan-radar {
          0% { transform: rotate(0deg); opacity: 0; }
          50% { opacity: 0.15; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        .animate-radar {
          animation: scan-radar 8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-glyph, .animate-scan, .animate-radar {
            animation: none;
            opacity: 0.03;
          }
        }
      `}</style>

      {/* Hero Section */}
      <AboutHero content={content.hero} />

      {/* Overview Section */}
      <AboutOverview content={content.overview} />

      {/* Mission & Vision Section */}
      <AboutMissionVision content={content.mission_vision} />

      {/* Values Section */}
      <AboutValues content={content.values} />
      <CTA content={homeData.ctaSection} />
      {/* Shared Sections */}
      <Technologies content={homeData.technologySection} />
      <Contact content={homeData.contactSection} />
      <Clients content={homeData.clientsSection} />
    </div>
  );
}
