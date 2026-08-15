import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareEngagement({categoryContent}: Props) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            {categoryContent?.engagement_title}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryContent?.engagement_models?.map(
            (model: any, idx: number) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="text-center p-8 bg-white border border-slate-100 rounded-2xl hover:border-brand-200 transition-colors">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {model.title}
                  </h3>
                  <p className="text-slate-900 text-sm">{model.desc}</p>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
