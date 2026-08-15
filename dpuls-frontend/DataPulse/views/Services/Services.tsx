import React, {useState, useMemo, useEffect} from "react";
import {useLanguage} from "../../components/LanguageContext";
import CTA from "./../Home/layouts/HomeCTA/HomeCTA";
import Technologies from "./../Home/layouts/HomeTechnologies/HomeTechnologies";
import Contact from "./../Home/layouts/HomeContact/HomeContact";
import Clients from "./../Home/layouts/HomeClients/HomeClients";
import ServicesHero from "./layouts/ServicesHero";
import ServicesGrid from "./layouts/ServicesGrid";
import servicesEn from "../../static-content/Services/All/en.json";
import servicesAr from "../../static-content/Services/All/ar.json";
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";

export default function Services() {
  const {language, dir} = useLanguage();
  const [activeCategory, setActiveCategory] = useState("software");
  const [isAnimating, setIsAnimating] = useState(false);

  // Load Services Data (contains both page content and service list)
  const servicesData = useMemo(() => {
    return language === "ar" ? servicesAr : servicesEn;
  }, [language]);

  // Load Home Data for shared sections
  const homeData = useMemo(() => {
    return language === "ar" ? homeAr : homeEn;
  }, [language]);

  const content = servicesData.listingPage;

  // Map categories to include icons
  const categories = useMemo(() => {
    const iconMap: Record<string, string> = {
      software: "fa-solid fa-code",
      ai: "fa-solid fa-brain",
      marketing: "fa-solid fa-bullhorn",
      cloud: "fa-solid fa-cloud",
    };

    return servicesData.categories.map((cat) => ({
      ...cat,
      icon: iconMap[cat.id] || "fa-solid fa-layer-group",
    }));
  }, [servicesData]);

  // Filtering Logic
  const filteredServices = useMemo(() => {
    return servicesData.services.filter((s) => s.categoryId === activeCategory);
  }, [servicesData, activeCategory]);

  const handleTabChange = (id: string) => {
    if (id === activeCategory) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveCategory(id);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <ServicesHero
        content={content.hero}
        subtitle={content.services_section.subtitle}
      />

      {/* TABS & GRID SECTION */}
      <ServicesGrid
        content={content.services_section}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleTabChange}
        filteredServices={filteredServices}
        isAnimating={isAnimating}
      />

      {/* Shared Sections */}
      <CTA content={homeData.ctaSection} />
      <Technologies content={homeData.technologySection} />
      <Contact content={homeData.contactSection} />
      <Clients content={homeData.clientsSection} />
    </div>
  );
}
