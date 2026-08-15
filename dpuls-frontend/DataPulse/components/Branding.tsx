import React from "react";

interface LogoProps {
  className?: string;
}

import favIcon from "../assets/images/logo/fav.png";
import logoText from "../assets/images/logo/text.png";
import logoImage from "../assets/images/logo/logo.png";

export const LogoIcon: React.FC<LogoProps> = ({className = "w-10 h-auto"}) => (
  <img src={(favIcon as any).src} alt="Logo" className={className} />
);

export const LogoText: React.FC<LogoProps> = ({className = "h-auto"}) => (
  <img src={(logoText as any).src} alt="Logo" className={className} />
);
export const Logo: React.FC<LogoProps> = ({className = "h-auto"}) => (
  <img src={(logoImage as any).src} alt="Logo" className={className} />
);
