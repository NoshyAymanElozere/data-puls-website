import React from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {ServiceItem, ServiceDetailContent} from "../data/services";
import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

import SoftwareHero from "./layouts/SoftwareHero";
import SoftwareOverview from "./layouts/SoftwareOverview";
import SoftwareCapabilities from "./layouts/SoftwareCapabilities";
import SoftwareBuild from "./layouts/SoftwareBuild";
import SoftwarePhilosophy from "./layouts/SoftwarePhilosophy";
import SoftwareTechStack from "./layouts/SoftwareTechStack";
import SoftwareProcess from "./layouts/SoftwareProcess";
import SoftwareQuality from "./layouts/SoftwareQuality";
import SoftwareUseCases from "./layouts/SoftwareUseCases";
import SoftwareEngagement from "./layouts/SoftwareEngagement";
import SoftwareWhyUs from "./layouts/SoftwareWhyUs";
import SoftwareRelatedServices from "./layouts/SoftwareRelatedServices";

interface Props {
  service: ServiceItem;
  details: ServiceDetailContent;
  categoryContent: any;
  content?: any;
  allServices?: any[];
}

export default function SoftwareLayout({
  service,
  details,
  categoryContent,
  content,
  allServices,
}: Props) {
  const {language} = useLanguage();

  // content prop contains shared sections like cta, services, etc.
  // categoryContent contains the specific page data (hero, overview, etc.)

  const softwareContent = categoryContent;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      <SoftwareHero service={service} categoryContent={softwareContent} />
      <SoftwareOverview categoryContent={softwareContent} />
      <SoftwareCapabilities categoryContent={softwareContent} />
      <SoftwareBuild categoryContent={softwareContent} />
      <SoftwarePhilosophy categoryContent={softwareContent} />
      <SoftwareTechStack categoryContent={softwareContent} />
      <SoftwareProcess categoryContent={softwareContent} />
      <SoftwareQuality categoryContent={softwareContent} />
      <SoftwareUseCases categoryContent={softwareContent} />
      <SoftwareEngagement categoryContent={softwareContent} />
      <SoftwareWhyUs categoryContent={softwareContent} />
      <SoftwareRelatedServices
        service={service}
        categoryContent={softwareContent}
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
