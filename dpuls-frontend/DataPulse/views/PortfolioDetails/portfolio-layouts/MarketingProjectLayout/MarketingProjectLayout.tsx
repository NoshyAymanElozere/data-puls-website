import React from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {PortfolioItem} from "../data/portfolio";
import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

// Layout Imports
import MarketingHero from "./layouts/MarketingHero";
import MarketingContext from "./layouts/MarketingContext";
import MarketingChallenge from "./layouts/MarketingChallenge";
import MarketingStrategy from "./layouts/MarketingStrategy";
import MarketingAudience from "./layouts/MarketingAudience";
import MarketingChannels from "./layouts/MarketingChannels";
import MarketingMessaging from "./layouts/MarketingMessaging";
import MarketingExecution from "./layouts/MarketingExecution";
import MarketingPerformance from "./layouts/MarketingPerformance";
import MarketingOptimization from "./layouts/MarketingOptimization";
import MarketingResults from "./layouts/MarketingResults";
import MarketingGallery from "./layouts/MarketingGallery";
import MarketingRelated from "./layouts/MarketingRelated";

interface Props {
  project: any;
  projectContent: any;
  content: any;
  allServices: any;
}

export default function MarketingProjectLayout({
  project,
  projectContent,
  content,
  allServices,
}: Props) {
  const {language} = useLanguage();
  const marketingContent =
    language === "ar"
      ? projectContent.marketing_project
      : projectContent.marketing_project;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-brand-600 selection:text-white overflow-x-hidden">
      <MarketingHero project={project} content={marketingContent} />
      <MarketingContext project={project} content={marketingContent} />
      <MarketingChallenge project={project} content={marketingContent} />
      <MarketingStrategy project={project} content={marketingContent} />
      <MarketingAudience project={project} content={marketingContent} />
      <MarketingChannels project={project} content={marketingContent} />
      <MarketingMessaging project={project} content={marketingContent} />
      <MarketingExecution project={project} content={marketingContent} />
      <MarketingPerformance project={project} content={marketingContent} />
      <MarketingOptimization project={project} content={marketingContent} />
      <MarketingResults project={project} content={marketingContent} />
      <MarketingGallery project={project} content={marketingContent} />
      <MarketingRelated project={project} content={marketingContent} />

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
