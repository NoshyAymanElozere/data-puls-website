import React from "react";
import {Link} from "@/components/RouterShim";
import {useLanguage} from "./LanguageContext";

// Interfaces for component props
interface SectionProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id = "",
}) => (
  <section id={id} className={`py-20 md:py-32 ${className}`}>
    <div className="container mx-auto px-4 md:px-6">{children}</div>
  </section>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  center = false,
}) => (
  <div className={`mb-16 ${center ? "text-center max-w-3xl mx-auto" : ""}`}>
    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-black leading-relaxed">{subtitle}</p>
    )}
    <div
      className={`h-1.5 w-24 bg-brand-500 mt-6 rounded-full ${center ? "mx-auto" : ""}`}
    ></div>
  </div>
);

interface ButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  onClick,
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-[1.03] active:scale-[0.97]";
  const variants = {
    primary:
      "bg-brand-800 text-white hover:bg-brand-700 focus:ring-brand-800 shadow-lg shadow-brand-800/30 hover:shadow-brand-800/40",
    secondary:
      "bg-white text-brand-800 hover:bg-gray-50 focus:ring-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-brand-800 text-brand-800 hover:bg-brand-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({children, className = ""}) => (
  <div
    className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

interface BadgeProps {
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({children}) => (
  <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
    {children}
  </span>
);

interface AnimatedTextLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedTextLink: React.FC<AnimatedTextLinkProps> = ({
  to,
  children,
  className = "",
}) => {
  const {dir} = useLanguage();
  return (
    <Link to={to} className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute -bottom-0.5 h-[1.5px] bg-current transition-all duration-300 ease-out w-0 group-hover:w-full ${dir === "rtl" ? "right-0" : "left-0"}`}
      ></span>
    </Link>
  );
};
