import React from "react";
import {Link} from "@/components/RouterShim";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {portfolioItems, PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectRelated({project, content}: Props) {
  const {dir} = useLanguage();

  const relatedProjects = portfolioItems
    .filter((p) => p.category === "AI" && p.id !== project.id)
    .slice(0, 3);

  if (relatedProjects.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-2xl font-bold text-slate-900 mb-12 uppercase tracking-widest">
            {content?.related?.title}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedProjects.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 100}>
              <Link
                to={`/portfolio/${item.id}`}
                className="block group border border-slate-100 p-8 rounded-2xl hover:border-brand-500 hover:shadow-xl transition-all h-full bg-slate-50/50"
              >
                <span className="block text-brand-600  text-[10px] uppercase mb-4 tracking-widest">
                  {content?.related?.subsystem_prefix}
                  {item.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-900 line-clamp-2">
                  {item.shortDesc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                  <span>{content?.related?.cta}</span>
                  <i
                    className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-[10px]`}
                  ></i>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
