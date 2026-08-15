import React, {useState, useMemo} from "react";
import {useLanguage} from "../../components/LanguageContext";
import portfolioAllEn from "../../static-content/Portfolio/All/en.json";
import portfolioAllAr from "../../static-content/Portfolio/All/ar.json";
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";
import servicesAllEn from "../../static-content/Services/All/en.json";
import servicesAllAr from "../../static-content/Services/All/ar.json";
import CTA from "./../Home/layouts/HomeCTA/HomeCTA";
import Services from "./../Home/layouts/HomeServices/HomeServices";
import Contact from "./../Home/layouts/HomeContact/HomeContact";
import Clients from "./../Home/layouts/HomeClients/HomeClients";
import PortfolioHero from "./layouts/PortfolioHero";
import PortfolioGrid from "./layouts/PortfolioGrid";

export default function Portfolio() {
  const {language, dir} = useLanguage();
  const [filter, setFilter] = useState("all");

  // Use the combined data from static-content
  const content = useMemo(() => {
    return language === "ar" ? portfolioAllAr : portfolioAllEn;
  }, [language]);

  const projects = content.projects;
  const categories = content.categories;

  // Map icons to categories
  const iconMap: Record<string, string> = {
    all: "fa-solid fa-layer-group",
    web: "fa-solid fa-code",
    mobile: "fa-solid fa-mobile-screen",
    software: "fa-solid fa-laptop-code",
    cloud: "fa-solid fa-cloud",
    ai: "fa-solid fa-brain",
    marketing: "fa-solid fa-bullhorn",
  };

  // Only show categories that actually have projects (plus 'all')
  const activeCategoryIds = useMemo(() => {
    const ids = new Set(projects.map((p) => p.categoryId));
    ids.add("all");
    return ids;
  }, [projects]);

  const categoryTabs = useMemo(() => {
    return categories
      .filter((cat) => activeCategoryIds.has(cat.id))
      .map((cat) => ({
        ...cat,
        icon: iconMap[cat.id] || "fa-solid fa-cube",
      }));
  }, [categories, activeCategoryIds]);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.categoryId === filter);

  const homeData = useMemo(() => {
    return language === "ar" ? homeAr : homeEn;
  }, [language]);

  const allServices = useMemo(() => {
    return language === "ar" ? servicesAllAr.services : servicesAllEn.services;
  }, [language]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <PortfolioHero content={content.hero} />

      {/* Portfolio Grid Section */}
      <PortfolioGrid
        content={content.portfolio}
        categories={categoryTabs}
        filter={filter}
        onFilterChange={setFilter}
        filteredProjects={filteredProjects as any}
        dir={dir}
      />

      {/* Shared Sections */}
      <CTA content={homeData.ctaSection} />
      <Services
        services={allServices.slice(0, 6)}
        content={homeData.servicesSection.services}
      />
      <Contact content={homeData.contactSection} />
      <Clients content={homeData.clientsSection} />
    </div>
  );
}
