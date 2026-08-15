import React from "react";
import {Reveal} from "../../../components/Reveal";
import {Link} from "@/components/RouterShim";

interface RelatedPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
}

interface BlogDetailRelatedProps {
  content: {
    title_line1: string;
    title_line2: string;
    subtitle: string;
    view_archive: string;
    access_label: string;
  };
  relatedPosts: RelatedPost[];
  isRTL: boolean;
}

export default function BlogDetailRelated({
  content,
  relatedPosts,
  isRTL,
}: BlogDetailRelatedProps) {
  return (
    <section className="py-32 bg-[#f8fafc] relative overflow-hidden border-t border-slate-100">
      {/* Dynamic Technical Grid Background (Adapted for Light Theme) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-[0.08]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="related-grid-pattern-light"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#192652"
                strokeWidth="0.1"
              />
            </pattern>
          </defs>
          <rect
            width="100"
            height="100"
            fill="url(#related-grid-pattern-light)"
          />
        </svg>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-100/30 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-20 gap-8 border-s-4 border-brand-600 ps-10">
            <div>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-slate-950">
                {content.title_line1} <br />
                <span className="text-brand-600">{content.title_line2}</span>
              </h2>
              <p className="text-slate-500 mt-4 text-lg font-light max-w-md leading-relaxed">
                {content.subtitle}
              </p>
            </div>
            <Link
              to="/blog"
              className="group flex items-center gap-3 px-6 py-3 bg-slate-200/50 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-brand-600 hover:bg-slate-200 transition-all duration-300"
            >
              {content.view_archive}{" "}
              <i
                className={`fa-solid ${isRTL ? "fa-arrow-left" : "fa-arrow-right"} transition-transform group-hover:translate-x-1`}
              ></i>
            </Link>
          </div>
        </Reveal>

        {/* Grid of Related Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {relatedPosts.map((post, idx) => (
            <Reveal key={post.id} delay={idx * 100}>
              <Link
                to={`/blog/${post.id}`}
                className="group block h-full flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-brand-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-bold uppercase text-brand-900 tracking-widest border border-slate-200/50">
                    {post.category}
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                    <span>{post.date}</span>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span className="text-brand-600">{post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 mb-6 leading-tight group-hover:text-brand-800 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-900 text-sm leading-relaxed line-clamp-3 mb-10 text-start">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover:text-brand-600 transition-colors">
                      {content.access_label}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-brand-600 group-hover:text-brand-600 transition-all ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                    >
                      <i
                        className={`fa-solid ${isRTL ? "fa-arrow-left" : "fa-arrow-right"} text-[10px]`}
                      ></i>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
