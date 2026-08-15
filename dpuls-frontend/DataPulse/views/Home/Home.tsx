import React from "react";
import HomeHero from "./layouts/HomeHero/HomeHero";
import HomeAbout from "./layouts/HomeAbout/HomeAbout";
import HomeServices from "./layouts/HomeServices/HomeServices";
import HomeTechnologies from "./layouts/HomeTechnologies/HomeTechnologies";
import HomePortfolio from "./layouts/HomePortfolio/HomePortfolio";
import HomeBlog from "./layouts/HomeBlog/HomeBlog";
import HomeContact from "./layouts/HomeContact/HomeContact";
import HomeCTA from "./layouts/HomeCTA/HomeCTA";
import HomeClients from "./layouts/HomeClients/HomeClients";
import { useLanguage } from "../../components/LanguageContext";

// Import root static content pointers
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";

// Import Services content
import servicesAllEn from "../../static-content/Services/All/en.json";
import servicesAllAr from "../../static-content/Services/All/ar.json";

// Import Blogs content
import blogsAllEn from "../../static-content/Blogs/All/en.json";
import blogsAllAr from "../../static-content/Blogs/All/ar.json";

// Import Portfolio content
import portfolioAllEn from "../../static-content/Portfolio/All/en.json";
import portfolioAllAr from "../../static-content/Portfolio/All/ar.json";

export default function Home() {
  const { language } = useLanguage();

  // Use language from context (synced via _app.tsx)
  const activeLanguage = language;
  const homeData = activeLanguage === "ar" ? homeAr : homeEn;

  // Fix hydration mismatch by ensuring initial client render matches server (en)
  const [isMounted, setIsMounted] = React.useState(false);
  const [blogs, setBlogs] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    setIsMounted(true);

    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blogs", {
          headers: {
            "Accept-Language": activeLanguage
          }
        });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && Array.isArray(resJson.data) && resJson.data.length > 0) {
            setBlogs(resJson.data);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic blogs list on homepage:", err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/departments", {
          headers: {
            "Accept-Language": activeLanguage
          }
        });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && Array.isArray(resJson.data) && resJson.data.length > 0) {
            const formatted = resJson.data.map((d: any) => ({
              id: d.slug,
              key: d.slug,
              label: d.name
            }));
            setCategories(formatted);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic categories list on homepage:", err);
      }
    };

    fetchBlogs();
    fetchDepartments();
  }, [activeLanguage]);

  // Services Logic
  const allServices =
    activeLanguage === "ar" ? servicesAllAr.services : servicesAllEn.services;
  const homeServicesContent = homeData.servicesSection.services;

  const displayedServices = React.useMemo(() => {
    if (!isMounted) return allServices.slice(0, 6);
    return [...allServices].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [isMounted, activeLanguage, allServices]); // Added dependencies for safety

  // Blogs Logic
  const displayedBlogs = React.useMemo(() => {
    if (!isMounted) return blogs.slice(0, 4);
    return [...blogs].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [isMounted, blogs]);

  // Portfolio Logic
  const allProjects =
    activeLanguage === "ar" ? portfolioAllAr.projects : portfolioAllEn.projects;

  const displayedProjects = React.useMemo(() => {
    if (!isMounted) return allProjects.slice(0, 4);
    return [...allProjects].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [isMounted, activeLanguage, allProjects]);

  return (
    <div className="overflow-hidden">
      <HomeHero content={homeData.heroSection} />
      <HomeAbout content={homeData.aboutSection} />
      <HomeServices
        services={displayedServices}
        content={homeServicesContent}
      />
      <HomeCTA content={homeData.ctaSection} />
      <HomeTechnologies content={homeData.technologySection} />
      <HomePortfolio homeProjects={displayedProjects} />
      <HomeBlog homeBlogs={displayedBlogs} categories={categories} />
      <HomeContact content={homeData.contactSection} />
      <HomeClients content={homeData.clientsSection} />
    </div>
  );
}
