import React, {useEffect, useMemo} from "react";
import Head from "next/head";
import {useParams, Navigate} from "@/components/RouterShim";
import {useLanguage} from "../../components/LanguageContext";

// Import Shared Content
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";
import servicesAllEn from "../../static-content/Services/All/en.json";
import servicesAllAr from "../../static-content/Services/All/ar.json";

// Import All Projects (Source of Truth)
import portfolioAllEn from "../../static-content/Portfolio/All/en.json";
import portfolioAllAr from "../../static-content/Portfolio/All/ar.json";

// Import Layouts
import WebsiteProjectLayout from "./portfolio-layouts/WebsiteProjectLayout/WebsiteProjectLayout";
import MobileProjectLayout from "./portfolio-layouts/MobileProjectLayout/MobileProjectLayout";
import AIProjectLayout from "./portfolio-layouts/AIProjectLayout/AIProjectLayout";
import MarketingProjectLayout from "./portfolio-layouts/MarketingProjectLayout/MarketingProjectLayout";

// Import Specific Project Content

import rawadGateEn from "../../static-content/Portfolio/Details/rawad-gate/en.json";
import rawadGateAr from "../../static-content/Portfolio/Details/rawad-gate/ar.json";
import motaqaedEn from "../../static-content/Portfolio/Details/motaqaed/en.json";
import motaqaedAr from "../../static-content/Portfolio/Details/motaqaed/ar.json";
import goldStationEn from "../../static-content/Portfolio/Details/gold-station/en.json";
import goldStationAr from "../../static-content/Portfolio/Details/gold-station/ar.json";
import prometerEn from "../../static-content/Portfolio/Details/prometer/en.json";
import prometerAr from "../../static-content/Portfolio/Details/prometer/ar.json";
import humanexEn from "../../static-content/Portfolio/Details/humanex/en.json";
import humanexAr from "../../static-content/Portfolio/Details/humanex/ar.json";
import tatabqEn from "../../static-content/Portfolio/Details/tatabq/en.json";
import tatabqAr from "../../static-content/Portfolio/Details/tatabq/ar.json";
import dreamFitnessEn from "../../static-content/Portfolio/Details/dream-fitness/en.json";
import dreamFitnessAr from "../../static-content/Portfolio/Details/dream-fitness/ar.json";
import goldStationAppEn from "../../static-content/Portfolio/Details/gold-station-app/en.json";
import goldStationAppAr from "../../static-content/Portfolio/Details/gold-station-app/ar.json";

export default function PortfolioDetail({slug: externalSlug}: {slug?: string}) {
  const {slug: routerSlug} = useParams<{slug: string}>();
  const id = externalSlug || routerSlug;
  const {language} = useLanguage();

  const activeLanguage = language;
  const portfolioList =
    activeLanguage === "ar" ? portfolioAllAr.projects : portfolioAllEn.projects;
  const sharedContent = activeLanguage === "ar" ? homeAr : homeEn;
  const allServices =
    activeLanguage === "ar" ? servicesAllAr.services : servicesAllEn.services;

  // Find project by SLUG
  const projectSummary = portfolioList.find((p) => p.slug === id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Content Loading Map
  const specificContentMap: Record<string, any> = {
    "rawad-gate": activeLanguage === "ar" ? rawadGateAr : rawadGateEn,
    motaqaed: activeLanguage === "ar" ? motaqaedAr : motaqaedEn,
    "gold-station": activeLanguage === "ar" ? goldStationAr : goldStationEn,
    prometer: activeLanguage === "ar" ? prometerAr : prometerEn,
    humanex: activeLanguage === "ar" ? humanexAr : humanexEn,
    tatabq: activeLanguage === "ar" ? tatabqAr : tatabqEn,
    "dream-fitness": activeLanguage === "ar" ? dreamFitnessAr : dreamFitnessEn,
    "gold-station-app":
      activeLanguage === "ar" ? goldStationAppAr : goldStationAppEn,
  };

  const projectContent = specificContentMap[id as string] || {};
  const project = projectContent.project;

  if (!projectSummary || !project) {
    return <Navigate to="/portfolio" replace />;
  }

  // Layout selection based on categoryId from the summary
  const layout = () => {
    switch (projectSummary.categoryId) {
      case "web":
      case "cloud":
      case "software":
        return (
          <WebsiteProjectLayout
            project={project}
            projectContent={projectContent}
            content={sharedContent}
            allServices={allServices}
          />
        );
      case "mobile":
        return (
          <MobileProjectLayout
            project={project}
            projectContent={projectContent}
            content={sharedContent}
            allServices={allServices}
          />
        );
      case "ai":
        return (
          <AIProjectLayout
            project={project}
            projectContent={projectContent}
            content={sharedContent}
            allServices={allServices}
          />
        );
      case "marketing":
        return (
          <MarketingProjectLayout
            project={project}
            projectContent={projectContent}
            content={sharedContent}
            allServices={allServices}
          />
        );
      default:
        return (
          <WebsiteProjectLayout
            project={project}
            projectContent={projectContent}
            content={sharedContent}
            allServices={allServices}
          />
        );
    }
  };

  return (
    <>
      <Head>
        <title>{projectContent.seo?.title || project.title}</title>
        <meta
          name="description"
          content={projectContent.seo?.description || project.shortDesc}
        />
        <meta name="keywords" content={projectContent.seo?.keywords || ""} />
        <meta
          property="og:title"
          content={projectContent.seo?.title || project.title}
        />
        <meta
          property="og:description"
          content={projectContent.seo?.description || project.shortDesc}
        />
      </Head>
      {layout()}
    </>
  );
}
