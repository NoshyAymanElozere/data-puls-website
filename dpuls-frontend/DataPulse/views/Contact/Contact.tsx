import React, {useMemo} from "react";
import {useLanguage} from "../../components/LanguageContext";
import HomeContact from "./../Home/layouts/HomeContact/HomeContact";
import HomeCTA from "./../Home/layouts/HomeCTA/HomeCTA";
import HomeServices from "./../Home/layouts/HomeServices/HomeServices";
import HomeClients from "./../Home/layouts/HomeClients/HomeClients";
import ContactHero from "./layouts/ContactHero";

// Import Contact static content
import contactEn from "../../static-content/Contact/en.json";
import contactAr from "../../static-content/Contact/ar.json";

// Import Home static content for shared sections
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";

// Import Services content
import servicesAllEn from "../../static-content/Services/All/en.json";
import servicesAllAr from "../../static-content/Services/All/ar.json";

export default function Contact() {
  const {language, dir} = useLanguage();
  const isRTL = dir === "rtl";

  // Load Contact-specific content
  const contactContent = useMemo(() => {
    return language === "ar" ? contactAr : contactEn;
  }, [language]);

  // Load Home shared sections content
  const homeData = language === "ar" ? homeAr : homeEn;

  // Services Logic
  const allServices =
    language === "ar" ? servicesAllAr.services : servicesAllEn.services;
  const homeServicesContent = homeData.servicesSection.services;

  const displayedServices = React.useMemo(() => {
    return allServices.slice(0, 6);
  }, [language, allServices]);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-brand-900 selection:text-white pb-0 overflow-x-hidden">
      {/* Hero Section - Contact Static Content */}
      <ContactHero content={contactContent.hero} isRTL={isRTL} />

      {/* Contact Form & Branches Section - Home Static Content */}
      <HomeContact content={homeData.contactSection} />

      {/* Shared Sections - Home Static Content */}
      <HomeServices
        services={displayedServices}
        content={homeServicesContent}
      />
      <HomeCTA content={homeData.ctaSection} />
      <HomeClients content={homeData.clientsSection} />
    </div>
  );
}
