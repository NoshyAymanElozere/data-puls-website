import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function MarketingGovernance({categoryContent}: Props) {
  const tags = categoryContent?.governance?.tags || [];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <Reveal>
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mx-auto mb-8">
            <i className="fa-solid fa-shield-halved text-2xl"></i>
          </div>
          <h2 className="text-3xl  font-bold mb-6">
            {categoryContent?.governance?.title}
          </h2>
          <p className="text-lg text-slate-900 mb-8">
            {categoryContent?.governance?.desc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-4 py-2 border rounded-full text-sm font-bold text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
