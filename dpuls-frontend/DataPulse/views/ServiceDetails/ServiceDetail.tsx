import React, {useEffect} from "react";
import Head from "next/head";
import {useParams, Navigate} from "@/components/RouterShim";
import {getServiceDetails} from "./service-layouts/data/services"; // Keep getServiceDetails literal if needed by other layouts
import {useLanguage} from "../../components/LanguageContext";

// Import distinct layouts
import SoftwareLayout from "./service-layouts/SoftwareLayout/SoftwareLayout";
import AILayout from "./service-layouts/AILayout/AILayout";
import MarketingLayout from "./service-layouts/MarketingLayout/MarketingLayout";
import CloudLayout from "./service-layouts/CloudLayout/CloudLayout";

// Import Shared Content
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";

// Import Specific Service Content
import webDevEn from "../../static-content/Services/Details/web-development/en.json";
import webDevAr from "../../static-content/Services/Details/web-development/ar.json";
import mlEn from "../../static-content/Services/Details/machine-learning/en.json";
import mlAr from "../../static-content/Services/Details/machine-learning/ar.json";
import mobileDevEn from "../../static-content/Services/Details/mobile-development/en.json";
import mobileDevAr from "../../static-content/Services/Details/mobile-development/ar.json";
import saasEn from "../../static-content/Services/Details/saas-engineering/en.json";
import saasAr from "../../static-content/Services/Details/saas-engineering/ar.json";
import erpEn from "../../static-content/Services/Details/erp-solutions/en.json";
import erpAr from "../../static-content/Services/Details/erp-solutions/ar.json";
import apiIntegEn from "../../static-content/Services/Details/api-integration/en.json";
import apiIntegAr from "../../static-content/Services/Details/api-integration/ar.json";
import legacyModEn from "../../static-content/Services/Details/legacy-modernization/en.json";
import legacyModAr from "../../static-content/Services/Details/legacy-modernization/ar.json";
import processAutoEn from "../../static-content/Services/Details/process-automation/en.json";
import processAutoAr from "../../static-content/Services/Details/process-automation/ar.json";
import nlpEn from "../../static-content/Services/Details/natural-language-ai/en.json";
import nlpAr from "../../static-content/Services/Details/natural-language-ai/ar.json";
import visionEn from "../../static-content/Services/Details/computer-vision/en.json";
import visionAr from "../../static-content/Services/Details/computer-vision/ar.json";
import predictiveEn from "../../static-content/Services/Details/predictive-analytics/en.json";
import predictiveAr from "../../static-content/Services/Details/predictive-analytics/ar.json";
import genAiEn from "../../static-content/Services/Details/generative-ai/en.json";
import genAiAr from "../../static-content/Services/Details/generative-ai/ar.json";
import cloudInfraEn from "../../static-content/Services/Details/cloud-infrastructure/en.json";
import cloudInfraAr from "../../static-content/Services/Details/cloud-infrastructure/ar.json";
import seoEn from "../../static-content/Services/Details/seo-visibility/en.json";
import seoAr from "../../static-content/Services/Details/seo-visibility/ar.json";
import socialEn from "../../static-content/Services/Details/social-media/en.json";
import socialAr from "../../static-content/Services/Details/social-media/ar.json";
import performanceEn from "../../static-content/Services/Details/performance-marketing/en.json";
import performanceAr from "../../static-content/Services/Details/performance-marketing/ar.json";
import contentEn from "../../static-content/Services/Details/content-strategy/en.json";
import contentAr from "../../static-content/Services/Details/content-strategy/ar.json";
import emailEn from "../../static-content/Services/Details/email-automation/en.json";
import emailAr from "../../static-content/Services/Details/email-automation/ar.json";
import brandEn from "../../static-content/Services/Details/brand-identity/en.json";
import brandAr from "../../static-content/Services/Details/brand-identity/ar.json";
import hostingEn from "../../static-content/Services/Details/managed-hosting/en.json";
import hostingAr from "../../static-content/Services/Details/managed-hosting/ar.json";
import cybersecurityEn from "../../static-content/Services/Details/cybersecurity/en.json";
import cybersecurityAr from "../../static-content/Services/Details/cybersecurity/ar.json";
import devopsEn from "../../static-content/Services/Details/devops-engineering/en.json";
import devopsAr from "../../static-content/Services/Details/devops-engineering/ar.json";
import serverlessEn from "../../static-content/Services/Details/serverless-architecture/en.json";
import serverlessAr from "../../static-content/Services/Details/serverless-architecture/ar.json";
import recoveryEn from "../../static-content/Services/Details/disaster-recovery/en.json";
import recoveryAr from "../../static-content/Services/Details/disaster-recovery/ar.json";
// Import All Services (Source of Truth)
import servicesAllEn from "../../static-content/Services/All/en.json";
import servicesAllAr from "../../static-content/Services/All/ar.json";

export default function ServiceDetail({slug: externalSlug}: {slug?: string}) {
  const {slug: routerSlug} = useParams<{slug: string}>();
  const id = externalSlug || routerSlug;
  const {language} = useLanguage();

  const activeLanguage = language;
  const servicesList =
    activeLanguage === "ar" ? servicesAllAr.services : servicesAllEn.services;
  const sharedContent = activeLanguage === "ar" ? homeAr : homeEn;
  const allServicesList = servicesList;

  // Find service by SLUG from the static-content master list
  const service = servicesList.find((s) => s.slug === id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Generate legacy details structure if layouts still require it (fallback)
  // We cast the new service object to any to avoid strict type mismatch with legacy helper
  const details = getServiceDetails(service as any);

  // 1. Define available specific content
  const specificContentMap: Record<string, any> = {
    "web-development": activeLanguage === "ar" ? webDevAr : webDevEn,
    "mobile-development": activeLanguage === "ar" ? mobileDevAr : mobileDevEn,
    "saas-engineering": activeLanguage === "ar" ? saasAr : saasEn,
    "erp-solutions": activeLanguage === "ar" ? erpAr : erpEn,
    "api-integration": activeLanguage === "ar" ? apiIntegAr : apiIntegEn,
    "legacy-modernization": activeLanguage === "ar" ? legacyModAr : legacyModEn,
    "process-automation":
      activeLanguage === "ar" ? processAutoAr : processAutoEn,
    "natural-language-ai": activeLanguage === "ar" ? nlpAr : nlpEn,
    "computer-vision": activeLanguage === "ar" ? visionAr : visionEn,
    "predictive-analytics":
      activeLanguage === "ar" ? predictiveAr : predictiveEn,
    "generative-ai": activeLanguage === "ar" ? genAiAr : genAiEn,
    "machine-learning": activeLanguage === "ar" ? mlAr : mlEn,
    "cloud-infrastructure":
      activeLanguage === "ar" ? cloudInfraAr : cloudInfraEn,
    "managed-hosting": activeLanguage === "ar" ? hostingAr : hostingEn,
    cybersecurity: activeLanguage === "ar" ? cybersecurityAr : cybersecurityEn,
    "devops-engineering": activeLanguage === "ar" ? devopsAr : devopsEn,
    "serverless-architecture":
      activeLanguage === "ar" ? serverlessAr : serverlessEn,
    "disaster-recovery": activeLanguage === "ar" ? recoveryAr : recoveryEn,
    "seo-visibility": activeLanguage === "ar" ? seoAr : seoEn,
    "social-media": activeLanguage === "ar" ? socialAr : socialEn,
    "performance-marketing":
      activeLanguage === "ar" ? performanceAr : performanceEn,
    "content-strategy": activeLanguage === "ar" ? contentAr : contentEn,
    "email-automation": activeLanguage === "ar" ? emailAr : emailEn,
    "brand-identity": activeLanguage === "ar" ? brandAr : brandEn,
    // Future services will be added here:
  };

  // 2. Select Content
  // Priority: Specific JSON only
  const categoryId = service.categoryId; // e.g., "software"
  const slug = service.slug;

  const categoryContent = specificContentMap[slug] || {};

  if (Object.keys(categoryContent).length === 0) {
    return <Navigate to="/services" replace />;
  }

  // --------------------------------------------------------------------------
  // LAYOUT ROUTING
  // --------------------------------------------------------------------------

  const layout = () => {
    switch (categoryId) {
      case "software":
        return (
          <SoftwareLayout
            service={service as any}
            details={details}
            categoryContent={categoryContent}
            content={sharedContent}
            allServices={allServicesList}
          />
        );
      case "ai":
        return (
          <AILayout
            service={service as any}
            details={details}
            categoryContent={categoryContent}
            content={sharedContent}
            allServices={allServicesList}
          />
        );
      case "marketing":
        return (
          <MarketingLayout
            service={service as any}
            details={details}
            categoryContent={categoryContent}
            content={sharedContent}
            allServices={allServicesList}
          />
        );
      case "cloud":
        return (
          <CloudLayout
            service={service as any}
            details={details}
            categoryContent={categoryContent}
            content={sharedContent}
            allServices={allServicesList}
          />
        );
      default:
        // Fallback
        return (
          <SoftwareLayout
            service={service as any}
            details={details}
            categoryContent={categoryContent}
            content={sharedContent}
            allServices={allServicesList}
          />
        );
    }
  };

  return (
    <>
      <Head>
        <title>{categoryContent.seo?.title || service.title}</title>
        <meta
          name="description"
          content={categoryContent.seo?.description || service.shortDescription}
        />
        <meta name="keywords" content={categoryContent.seo?.keywords || ""} />
        <meta
          property="og:title"
          content={categoryContent.seo?.title || service.title}
        />
        <meta
          property="og:description"
          content={categoryContent.seo?.description || service.shortDescription}
        />
      </Head>
      {layout()}
    </>
  );
}
