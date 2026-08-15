import React from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {PortfolioItem} from "../data/portfolio";
import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

// Layout Imports
import WebsiteHero from "./layouts/WebsiteHero";
import WebsiteStrategy from "./layouts/WebsiteStrategy";
import WebsiteExperience from "./layouts/WebsiteExperience";
import WebsiteFeatures from "./layouts/WebsiteFeatures";
import WebsiteDesignSystem from "./layouts/WebsiteDesignSystem";
import WebsiteTechStack from "./layouts/WebsiteTechStack";
import WebsiteCompatibility from "./layouts/WebsiteCompatibility";
import WebsiteImpact from "./layouts/WebsiteImpact";
import WebsiteGallery from "./layouts/WebsiteGallery";

interface Props {
  project: any;
  projectContent: any;
  content: any;
  allServices: any;
}

export default function WebsiteProjectLayout({
  project,
  projectContent,
  content,
  allServices,
}: Props) {
  const {language} = useLanguage();
  const websiteContent =
    language === "ar"
      ? projectContent.website_project
      : projectContent.website_project;
  // Note: projectContent already contains the language-specific version

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-brand-900 selection:text-white">
      <WebsiteHero project={project} content={websiteContent} />
      <WebsiteStrategy project={project} content={websiteContent} />
      <WebsiteExperience project={project} content={websiteContent} />
      <WebsiteFeatures project={project} content={websiteContent} />
      <WebsiteDesignSystem project={project} content={websiteContent} />
      <WebsiteTechStack project={project} content={websiteContent} />
      <WebsiteCompatibility project={project} content={websiteContent} />
      <WebsiteImpact project={project} content={websiteContent} />
      <WebsiteGallery project={project} content={websiteContent} />

      {/* Global Components */}
      <CTA content={content.ctaSection} />
      <Services
        services={allServices?.slice(0, 6) || []}
        content={content?.servicesSection?.services}
      />
      <Contact content={content.contactSection} />
      <Clients content={content.clientsSection} />
    </div>
  );
}
