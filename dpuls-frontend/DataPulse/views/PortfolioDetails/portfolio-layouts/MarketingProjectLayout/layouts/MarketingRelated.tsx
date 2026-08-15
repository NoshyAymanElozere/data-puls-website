import React from "react";
import {Link} from "@/components/RouterShim";
import {Reveal} from "../../../../../components/Reveal";
import {portfolioItems, PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function MarketingRelated({project, content}: Props) {
  const relatedProjects = portfolioItems
    .filter((p) => p.category === "Marketing" && p.id !== project.id)
    .slice(0, 3);

  if (relatedProjects.length === 0) return null;

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-16">
            {content?.related?.title}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 border border-slate-100">
          {relatedProjects.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 100}>
              <Link
                to={`/portfolio/${item.id}`}
                className="block group bg-white p-12 hover:bg-slate-50 transition-all h-full"
              >
                <span className="block text-brand-600 font-bold text-[10px] uppercase mb-6 tracking-[0.4em]">
                  {content?.related?.subsystem_prefix}
                  {item.id}
                </span>
                <h3 className="text-3xl font-black text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tighter leading-none mb-6">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-900 font-medium leading-relaxed mb-10 line-clamp-2">
                  {item.shortDesc}
                </p>
                <div className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-brand-600 transition-colors">
                  <span>{content?.related?.cta}</span>
                  <div className="w-8 h-px bg-current"></div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
