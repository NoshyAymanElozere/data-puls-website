import React from "react";
import {Link} from "@/components/RouterShim";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";
import {ServiceItem} from "../../data/services";

interface Props {
  relatedServices: ServiceItem[];
  categoryContent: any;
}

export default function CloudRelatedServices({
  relatedServices,
  categoryContent,
}: Props) {
  const {dir} = useLanguage();
  const relatedItems = categoryContent?.related?.items || [];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">
              {categoryContent?.related?.title}
            </h2>
            <Link
              to="/services"
              className="text-brand-600 font-bold text-sm hover:underline"
            >
              {categoryContent?.related?.view_all}
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedItems.map((item: any, idx: number) => (
            <Reveal key={item.slug} delay={idx * 100}>
              <Link
                to={`/services/${item.slug}`}
                className="block group bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-brand-600 group-hover:text-white transition-colors mb-4">
                  <i className={`fa-solid fa-${item.icon}`}></i>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mt-4">
                  <span>
                    {categoryContent?.related?.learn_more ||
                      categoryContent?.related?.configure}
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
