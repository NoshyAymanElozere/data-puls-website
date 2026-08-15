import React from "react";
import {Link} from "@/components/RouterShim";
import {useLanguage} from "../../../../../components/LanguageContext";
import {Reveal} from "../../../../../components/Reveal";
import {ServiceItem} from "../../data/services";

interface Props {
  relatedServices: ServiceItem[];
  categoryContent: any;
}

export default function AIRelatedServices({
  relatedServices,
  categoryContent,
}: Props) {
  const {dir} = useLanguage();
  const relatedItems = categoryContent?.related?.items || [];

  return (
    <section className="py-24 bg-[#020617]">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-2xl font-bold text-white mb-12">
            {categoryContent?.related?.title ||
              categoryContent?.labels?.related_capabilities}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedItems.map((item: any, idx: number) => (
            <Reveal key={item.slug} delay={idx * 100}>
              <Link
                to={`/services/${item.slug}`}
                className="block group bg-white/5 p-6 rounded-xl border border-white/10 hover:border-brand-500 hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 bg-brand-900 rounded-lg flex items-center justify-center text-brand-400 group-hover:text-white transition-colors mb-4">
                  <i className={`fa-solid fa-${item.icon}`}></i>
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mt-4 group-hover:text-brand-400 transition-colors">
                  <span>
                    {categoryContent?.related?.learn_more ||
                      categoryContent?.labels?.explore_module}
                  </span>
                  <i
                    className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"}`}
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
