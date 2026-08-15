import React from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {ServiceItem, ServiceDetailContent, services} from "../data/services";
import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

// Import Layouts
import CloudHero from "./layouts/CloudHero";
import CloudOverview from "./layouts/CloudOverview";
import CloudArchitecture from "./layouts/CloudArchitecture";
import CloudLifecycle from "./layouts/CloudLifecycle";
import CloudReliability from "./layouts/CloudReliability";
import CloudSecurity from "./layouts/CloudSecurity";
import CloudPerformance from "./layouts/CloudPerformance";
import CloudOperations from "./layouts/CloudOperations";
import CloudRecovery from "./layouts/CloudRecovery";
import CloudCost from "./layouts/CloudCost";
import CloudMigration from "./layouts/CloudMigration";
import CloudRelatedServices from "./layouts/CloudRelatedServices";

// Import Content
// Internal imports removed

interface Props {
  service: ServiceItem;
  details: ServiceDetailContent;
  content?: any;
  categoryContent: any;
  allServices?: any[];
}

export default function CloudLayout({
  service,
  details,
  content,
  categoryContent,
  allServices,
}: Props) {
  const {language} = useLanguage();

  // Filter related services
  const relatedServices = services
    .filter((s) => s.category === "Cloud" && s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="bg-[#f1f5f9] min-h-screen text-slate-800 font-sans selection:bg-brand-600 selection:text-white">
      <CloudHero service={service} categoryContent={categoryContent} />
      <CloudOverview categoryContent={categoryContent} />
      <CloudArchitecture categoryContent={categoryContent} />
      <CloudLifecycle categoryContent={categoryContent} />
      <CloudReliability categoryContent={categoryContent} />
      <CloudSecurity categoryContent={categoryContent} />
      <CloudPerformance categoryContent={categoryContent} />
      <CloudOperations categoryContent={categoryContent} />
      <CloudRecovery categoryContent={categoryContent} />
      <CloudCost categoryContent={categoryContent} />
      <CloudMigration categoryContent={categoryContent} />
      <CloudRelatedServices
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
