import React, { useState, useMemo, useEffect } from "react";
import { useLanguage } from "../../components/LanguageContext";
import BlogHero from "./layouts/BlogHero";
import BlogCategories from "./layouts/BlogCategories";
import BlogFeatured from "./layouts/BlogFeatured";
import BlogLatest from "./layouts/BlogLatest";

// Import Home static content for shared sections
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";

// Import Services content
import servicesAllEn from "../../static-content/Services/All/en.json";
import servicesAllAr from "../../static-content/Services/All/ar.json";

// Import Blogs master list (Single Source of Truth)
import blogsAllEn from "../../static-content/Blogs/All/en.json";
import blogsAllAr from "../../static-content/Blogs/All/ar.json";

// Import shared Home components
import HomeCTA from "./../Home/layouts/HomeCTA/HomeCTA";
import HomeServices from "./../Home/layouts/HomeServices/HomeServices";
import HomeContact from "./../Home/layouts/HomeContact/HomeContact";
import HomeClients from "./../Home/layouts/HomeClients/HomeClients";

export default function Blog() {
  const { language } = useLanguage();
  const [activeCat, setActiveCat] = useState("all");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load Blogs master list
  const blogsData = language === "ar" ? blogsAllAr : blogsAllEn;
  // page object now contains 'hero', 'newsletter', 'featured_section', 'latest_section'
  // We ignore 'featured_section' type warning by trusting the JSON structure matches component props
  const { page } = blogsData as any;

  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {

    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blogs", {
          headers: {
            "Accept-Language": language
          }
        });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && Array.isArray(resJson.data) && resJson.data.length > 0) {
            setBlogs(resJson.data);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic blogs list:", err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/departments", {
          headers: {
            "Accept-Language": language
          }
        });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && Array.isArray(resJson.data) && resJson.data.length > 0) {
            const formatted = resJson.data.map((d: any) => ({
              id: d.slug,
              key: d.slug,
              label: d.name,
              icon: d.slug === "software"
                ? "fas fa-code"
                : d.slug === "ai"
                  ? "fas fa-brain"
                  : d.slug === "cloud"
                    ? "fas fa-cloud"
                    : d.slug === "marketing"
                      ? "fas fa-bullhorn"
                      : d.slug === "product"
                        ? "fas fa-lightbulb"
                        : "fas fa-tag"
            }));
            setCategories([
              { id: "all", key: "all", label: language === "ar" ? "كل المقالات" : "All Articles", icon: "fas fa-th" },
              ...formatted
            ]);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic categories list:", err);
      }
    };

    fetchBlogs();
    fetchDepartments();
  }, [language]);

  // Filter Blogs based on active category
  const filteredBlogs = useMemo(() => {
    if (activeCat === "all") {
      return blogs;
    }
    return blogs.filter((blog: any) => blog.categoryId === activeCat);
  }, [blogs, activeCat]);

  // Transform filtered blogs to match BlogFeatured/BlogLatest expected shape
  const transformedPosts = useMemo(() => {
    return filteredBlogs.map((blog: any) => {
      // Resolve category label
      const cat = categories.find((c: any) => c.id === blog.categoryId);
      const catLabel = cat ? cat.label : blog.categoryId;

      return {
        id: blog.slug, // Use slug as ID for linking
        category: catLabel,
        title: blog.title,
        excerpt: blog.excerpt,
        author: blog.author,
        date: blog.publishedAt,
        readTime: "5 min read", // Default value
        image: blog.coverImage,
        trending: false,
        impact: "High",
      };
    });
  }, [filteredBlogs, categories]);

  const featuredPost = transformedPosts[0];
  const latestPosts = transformedPosts.slice(1);

  // Load Home shared sections content
  const homeData = language === "ar" ? homeAr : homeEn;

  // Services Logic
  const allServices =
    language === "ar" ? servicesAllAr.services : servicesAllEn.services;
  const homeServicesContent = homeData.servicesSection.services;

  const displayedServices = React.useMemo(() => {
    return allServices.slice(0, 6);
  }, [language, allServices]);

  useEffect(() => {
    const handleScroll = () => {
      const progress =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-slate-900 selection:bg-brand-900 selection:text-white">
      {/* Hero Section */}
      <BlogHero content={page.hero} scrollProgress={scrollProgress} />

      {/* Categories Filter */}
      <BlogCategories
        categories={categories}
        activeCat={activeCat}
        onCategoryChange={setActiveCat}
      />

      {/* Main Blog Content Area */}
      {featuredPost && (
        <BlogFeatured
          content={page.featured_section}
          featuredPost={featuredPost}
        />
      )}

      {/* Latest Blogs Grid */}
      {latestPosts.length > 0 && (
        <BlogLatest content={page.latest_section} posts={latestPosts} />
      )}

      {/* Shared Sections - Home Static Content */}
      <HomeCTA content={homeData.ctaSection} />
      <HomeServices
        services={displayedServices}
        content={homeServicesContent}
      />
      <HomeContact content={homeData.contactSection} />
      <HomeClients content={homeData.clientsSection} />
    </div>
  );
}
