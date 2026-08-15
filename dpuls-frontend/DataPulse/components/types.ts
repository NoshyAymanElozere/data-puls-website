export type Language = 'en' | 'ar';

export interface NavLink {
  key: string;
  path: string;
}

export interface Service {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  descKey: string;
  tags: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  contentKey: string;
  image: string;
}

export interface PricingPlan {
  id: string;
  nameKey: string;
  priceKey: string;
  featuresKey: string[];
  popular?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}