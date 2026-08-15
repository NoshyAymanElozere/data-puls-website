import React from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {PortfolioItem} from "../data/portfolio";
import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

// Layout Imports
import MobileHero from "./layouts/MobileHero";
import MobilePainPoints from "./layouts/MobilePainPoints";
import MobileStrategy from "./layouts/MobileStrategy";
import MobileExperience from "./layouts/MobileExperience";
import MobileFeatures from "./layouts/MobileFeatures";
import MobileDesignSystem from "./layouts/MobileDesignSystem";
import MobileTechStack from "./layouts/MobileTechStack";
import MobileCompatibility from "./layouts/MobileCompatibility";
import MobileImpact from "./layouts/MobileImpact";
import MobileGallery from "./layouts/MobileGallery";

interface Props {
  project: any;
  projectContent: any;
  content: any;
  allServices: any;
}

export default function MobileProjectLayout({
  project,
  projectContent,
  content,
  allServices,
}: Props) {
  const {language} = useLanguage();
  const mobileContent =
    language === "ar"
      ? projectContent.mobile_project
      : projectContent.mobile_project;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-brand-900 selection:text-white">
      <MobileHero project={project} content={mobileContent} />
      <MobilePainPoints project={project} content={mobileContent} />
      <MobileStrategy project={project} content={mobileContent} />
      <MobileExperience project={project} content={mobileContent} />
      <MobileFeatures project={project} content={mobileContent} />
      <MobileDesignSystem project={project} content={mobileContent} />
      <MobileTechStack project={project} content={mobileContent} />
      <MobileCompatibility project={project} content={mobileContent} />
      <MobileImpact project={project} content={mobileContent} />
      <MobileGallery project={project} content={mobileContent} />

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
