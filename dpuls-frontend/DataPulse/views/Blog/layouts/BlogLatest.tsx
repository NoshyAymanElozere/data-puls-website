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

interface BlogLatestProps {
  content: {
    title: string;
    subtitle: string;
    batch_label: string;
    access_label: string;
  };
  posts: BlogPost[];
}

export default function BlogLatest({content, posts}: BlogLatestProps) {
  const {dir} = useLanguage();

  return (
    <section className="py-32 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="mb-20 flex justify-between items-end border-s-4 border-brand-600 ps-10">
            <div>
              <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900">
                {content.title}
              </h2>
              <p className="text-slate-500 mt-2 text-lg font-light">
                {content.subtitle}
              </p>
            </div>
            <div className="hidden md:block text-[10px]  text-slate-300 uppercase tracking-[0.5em]">
              {content.batch_label}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 100}>
              <Link
                to={`/blog/${post.id}`}
                className="group block h-full flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-brand-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
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
                  <h3 className="text-2xl font-bold text-slate-950 mb-6 leading-tight group-hover:text-brand-800 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-slate-900 text-sm leading-relaxed line-clamp-2 mb-10 text-start">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover:text-brand-600 transition-colors">
                      {content.access_label}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-brand-600 group-hover:text-brand-600 transition-all ${dir === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                    >
                      <i
                        className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-[10px]`}
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
