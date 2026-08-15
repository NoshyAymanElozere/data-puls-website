import React from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {ServiceItem, ServiceDetailContent, services} from "../data/services";
import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

// Import Layouts
import MarketingHero from "./layouts/MarketingHero";
import MarketingOverview from "./layouts/MarketingOverview";
import MarketingPhilosophy from "./layouts/MarketingPhilosophy";
import MarketingJourney from "./layouts/MarketingJourney";
import MarketingChannels from "./layouts/MarketingChannels";
import MarketingVoice from "./layouts/MarketingVoice";
import MarketingPerformance from "./layouts/MarketingPerformance";
import MarketingGrowthLoop from "./layouts/MarketingGrowthLoop";
import MarketingCollaboration from "./layouts/MarketingCollaboration";
import MarketingGovernance from "./layouts/MarketingGovernance";
import MarketingUseCases from "./layouts/MarketingUseCases";
import MarketingRelatedServices from "./layouts/MarketingRelatedServices";

// Import Content
// Internal imports removed

interface Props {
  service: ServiceItem;
  details: ServiceDetailContent;
  content?: any;
  categoryContent: any;
  allServices?: any[];
}

export default function MarketingLayout({
  service,
  details,
  content,
  categoryContent,
  allServices,
}: Props) {
  const {language} = useLanguage();

  // Filter related services
  const relatedServices = services
    .filter((s) => s.category === "Marketing" && s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="bg-[#fdfcf8] min-h-screen text-slate-900 font-sans selection:bg-brand-200 selection:text-brand-900">
      <MarketingHero service={service} categoryContent={categoryContent} />
      <MarketingOverview categoryContent={categoryContent} />
      <MarketingPhilosophy categoryContent={categoryContent} />
      <MarketingJourney categoryContent={categoryContent} />
      <MarketingChannels categoryContent={categoryContent} />
      <MarketingVoice categoryContent={categoryContent} />
      <MarketingPerformance categoryContent={categoryContent} />
      <MarketingGrowthLoop categoryContent={categoryContent} />
      <MarketingCollaboration categoryContent={categoryContent} />
      <MarketingGovernance categoryContent={categoryContent} />
      <MarketingUseCases categoryContent={categoryContent} />
      <MarketingRelatedServices
        relatedServices={relatedServices}
        categoryContent={categoryContent}
      />

      {/* Shared Footer Sections */}
      <CTA content={content?.ctaSection || content?.cta} />
      <Services
        services={allServices?.slice(0, 6) || []}
        content={content?.servicesSection?.services}
      />
      <Contact content={content?.contactSection || content?.contact} />
      <Clients content={content?.clientsSection || content?.clients} />
    </div>
  );
}
