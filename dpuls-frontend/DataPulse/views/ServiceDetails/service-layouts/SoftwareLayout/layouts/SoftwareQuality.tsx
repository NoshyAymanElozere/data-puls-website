import React from "react";
import {Reveal} from "../../../../../components/Reveal";

interface Props {
  categoryContent: any;
}

export default function SoftwareQuality({categoryContent}: Props) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {categoryContent?.quality_title}
            </h2>
            <p className="text-lg text-slate-900 mb-8">
              {categoryContent?.quality_desc}
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 text-xl">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    {categoryContent?.quality?.secure?.title}
                  </h4>
                  <p className="text-sm text-slate-900">
                    {categoryContent?.quality?.secure?.desc}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 text-xl">
                  <i className="fa-solid fa-vial-circle-check"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    {categoryContent?.quality?.qa?.title}
                  </h4>
                  <p className="text-sm text-slate-900">
                    {categoryContent?.quality?.qa?.desc}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            {/* Pseudo-terminal Graphic */}
            <div className="bg-slate-900 rounded-lg p-6  text-sm shadow-2xl">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-green-400">
                {categoryContent?.quality?.terminal?.run}
              </div>
              <div className="text-slate-400 mt-2">
                {categoryContent?.quality?.terminal?.init}
              </div>
              <div className="text-slate-400">
                {categoryContent?.quality?.terminal?.deps} [OK]
              </div>
              <div className="text-slate-400">
                {categoryContent?.quality?.terminal?.encrypt} [OK]
              </div>
              <div className="text-slate-400">
                {categoryContent?.quality?.terminal?.pen} [OK]
              </div>
              <div className="text-green-400 mt-4">
                {categoryContent?.quality?.terminal?.complete}
              </div>
              <div className="text-white mt-4 border-t border-slate-700 pt-2">
                {categoryContent?.quality?.terminal?.status_label}
                <span className="text-green-400">
                  {categoryContent?.quality?.terminal?.status_value}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
