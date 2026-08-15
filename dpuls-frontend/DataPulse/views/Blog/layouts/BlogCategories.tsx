import React from "react";

interface Category {
  id: string;
  label: string;
  key: string;
  icon: string;
}

interface BlogCategoriesProps {
  categories: Category[];
  activeCat: string;
  onCategoryChange: (catId: string) => void;
}

export default function BlogCategories({
  categories,
  activeCat,
  onCategoryChange,
}: BlogCategoriesProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center py-4 gap-2 md:gap-8 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
                activeCat === cat.id
                  ? "bg-brand-900 text-white shadow-lg scale-105"
                  : "text-slate-400 hover:text-brand-900 hover:bg-slate-50"
              }`}
            >
              <i
                className={`${cat.icon} text-sm ${activeCat === cat.id ? "text-brand-300" : "text-slate-300"}`}
              ></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
