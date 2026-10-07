import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useParams, Navigate } from "@/components/RouterShim";
import { API_BASE_URL } from "../../config/api";
import { useLanguage } from "../../components/LanguageContext";
import CTA from "./../Home/layouts/HomeCTA/HomeCTA";
import Services from "./../Home/layouts/HomeServices/HomeServices";
import Contact from "./../Home/layouts/HomeContact/HomeContact";
import Clients from "./../Home/layouts/HomeClients/HomeClients";

// Import Layout Components
import BlogDetailHero from "./layouts/BlogDetailHero";
import BlogDetailContent from "./layouts/BlogDetailContent";
import BlogDetailRelated from "./layouts/BlogDetailRelated";

// Import Shared Home Content
import homeEn from "../../static-content/Home/en";
import homeAr from "../../static-content/Home/ar";

// Import All Blogs (Source of Truth for Listing)
import blogsAllEn from "../../static-content/Blogs/All/en.json";
import blogsAllAr from "../../static-content/Blogs/All/ar.json";

// Import Specific Blog Content
import microEn from "../../static-content/Blogs/Details/microservices-architecture-guide/en.json";
import microAr from "../../static-content/Blogs/Details/microservices-architecture-guide/ar.json";
import aiEn from "../../static-content/Blogs/Details/ai-powered-customer-service/en.json";
import aiAr from "../../static-content/Blogs/Details/ai-powered-customer-service/ar.json";
import k8sEn from "../../static-content/Blogs/Details/kubernetes-production-deployment/en.json";
import k8sAr from "../../static-content/Blogs/Details/kubernetes-production-deployment/ar.json";
import seoEn from "../../static-content/Blogs/Details/seo-strategy-2024/en.json";
import seoAr from "../../static-content/Blogs/Details/seo-strategy-2024/ar.json";
import prodEn from "../../static-content/Blogs/Details/product-metrics-frameworks/en.json";
import prodAr from "../../static-content/Blogs/Details/product-metrics-frameworks/ar.json";
import llmEn from "../../static-content/Blogs/Details/llm-integration-patterns/en.json";
import llmAr from "../../static-content/Blogs/Details/llm-integration-patterns/ar.json";
import reactEn from "../../static-content/Blogs/Details/react-performance-optimization/en.json";
import reactAr from "../../static-content/Blogs/Details/react-performance-optimization/ar.json";
import serverlessEn from "../../static-content/Blogs/Details/serverless-architecture-aws/en.json";
import serverlessAr from "../../static-content/Blogs/Details/serverless-architecture-aws/ar.json";
import contentEn from "../../static-content/Blogs/Details/content-marketing-b2b-saas/en.json";
import contentAr from "../../static-content/Blogs/Details/content-marketing-b2b-saas/ar.json";
import dataEn from "../../static-content/Blogs/Details/data-driven-product-decisions/en.json";
import dataAr from "../../static-content/Blogs/Details/data-driven-product-decisions/ar.json";
import mlEn from "../../static-content/Blogs/Details/machine-learning-deployment/en.json";
import mlAr from "../../static-content/Blogs/Details/machine-learning-deployment/ar.json";
import tsEn from "../../static-content/Blogs/Details/typescript-advanced-patterns/en.json";
import tsAr from "../../static-content/Blogs/Details/typescript-advanced-patterns/ar.json";

// Import Services All (Source of Truth for Listing)
import servicesAllEn from "../../static-content/Services/All/en.json";
import servicesAllAr from "../../static-content/Services/All/ar.json";

export default function BlogDetail({ slug: externalSlug }: { slug?: string }) {
  const { slug: routerSlug } = useParams<{ slug: string }>();
  const id = externalSlug || routerSlug;
  const { language, dir } = useLanguage();
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const activeLanguage = language;
  const isRTL = dir === "rtl";

  // 1. Define shared content from Home
  const sharedContent = activeLanguage === "ar" ? homeAr : homeEn;

  // 2. Define source of truth for services

  const servicesList =
    activeLanguage === "ar" ? servicesAllAr.services : servicesAllEn.services;

  // 3. Define specific content map
  const specificContentMap: Record<string, any> = {
    "microservices-architecture-guide":
      activeLanguage === "ar" ? microAr : microEn,
    "ai-powered-customer-service": activeLanguage === "ar" ? aiAr : aiEn,
    "kubernetes-production-deployment": activeLanguage === "ar" ? k8sAr : k8sEn,
    "seo-strategy-2024": activeLanguage === "ar" ? seoAr : seoEn,
    "product-metrics-frameworks": activeLanguage === "ar" ? prodAr : prodEn,
    "llm-integration-patterns": activeLanguage === "ar" ? llmAr : llmEn,
    "react-performance-optimization":
      activeLanguage === "ar" ? reactAr : reactEn,
    "serverless-architecture-aws":
      activeLanguage === "ar" ? serverlessAr : serverlessEn,
    "content-marketing-b2b-saas":
      activeLanguage === "ar" ? contentAr : contentEn,
    "data-driven-product-decisions": activeLanguage === "ar" ? dataAr : dataEn,
    "machine-learning-deployment": activeLanguage === "ar" ? mlAr : mlEn,
    "typescript-advanced-patterns": activeLanguage === "ar" ? tsAr : tsEn,
  };

  const [articleContent, setArticleContent] = useState<any>(null);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setArticleContent(null);
    setLoading(true);

    const fetchDynamicData = async () => {
      try {
        const detailRes = await fetch(`${API_BASE_URL}/blogs/${id}`, {
          headers: {
            "Accept-Language": language
          }
        });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          if (detailData.success && detailData.data) {
            setArticleContent(detailData.data);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic blog from backend:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBlogsList = async () => {
      try {
        const listRes = await fetch(`${API_BASE_URL}/blogs`, {
          headers: {
            "Accept-Language": language
          }
        });
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.success && Array.isArray(listData.data)) {
            setBlogsList(listData.data);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic blogs list:", err);
      }
    };

    if (id) {
      fetchDynamicData();
      fetchBlogsList();
    }
  }, [id, language]);

  const article = articleContent?.article;

  // 4. Find related posts from the overall list (filtering current one)
  const relatedPosts = blogsList
    .filter((b: any) => (b.slug || b.id) !== id)
    .slice(0, 3)
    .map((b: any) => ({
      id: b.slug || b.id,
      category: b.categoryId,
      title: b.title,
      excerpt: b.excerpt || b.subtitle,
      date: b.publishedAt,
      readTime: b.readTime || "10 min",
      image: b.coverImage,
    }));

  useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / height;
      setScrollPercentage(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading && !article) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-800" />
      </div>
    );
  }

  if (!id || (!article && !loading)) return <Navigate to="/blog" replace />;

  return (
    <>
      <Head>
        <title>{articleContent.seo?.title || article.title}</title>
        <meta
          name="description"
          content={articleContent.seo?.description || article.lead}
        />
        <meta name="keywords" content={articleContent.seo?.keywords || ""} />
        <meta
          property="og:title"
          content={articleContent.seo?.title || article.title}
        />
        <meta
          property="og:description"
          content={articleContent.seo?.description || article.lead}
        />
      </Head>

      <div className="bg-[#fcfcfc] min-h-screen text-slate-900 font-sans selection:bg-brand-900 selection:text-white pb-0 overflow-x-hidden">
        {/* Dynamic Hero Section */}
        <BlogDetailHero
          content={articleContent.hero}
          article={article}
          scrollPercentage={scrollPercentage}
          isRTL={isRTL}
        />

        {/* Dynamic Article Content Body */}
        <BlogDetailContent
          content={{
            ...articleContent.sidebar,
            ...articleContent.content,
            index: articleContent.index,
          }}
        />

        {/* Dynamic Related Articles */}
        <BlogDetailRelated
          content={articleContent.related}
          relatedPosts={relatedPosts}
          isRTL={isRTL}
        />

        {/* Shared Home Sections - Content passed from Home JSON */}
        <CTA content={sharedContent.ctaSection} />
        <Services
          services={servicesList}
          content={sharedContent.servicesSection.services}
        />
        <Contact content={sharedContent.contactSection} />
        <Clients content={sharedContent.clientsSection} />
      </div>
    </>
  );
}
