import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {useLanguage} from "../../../../../components/LanguageContext";

interface Props {
  categoryContent: any;
}

export default function CloudMigration({categoryContent}: Props) {
  const {dir} = useLanguage();
  const phases = categoryContent?.migration?.phases || [];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            {categoryContent?.migration?.title}
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-16">
            {categoryContent?.migration?.desc}
          </p>
        </Reveal>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center md:text-left">
          {phases.length > 0 && (
            <>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg w-full md:w-64">
                <div className="text-slate-400 text-xs font-bold uppercase mb-2">
                  {phases[0].step}
                </div>
                <h3 className="font-bold text-slate-900">{phases[0].title}</h3>
              </div>
              <i
                className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-slate-300 text-xl`}
              ></i>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg w-full md:w-64">
                <div className="text-slate-400 text-xs font-bold uppercase mb-2">
                  {phases[1].step}
                </div>
                <h3 className="font-bold text-slate-900">{phases[1].title}</h3>
              </div>
              <i
                className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} text-slate-300 text-xl`}
              ></i>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg w-full md:w-64">
                <div className="text-slate-400 text-xs font-bold uppercase mb-2">
                  {phases[2].step}
                </div>
                <h3 className="font-bold text-slate-900">{phases[2].title}</h3>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
