import React from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {ServiceItem, ServiceDetailContent, services} from "../data/services";
import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

// Imports removed

import AIHero from "./layouts/AIHero";
import AIOverview from "./layouts/AIOverview";
import AICapabilities from "./layouts/AICapabilities";
import AIAutomation from "./layouts/AIAutomation";
import AIModelsLogic from "./layouts/AIModelsLogic";
import AIDataStrategy from "./layouts/AIDataStrategy";
import AIHitl from "./layouts/AIHitl";
import AIResponsible from "./layouts/AIResponsible";
import AIIntegration from "./layouts/AIIntegration";
import AIProcess from "./layouts/AIProcess";
import AIOutcomes from "./layouts/AIOutcomes";
import AIRelatedServices from "./layouts/AIRelatedServices";

interface Props {
  service: ServiceItem;
  details: ServiceDetailContent;
  content?: any;
  categoryContent: any;
  allServices?: any[];
}

export default function AILayout({
  service,
  details,
  content,
  categoryContent,
  allServices,
}: Props) {
  const {language} = useLanguage();

  // Filter related services (Same category, excluding current)
  const relatedServices = services
    .filter((s) => s.category === "AI" && s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="bg-black min-h-screen text-slate-200 font-sans selection:bg-brand-500 selection:text-white">
      <AIHero service={service} categoryContent={categoryContent} />
      <AIOverview categoryContent={categoryContent} />
      <AICapabilities categoryContent={categoryContent} details={details} />
      <AIAutomation categoryContent={categoryContent} />
      <AIModelsLogic categoryContent={categoryContent} />
      <AIDataStrategy categoryContent={categoryContent} />
      <AIHitl categoryContent={categoryContent} />
      <AIResponsible categoryContent={categoryContent} />
      <AIIntegration categoryContent={categoryContent} />
      <AIProcess categoryContent={categoryContent} />
      <AIOutcomes categoryContent={categoryContent} />
      <AIRelatedServices
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
