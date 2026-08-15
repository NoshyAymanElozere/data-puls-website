import React from "react";
import { Section } from "../../../../components/UI";
import { useLanguage } from "../../../../components/LanguageContext";
import { Link } from "@/components/RouterShim";
import { Reveal } from "../../../../components/Reveal";

// Import HomeBlog section content from static-content
import enBlog from "../../../../static-content/Home/Home-Blogs/en.json";
import arBlog from "../../../../static-content/Home/Home-Blogs/ar.json";

// Define Blog type
interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryId: string;
  coverImage: string;
  author: string;
  publishedAt: string;
}

interface Category {
  id: string;
  label: string;
}

interface HomeBlogProps {
  homeBlogs?: Blog[];
  blogs?: Blog[];
  categories?: Category[];
}

export default function HomeBlog({
  homeBlogs,
  blogs,
  categories,
}: HomeBlogProps) {
  const { t, dir, language } = useLanguage();

  const displayContent = React.useMemo(() => {
    return language === "ar" ? arBlog.blog : enBlog.blog;
  }, [language]);

  // Use blogs from props (support both props for compatibility)
  const activeBlogs = blogs || homeBlogs || [];
  const [featuredPost, ...recentPosts] = activeBlogs;

  // Helper to get category label
  const getCategoryLabel = (id: string) => {
    if (!categories) return id;
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.label : id;
  };

  return (
    <Section className="bg-white py-24 lg:py-32 border-t border-gray-100 relative overflow-hidden">
      <div
        className={`absolute bottom-[-15%] ${dir === "rtl" ? "left-[-10%]" : "right-[-10%]"} w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] pointer-events-none z-0 opacity-80`}
      >
        <svg
          viewBox="0 0 800 800"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="400"
            cy="400"
            r="300"
            className="fill-brand-50 blur-3xl opacity-60"
          />
          <circle
            cx="400"
            cy="400"
            r="380"
            className="stroke-brand-50"
            strokeWidth="40"
            opacity="0.5"
          />
          <circle
            cx="400"
            cy="400"
            r="380"
            className="stroke-brand-100"
            strokeWidth="2"
            strokeDasharray="10 20"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 400 400"
              to="360 400 400"
              dur="120s"
              repeatCount="indefinite"
            />
          </circle>
          <path
            d="M400 150 A 250 250 0 0 1 650 400"
            className="stroke-brand-200"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 400 400"
              to="360 400 400"
              dur="30s"
              repeatCount="indefinite"
            />
          </path>
          <circle
            cx="400"
            cy="400"
            r="180"
            className="stroke-brand-100"
            strokeWidth="1"
            strokeDasharray="5 5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 400 400"
              to="0 400 400"
              dur="60s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="400" cy="400" r="60" className="fill-brand-50" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-100 pb-8">
            <div className="max-w-2xl">
              <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">
                {displayContent.badge}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-950 tracking-tight leading-tight">
                {displayContent.title}
              </h2>
            </div>
            <div className="hidden md:block">
              <Link
                to="/blog"
                className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:text-brand-600"
              >
                <span>{displayContent.view_all}</span>
                <i
                  className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} transform transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1`}
                ></i>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {featuredPost && (
            <div className="lg:col-span-7 flex flex-col h-full">
              <Reveal>
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="group block h-full bg-brand-50/60 hover:bg-brand-50 transition-colors duration-300 p-6 sm:p-8 rounded-3xl"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] mb-8 bg-gray-100 shadow-sm transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-brand-900/10">
                    <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                    <div
                      className={`absolute top-6 ${dir === "rtl" ? "right-6" : "left-6"} z-20`}
                    >
                      <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-900 rounded-sm shadow-sm">
                        {displayContent.featured_badge}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
                      <span className="text-brand-600 font-bold">
                        {getCategoryLabel(featuredPost.categoryId)}
                      </span>
                      <span className="w-px h-3 bg-gray-200"></span>
                      <span>{featuredPost.publishedAt}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-brand-950 leading-tight group-hover:text-brand-700 transition-colors duration-300 line-clamp-1">
                      {featuredPost.title}
                    </h3>
                    <p className="text-lg text-black leading-relaxed max-w-2xl line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-brand-600 font-bold text-sm tracking-wide group/link">
                      <span className="border-b-2 border-brand-100 group-hover/link:border-brand-600 transition-colors pb-0.5">
                        {displayContent.read_story}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          )}

          {recentPosts.length > 0 && (
            <div className="lg:col-span-5 flex flex-col">
              <div className="flex flex-col h-full divide-y divide-gray-100 border-t border-gray-100 lg:border-t-0">
                {recentPosts.map((post, index) => (
                  <Reveal
                    key={post.id}
                    delay={100 + index * 100}
                    className="h-full"
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group flex gap-6 py-8 md:py-10 h-full items-start transition-colors hover:bg-brand-50/40 -mx-4 px-4 rounded-xl"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black mb-2">
                          <span>{post.publishedAt}</span>
                        </div>
                        <h4 className="text-xl font-bold text-brand-950 mb-3 leading-snug group-hover:text-brand-700 transition-colors line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-sm text-black leading-relaxed line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <span
                          className={`text-xs font-bold text-brand-500 flex items-center gap-2 opacity-1 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}
                        >
                          {displayContent.read_insight}{" "}
                          <i
                            className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"}`}
                          ></i>
                        </span>
                      </div>
                      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative shadow-sm">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              <div className="md:hidden mt-8">
                <Link
                  to="/blog"
                  className="block w-full py-4 text-center border border-gray-200 rounded-lg font-bold text-brand-900 hover:bg-brand-50 transition-colors"
                >
                  {displayContent.view_all}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
