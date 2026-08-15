export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client?: string;
  year?: string;
  role?: string;
  image: string;
  liveUrl?: string;
  shortDesc: string;
  tags: string[];
  strategyImage?: string;
  experienceImage?: string;
  featuresImage?: string;
  designImage?: string;
  deviceLarge?: string;
  deviceSmall?: string;

  overview?: {
    about: string;
    goal: string;
    audience: string;
  };
  challenge?: {
    description: string;
    points: string[];
  };
  solution?: {
    description: string;
    approach: string;
  };
  features?: {
    title: string;
    desc: string;
    icon: string;
  }[];
  design?: {
    philosophy: string;
    colors: string[];
    typography: string;
  };
  techStack?: string[];
  structure?: string[];
  results?: {
    impact: string;
    metrics: {label: string; value: string}[];
  };
  gallery?: string[];
  // AI Specific Fields
  aiSpec?: {
    modelType: string;
    accuracy: string;
    inferenceTime: string;
    trainingData: string;
    architectureTitle: string;
    logicPoints: {title: string; desc: string}[];
  };
  // Marketing Specific Fields
  marketingSpec?: {
    positioning: string;
    narrative: string;
    audienceSegments: {name: string; insight: string}[];
    channels: {name: string; role: string}[];
    growthLevers: string[];
  };
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "2",
    title: "HealthCare System",
    category: "Mobile",
    client: "MediCore Solutions",
    year: "2024",
    role: "Mobile Architecture",
    image: "https://picsum.photos/800/1000?random=2",
    shortDesc: "Patient monitoring and telemedicine app.",
    tags: ["Flutter", "IoT"],
    overview: {
      about:
        "A next-generation telemedicine platform connecting patients and practitioners with real-time vital telemetry.",
      goal: "To provide high-fidelity monitoring outside of hospital environments.",
      audience: "Chronic care patients and specialized medical teams.",
    },
    challenge: {
      description:
        "Ensuring consistent data synchronization across regions with varying network stability while maintaining medical-grade privacy.",
      points: [
        "Real-time vital streaming with zero packet loss",
        "Compliance with global HIPAA and GDPR regulations",
        "Intuitive interface for elderly demographic usage",
      ],
    },
    features: [
      {
        title: "IoT Telemetry",
        desc: "Real-time patient vital stream via low-latency MQTT protocols.",
        icon: "fa-heart-pulse",
      },
      {
        title: "End-to-End Encryption",
        desc: "Military-grade AES-256 encryption for all medical data.",
        icon: "fa-user-shield",
      },
      {
        title: "Offline-First Sync",
        desc: "Advanced CRDT logic for seamless data merging after reconnections.",
        icon: "fa-cloud-arrow-down",
      },
      {
        title: "Bio-Auth Gateway",
        desc: "Secure biometric entry using native iOS FaceID and Android Biometrics.",
        icon: "fa-fingerprint",
      },
      {
        title: "Tele-Consultation",
        desc: "WebRTC-powered high-definition video calls optimized for low bandwidth.",
        icon: "fa-video",
      },
      {
        title: "AI Diagnostics",
        desc: "Edge-AI models for preliminary vital anomaly detection.",
        icon: "fa-brain",
      },
    ],
    design: {
      philosophy:
        "Clean, clinical, yet approachable. High contrast for readability and oversized touch targets.",
      colors: ["#ffffff", "#2563eb", "#10b981", "#f8fafc"],
      typography: "Inter (UI) & SF Pro",
    },
    techStack: [
      "Flutter",
      "Dart",
      "Go (Backend)",
      "MQTT",
      "WebRTC",
      "Firebase",
    ],
    results: {
      impact:
        "Reduced emergency room visits by 35% through proactive remote monitoring alerts.",
      metrics: [
        {label: "Patient Retention", value: "92%"},
        {label: "Sync Latency", value: "<200ms"},
        {label: "App Store Rating", value: "4.9/5"},
      ],
    },
    gallery: [
      "https://picsum.photos/800/1600?random=201",
      "https://picsum.photos/800/1600?random=202",
      "https://picsum.photos/800/1600?random=203",
    ],
  },
  {
    id: "3",
    title: "Nexus Analytics",
    category: "AI",
    client: "Nexus Financial",
    year: "2024",
    role: "ML Architecture",
    image: "https://picsum.photos/1600/1200?random=30",
    shortDesc:
      "Deep-learning engine for high-frequency fraud detection and risk modeling.",
    tags: ["PyTorch", "Nvidia CUDA", "FastAPI"],
    aiSpec: {
      modelType: "Transformer-based LSTM Network",
      accuracy: "99.4%",
      inferenceTime: "14ms",
      trainingData: "4.2TB Historical Ledger Data",
      architectureTitle: "Bimodal Neural Gateway",
      logicPoints: [
        {
          title: "Temporal Analysis",
          desc: "Identifying anomalous sequences across 10k+ concurrent transactions.",
        },
        {
          title: "Semantic Risk",
          desc: "Processing natural language metadata for context-aware validation.",
        },
        {
          title: "Explainable AI",
          desc: "SHAP-based decision visualization for regulatory compliance.",
        },
      ],
    },
    overview: {
      about:
        "Nexus Analytics is an industrial-scale intelligence layer for banking infrastructures. It processes millions of transaction events per second to flag potential fraud with sub-millisecond precision.",
      goal: "To eliminate manual auditing bottlenecks and reduce false-positive rates by 60%.",
      audience:
        "Risk officers, compliance teams, and enterprise security architects.",
    },
    challenge: {
      description:
        "The primary friction was the high volume of false positives generated by legacy rule-based systems, leading to human fatigue and operational lag.",
      points: [
        "Data drift in high-velocity financial environments",
        "Complex multi-dimensional fraud patterns",
        'Regulatory requirement for "explainable" automated decisions',
      ],
    },
    features: [
      {
        title: "Drift Detection",
        desc: "Automated re-training triggers when model performance deviates from baselines.",
        icon: "fa-chart-area",
      },
      {
        title: "XAI Visualizer",
        desc: "Human-readable explanations for every high-risk flag generated.",
        icon: "fa-eye",
      },
      {
        title: "Vector Storage",
        desc: "Low-latency embeddings storage for rapid similarity searches.",
        icon: "fa-database",
      },
      {
        title: "Hybrid Engine",
        desc: "Combining neural networks with classic rule-based guardrails.",
        icon: "fa-gears",
      },
    ],
    results: {
      impact:
        "The platform successfully identified $12M in potential fraud within the first quarter of deployment.",
      metrics: [
        {label: "False Positives", value: "-64%"},
        {label: "Processing Speed", value: "3x"},
        {label: "F1-Score", value: "0.985"},
      ],
    },
    gallery: [
      "https://picsum.photos/1600/1000?random=401",
      "https://picsum.photos/1600/1000?random=402",
    ],
    techStack: ["PyTorch", "Docker", "Redis", "Kafka", "Nvidia CUDA"],
  },
  {
    id: "4",
    title: "Horizon Launch",
    category: "Marketing",
    client: "Horizon EVs",
    year: "2024",
    role: "Growth Strategy",
    image: "https://picsum.photos/1600/1200?random=44",
    shortDesc:
      "Multi-market penetration strategy for premium electric mobility.",
    tags: ["Brand Strategy", "Performance Marketing", "Growth"],
    marketingSpec: {
      positioning: "Sustainable Luxury for the Next Generation",
      narrative: "Moving Beyond the Machine",
      audienceSegments: [
        {
          name: "Eco-conscious Executives",
          insight: "Values prestige as much as sustainability.",
        },
        {
          name: "Tech Early Adopters",
          insight: "Motivated by integration and proprietary tech.",
        },
      ],
      channels: [
        {
          name: "Immersive Social",
          role: "Upper-funnel awareness and lifestyle mapping.",
        },
        {
          name: "Strategic Search",
          role: "Capturing high-intent purchase demand.",
        },
      ],
      growthLevers: [
        "Referral Loops",
        "Community Governance",
        "Scarcity Dynamics",
      ],
    },
    overview: {
      about:
        'Horizon EVs required a launch strategy that bypassed the commodity "green" messaging of competitors to establish a new category of "Performative Sustainability".',
      goal: "Achieve 10k pre-orders across EMEA markets within 90 days.",
      audience:
        "High-net-worth individuals aged 30-50 across major European metros.",
    },
    challenge: {
      description:
        'The luxury EV market is saturated with established legacy brands. Horizon needed to build deep trust and "want" without the 100-year heritage of its competitors.',
      points: [
        "Overcoming brand skepticism in the premium segment.",
        "Converting awareness into tangible pre-order commitment.",
        "Maintaining a unified narrative across 12 distinct cultural markets.",
      ],
    },
    results: {
      impact:
        "The Horizon Launch broke sector records for lowest CPA (Cost Per Acquisition) in the luxury category.",
      metrics: [
        {label: "Pre-order Target", value: "142%"},
        {label: "Brand Lift", value: "+38%"},
        {label: "Market Share", value: "4.2%"},
      ],
    },
    gallery: [
      "https://picsum.photos/1600/1000?random=501",
      "https://picsum.photos/1600/1000?random=502",
      "https://picsum.photos/1600/1000?random=503",
    ],
  },
  {
    id: "12",
    title: "Motaqaed",
    category: "Web",
    client: "Motaqaed Social Initiative",
    year: "2025",
    role: "Social Impact Platform Development",
    image: "/assets/images/projects/website/motaqaed/1.png",
    liveUrl: "https://motaqad.com/",
    shortDesc:
      "A specialized service bridge connecting retirees with a curated ecosystem of providers and social benefits.",
    tags: ["Full Stack", "Social Impact", "Service Marketplace"],
    overview: {
      about:
        "Motaqaed is a social-centric platform re-imagining life after retirement. It serves as a comprehensive hub where seniors can access healthcare, financial advisory, and leisure services specifically tailored to their needs, all provided by trusted partners.",
      goal: "To enhance the quality of life for retirees by simplifying access to essential services and fostering a supportive digital community.",
      audience:
        "Retired professionals, senior citizens, and service providers catering to the needs of the elderly.",
    },
    challenge: {
      description:
        "Designing for seniors required a unique approach to accessibility and intuitive UI. The challenge was to integrate diverse service providers into a unified, easy-to-use interface that doesn't overwhelm the user.",
      points: [
        "High-accessibility interface design",
        "Secure provider verification system",
        "Unified service booking workflow",
      ],
    },
    solution: {
      description:
        "We built a high-accessibility web portal featuring large typography, high-contrast modes, and a simplified navigation structure. The backend includes a robust provider management system and secure payout integrations.",
      approach:
        "Human-centric design focused on the specific digital habits and needs of the retired community.",
    },
    features: [
      {
        title: "Service Marketplace",
        desc: "Browse and book healthcare, legal, and lifestyle services from verified providers.",
        icon: "fa-hand-holding-heart",
      },
      {
        title: "Privilege Card",
        desc: "Digital membership card offering exclusive discounts and priority access.",
        icon: "fa-id-card",
      },
      {
        title: "Community Hub",
        desc: "Social forums and event calendars focused on senior engagement and networking.",
        icon: "fa-users",
      },
      {
        title: "Health Tracker",
        desc: "Integrated health monitoring and appointment reminders for peace of mind.",
        icon: "fa-heart-pulse",
      },
    ],
    design: {
      philosophy:
        "Empathic, clear, and reassuring. Focus on high readability, large touch targets, and a calming color palette.",
      colors: ["#0b1021", "#10b981", "#3b82f6", "#f8f9fa"],
      typography: "Outfit & IBM Plex Sans",
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Tailwind CSS",
      "Radix UI",
    ],
    results: {
      impact:
        "Onboarded 500+ service providers and served over 10,000 retirees in the first quarter.",
      metrics: [
        {label: "Inclusion Score", value: "98%"},
        {label: "Provider Quality", value: "4.9/5"},
        {label: "Active Users", value: "10k+"},
      ],
    },
    gallery: [
      "/assets/images/projects/website/motaqaed/1.png",
      "/assets/images/projects/website/motaqaed/4.png",
      "/assets/images/projects/website/motaqaed/5.png",
      "/assets/images/projects/website/motaqaed/6.png",
      "/assets/images/projects/website/motaqaed/7.png",
      "/assets/images/projects/website/motaqaed/8.png",
      "/assets/images/projects/website/motaqaed/9.png",
      "/assets/images/projects/website/motaqaed/10.png",
      "/assets/images/projects/website/motaqaed/11.png",
    ],
  },
  {
    id: "13",
    title: "Gold Station",
    category: "Web",
    client: "Gold Station Co.",
    year: "2025",
    role: "Full Stack E-commerce Development",
    image: "/assets/images/projects/website/gold-station/1.png",
    liveUrl: "#",
    shortDesc:
      "A premium multi-platform e-commerce solution for the luxury jewelry and gold market, featuring live price synchronization.",
    tags: ["E-commerce", "FinTech", "Luxury Design"],
    overview: {
      about:
        "Gold Station is a state-of-the-art e-commerce ecosystem designed for the high-end jewelry market. It combines a sophisticated shopping experience with real-time financial data, allowing users to buy gold and diamonds at current global market rates with absolute security.",
      goal: "To provide a secure, transparent, and luxurious digital shopping experience for gold and diamond investors and jewelry enthusiasts.",
      audience:
        "Jewelry collectors, gold investors, luxury shoppers, and diamond seekers.",
    },
    challenge: {
      description:
        "The primary challenge was integrating a live global gold price API to update product pricing every minute, ensuring accuracy and trust. Additionally, the UI needed to convey absolute luxury and security.",
      points: [
        "Real-time gold price synchronization",
        "High-value transaction security",
        "Immersive high-resolution visual display",
      ],
    },
    solution: {
      description:
        "We developed a custom pricing engine that calculates jewelry costs based on live metal weights and diamond certifications. The UI utilizes a 'Midnight & Gold' aesthetic to mirror the physical store's premium feel.",
      approach:
        "Luxury-first design combined with high-performance real-time data processing.",
    },
    features: [
      {
        title: "Live Price Ticker",
        desc: "Real-time global market rates for 18k, 21k, and 24k gold bullion.",
        icon: "fa-chart-line",
      },
      {
        title: "Diamond Lab Certs",
        desc: "Digital GIA/IGI certificates integrated directly into product pages.",
        icon: "fa-gem",
      },
      {
        title: "Secure Vault Pay",
        desc: "Multi-encrypted payment gateway for multi-thousand dollar transactions.",
        icon: "fa-shield-halved",
      },
      {
        title: "Custom Jeweler",
        desc: "Interactive 3D configurator for building custom diamond rings.",
        icon: "fa-screwdriver-wrench",
      },
    ],
    design: {
      philosophy:
        "Elegance and Authority. Using high-contrast dark themes with golden accents to emphasize product value and brand heritage.",
      colors: ["#000000", "#D4AF37", "#FFFFFF", "#1A1A1A"],
      typography: "Playfair Display & Inter",
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
      "Three.js",
    ],
    results: {
      impact:
        "Achieved $1.5M in sales within the first month of launch with a 4.8/5 customer satisfaction rating.",
      metrics: [
        {label: "Conversion Rate", value: "3.5%"},
        {label: "Avg. Order Value", value: "$1,200"},
        {label: "System Uptime", value: "99.99%"},
      ],
    },
    gallery: [
      "/assets/images/projects/website/gold-station/1.png",
      "/assets/images/projects/website/gold-station/4.png",
      "/assets/images/projects/website/gold-station/5.png",
      "/assets/images/projects/website/gold-station/6.png",
      "/assets/images/projects/website/gold-station/7.png",
      "/assets/images/projects/website/gold-station/8.png",
      "/assets/images/projects/website/gold-station/9.png",
      "/assets/images/projects/website/gold-station/10.png",
      "/assets/images/projects/website/gold-station/11.png",
    ],
  },
  {
    id: "14",
    title: "Prometer",
    category: "Software",
    client: "Prometer Solutions",
    year: "2025",
    role: "Enterprise System Architecture",
    image: "/assets/images/projects/systems/prometer/3.png",
    liveUrl: "#",
    shortDesc:
      "An all-in-one enterprise ecosystem for tracking personnel, managing logistics, and streamlining customer relations.",
    tags: ["Enterprise", "Logistics", "CRM"],
    overview: {
      about:
        "Prometer is an industrial-grade enterprise platform engineered to solve complex operational challenges. It bridges the gap between field operations and administrative management by providing real-time tracking for both shipments and employees, integrated with a powerful CRM module.",
      goal: "To provide a unified command center for logistics companies to monitor their fleet, track employee performance, and maintain high-quality customer relationships.",
      audience:
        "Operations managers, fleet supervisors, HR departments, and customer support teams.",
    },
    challenge: {
      description:
        "The main technical hurdle was synchronizing high-frequency GPS data from thousands of field agents while maintaining a responsive CRM interface. We needed to ensure data integrity across multiple operational branches.",
      points: [
        "High-concurrency geolocation tracking",
        "Seamless integration of CRM with logistics data",
        "Real-time performance analytics for personnel",
      ],
    },
    solution: {
      description:
        "We developed a modular architecture using high-performance data streams and a distributed database system. The interface was optimized for rapid data entry and clear visual monitoring of field assets.",
      approach:
        "Data-driven operational management with a focus on real-time visibility and communication.",
    },
    features: [
      {
        title: "Personnel Tracking",
        desc: "Live GPS monitoring and shift management for field employees and delivery agents.",
        icon: "fa-user-clock",
      },
      {
        title: "Shipment Lifecycle",
        desc: "End-to-end tracking of goods with automated status updates and digital signatures.",
        icon: "fa-box-open",
      },
      {
        title: "Integrated CRM",
        desc: "Centralized database for client interactions, support tickets, and sales pipelines.",
        icon: "fa-users-gear",
      },
      {
        title: "Predictive Analytics",
        desc: "AI-powered insights into delivery times, workforce efficiency, and customer trends.",
        icon: "fa-brain",
      },
    ],
    design: {
      philosophy:
        "Functional, robust, and professional. Focus on data density without sacrificing clarity, using a high-contrast industrial palette.",
      colors: ["#000000", "#3b82f6", "#1e293b", "#f8f9fa"],
      typography: "Inter & IBM Plex Sans",
    },
    techStack: [
      "React",
      "TypeScript",
      "Node.js",
      "Redis",
      "PostgreSQL",
      "WebSocket",
    ],
    results: {
      impact:
        "Boosted operational efficiency by 35% and improved customer response times by 50% within the first six months.",
      metrics: [
        {label: "Tracking Accuracy", value: "99.8%"},
        {label: "Efficiency Gain", value: "+35%"},
        {label: "Uptime", value: "99.95%"},
      ],
    },
    gallery: [
      "/assets/images/projects/systems/prometer/1.png",
      "/assets/images/projects/systems/prometer/4.png",
      "/assets/images/projects/systems/prometer/5.png",
      "/assets/images/projects/systems/prometer/6.png",
      "/assets/images/projects/systems/prometer/7.png",
      "/assets/images/projects/systems/prometer/8.png",
      "/assets/images/projects/systems/prometer/9.png",
      "/assets/images/projects/systems/prometer/10.png",
      "/assets/images/projects/systems/prometer/11.png",
      "/assets/images/projects/systems/prometer/12.png",
      "/assets/images/projects/systems/prometer/13.png",
      "/assets/images/projects/systems/prometer/14.png",
      "/assets/images/projects/systems/prometer/15.png",
      "/assets/images/projects/systems/prometer/16.png",
      "/assets/images/projects/systems/prometer/17.png",
      "/assets/images/projects/systems/prometer/18.png",
      "/assets/images/projects/systems/prometer/19.png",
      "/assets/images/projects/systems/prometer/20.png",
    ],
  },
  {
    id: "15",
    title: "Humanex",
    category: "Software",
    client: "Humanex Global",
    year: "2025",
    role: "Full-Cycle HR Transformation",
    image: "/assets/images/projects/systems/humanex/1.png",
    liveUrl: "#",
    shortDesc:
      "An end-to-end Human Capital Management ecosystem digitizing the entire employee lifecycle from recruitment to retirement.",
    tags: ["Enterprise", "HR Tech", "SaaS"],
    overview: {
      about:
        "Humanex is a high-performance HR management suite built to handle the complexities of large-scale workforce administration. It integrates core HR functions, payroll automation, and strategic talent management into a unified, secure digital environment.",
      goal: "To empower HR departments with automated workflows and data-driven insights, reducing administrative overhead and enhancing the employee experience.",
      audience:
        "HR Directors, People Operations, CFOs, and employees seeking a seamless self-service experience.",
    },
    challenge: {
      description:
        "The challenge was creating a system that could handle diverse regional labor laws and complex payroll structures while remaining intuitive enough for every employee to use daily without training.",
      points: [
        "Regional law & tax compliance automation",
        "High-security handling of sensitive PII data",
        "Integration with legacy finger-print attendance hardware",
      ],
    },
    solution: {
      description:
        "We architected a flexible rule-based engine that adapts to various organizational structures. The interface was optimized for 'Task-Oriented' design, ensuring that common actions like leave requests or payroll viewing take less than three clicks.",
      approach:
        "Employee-centric design backed by a robust, secure enterprise infrastructure.",
    },
    features: [
      {
        title: "Automated Payroll",
        desc: "One-click payroll processing with automated tax calculations and direct bank integrations.",
        icon: "fa-money-check-dollar",
      },
      {
        title: "Smart Recruitment",
        desc: "AI-assisted applicant tracking system (ATS) with automated interview scheduling.",
        icon: "fa-user-plus",
      },
      {
        title: "Attendance 360",
        desc: "Geofenced mobile check-ins and seamless biometric hardware synchronization.",
        icon: "fa-clock-rotate-left",
      },
      {
        title: "Performance Hub",
        desc: "Continuous feedback loops, OKR tracking, and automated 360-degree evaluations.",
        icon: "fa-chart-line",
      },
    ],
    design: {
      philosophy:
        "Calm, trustworthy, and efficient. Avoids the 'form-heavy' look of traditional enterprise software by using whitespace and card-based layouts.",
      colors: ["#4f46e5", "#1e293b", "#ffffff", "#f1f5f9"],
      typography: "Outfit & Inter",
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
    results: {
      impact:
        "Reduced payroll processing time by 70% and increased employee engagement scores by 40% in pilot organizations.",
      metrics: [
        {label: "Time Saved", value: "70%"},
        {label: "Data Accuracy", value: "100%"},
        {label: "User Adoption", value: "95%"},
      ],
    },
    gallery: [
      "/assets/images/projects/systems/humanex/1.png",
      "/assets/images/projects/systems/humanex/3.png",
      "/assets/images/projects/systems/humanex/4.png",
      "/assets/images/projects/systems/humanex/5.png",
      "/assets/images/projects/systems/humanex/6.png",
      "/assets/images/projects/systems/humanex/7.png",
      "/assets/images/projects/systems/humanex/8.png",
      "/assets/images/projects/systems/humanex/9.png",
      "/assets/images/projects/systems/humanex/10.png",
      "/assets/images/projects/systems/humanex/11.png",
      "/assets/images/projects/systems/humanex/12.png",
    ],
  },
];
