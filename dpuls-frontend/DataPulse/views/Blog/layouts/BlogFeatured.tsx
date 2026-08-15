import React from "react";
import {Reveal} from "../../../components/Reveal";
import {Link} from "@/components/RouterShim";
import {useLanguage} from "../../../components/LanguageContext";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  trending: boolean;
  impact: string;
}

interface BlogFeaturedProps {
  content: {
    label: string;
    read_cta: string;
  };
  featuredPost: BlogPost;
}

export default function BlogFeatured({
  content,
  featuredPost,
}: BlogFeaturedProps) {
  const {dir} = useLanguage();

  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <Link
            to={`/blog/${featuredPost.id}`}
            className="group relative block"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              {/* Image Layer */}
              <div className="lg:col-span-8 relative overflow-hidden rounded-[3rem] aspect-[16/10] lg:aspect-[16/8] z-10 shadow-2xl">
                <img
                  src={featuredPost.image}
                  alt="Featured"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-brand-950/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              {/* Content Layer (Offset) */}
              <div
                className={`lg:col-span-6 lg:absolute ${dir === "rtl" ? "lg:left-0" : "lg:right-0"} z-20 bg-white p-10 md:p-16 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 mt-[-4rem] lg:mt-0 transform transition-transform duration-700 group-hover:-translate-y-2`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="px-4 py-1.5 bg-brand-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm">
                    {content.label}
                  </span>
                  <span className="text-xs text-slate-400  tracking-widest">
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-950 tracking-tight mb-8 leading-tight group-hover:text-brand-700 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed font-light mb-10 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                      <img
                        src="https://i.pravatar.cc/100?img=11"
                        alt="Author"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {featuredPost.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-brand-600 font-bold uppercase text-xs tracking-widest">
                    <span>{content.read_cta}</span>
                    <i
                      className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} translate-y-0.5`}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
