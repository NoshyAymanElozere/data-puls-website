import React from "react";
import { Reveal } from "../../../components/Reveal";

interface IndexItem {
  id: string;
  label: string;
}

interface BlogDetailContentProps {
  content: {
    index_label: string;
    node_prefix: string;
    quote: string;
    section1_title: string;
    section1_p1: string;
    section1_p2: string;
    section1_strong: string;
    section1_p2_cont: string;
    callout_label: string;
    callout_text: string;
    section2_title: string;
    section2_p1: string;
    index?: IndexItem[];
  };
}

export default function BlogDetailContent({ content }: BlogDetailContentProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-32 bg-white relative overflow-visible">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28 space-y-20 py-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-600 mb-8 block border-l-2 border-brand-600 pl-4">
                  {content.index_label}
                </span>
                <nav className="flex flex-col gap-6">
                  {content.index?.map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="group flex items-center gap-4 cursor-pointer"
                    >
                      <div className="w-6 h-px bg-slate-200 group-hover:w-12 group-hover:bg-brand-600 transition-all"></div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                        {content.node_prefix}0{i + 1}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-brand-600 transition-colors hidden xl:block">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="p-8 bg-slate-50 border-l-4 border-brand-800 rounded-tr-3xl shadow-sm">
                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                  {content.quote}
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-7 space-y-20">
            <Reveal>
              <div
                id="infrastructure-trap"
                className="prose prose-slate prose-2xl max-w-none scroll-mt-24"
              >
                <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-10">
                  {content.section1_title}
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-light mb-10">
                  {content.section1_p1}
                </p>
                <p className="text-xl text-slate-600 leading-relaxed font-light">
                  {content.section1_p2}{" "}
                  <strong>{content.section1_strong}</strong>
                  {content.section1_p2_cont}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div
                id="architectural-core"
                className="bg-brand-950 text-white p-12 lg:p-20 rounded-[4rem] relative overflow-hidden group scroll-mt-24"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <i className="fa-solid fa-code-merge text-9xl"></i>
                </div>
                <div className="relative z-10">
                  <span className="text-brand-400  text-[10px] uppercase tracking-[0.5em] mb-8 block">
                    {content.callout_label}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight leading-none italic">
                    {content.callout_text}
                  </h3>
                  <div className="w-20 h-1 bg-brand-500"></div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div
                id="logic-kernels"
                className="prose prose-slate prose-2xl max-w-none scroll-mt-24"
              >
                <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-10">
                  {content.section2_title}
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-light">
                  {content.section2_p1}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
