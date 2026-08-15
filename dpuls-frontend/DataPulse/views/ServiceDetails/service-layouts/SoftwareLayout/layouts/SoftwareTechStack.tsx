import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareTechStack({categoryContent}: Props) {
  return (
    <section className="py-24 border-b border-slate-100">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              {categoryContent?.tech_stack_title}
            </h2>
            <p className="text-slate-900">
              {categoryContent?.tech_stack_subtitle}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryContent?.tech_stack_groups?.map(
            (group: any, idx: number) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="border-t-4 border-brand-500 pt-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">
                    {group.name}
                  </h3>
                  <ul className="space-y-3">
                    {group.items.map((tech: string) => (
                      <li
                        key={tech}
                        className="text-black text-sm flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
