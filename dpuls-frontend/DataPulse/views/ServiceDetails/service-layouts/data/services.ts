
export interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
}

export interface ServiceItem {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  category: string;
  slug: string;
}

// Extended details for the individual pages
export interface ServiceDetailContent {
  features: string[];
  benefits: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
}

export const categories: ServiceCategory[] = [
  { id: 'Software', label: 'Software Services', icon: 'fa-solid fa-code' },
  { id: 'AI', label: 'AI & Automation', icon: 'fa-solid fa-brain' },
  { id: 'Marketing', label: 'Marketing Services', icon: 'fa-solid fa-bullhorn' },
  { id: 'Cloud', label: 'Cloud & Hosting', icon: 'fa-solid fa-cloud' }
];

export const services: ServiceItem[] = [
  // Software Services
  { id: '01', titleKey: 'software.web', descKey: 'software.web', icon: 'fa-solid fa-code', category: 'Software', slug: 'custom-web-development' },
  { id: '02', titleKey: 'software.mobile', descKey: 'software.mobile', icon: 'fa-solid fa-mobile-screen', category: 'Software', slug: 'mobile-app-development' },
  { id: '03', titleKey: 'software.saas', descKey: 'software.saas', icon: 'fa-solid fa-layer-group', category: 'Software', slug: 'saas-engineering' },
  { id: '04', titleKey: 'software.erp', descKey: 'software.erp', icon: 'fa-solid fa-building-columns', category: 'Software', slug: 'enterprise-erp' },
  { id: '05', titleKey: 'software.api', descKey: 'software.api', icon: 'fa-solid fa-network-wired', category: 'Software', slug: 'api-integration' },
  { id: '06', titleKey: 'software.legacy', descKey: 'software.legacy', icon: 'fa-solid fa-rotate', category: 'Software', slug: 'legacy-modernization' },
  
  // AI & Automation
  { id: '07', titleKey: 'ai.ml', descKey: 'ai.ml', icon: 'fa-solid fa-brain', category: 'AI', slug: 'machine-learning' },
  { id: '08', titleKey: 'ai.rpa', descKey: 'ai.rpa', icon: 'fa-solid fa-robot', category: 'AI', slug: 'robotic-process-automation' },
  { id: '09', titleKey: 'ai.nlp', descKey: 'ai.nlp', icon: 'fa-solid fa-comments', category: 'AI', slug: 'natural-language-processing' },
  { id: '10', titleKey: 'ai.vision', descKey: 'ai.vision', icon: 'fa-solid fa-eye', category: 'AI', slug: 'computer-vision' },
  { id: '11', titleKey: 'ai.predictive', descKey: 'ai.predictive', icon: 'fa-solid fa-chart-line', category: 'AI', slug: 'predictive-analytics' },
  { id: '12', titleKey: 'ai.genai', descKey: 'ai.genai', icon: 'fa-solid fa-wand-magic-sparkles', category: 'AI', slug: 'generative-ai' },

  // Marketing Services
  { id: '13', titleKey: 'marketing.seo', descKey: 'marketing.seo', icon: 'fa-solid fa-magnifying-glass-chart', category: 'Marketing', slug: 'seo-optimization' },
  { id: '14', titleKey: 'marketing.social', descKey: 'marketing.social', icon: 'fa-solid fa-share-nodes', category: 'Marketing', slug: 'social-media' },
  { id: '15', titleKey: 'marketing.ads', descKey: 'marketing.ads', icon: 'fa-solid fa-bullhorn', category: 'Marketing', slug: 'performance-marketing' },
  { id: '16', titleKey: 'marketing.content', descKey: 'marketing.content', icon: 'fa-solid fa-pen-nib', category: 'Marketing', slug: 'content-strategy' },
  { id: '17', titleKey: 'marketing.email', descKey: 'marketing.email', icon: 'fa-solid fa-envelope-open-text', category: 'Marketing', slug: 'email-automation' },
  { id: '18', titleKey: 'marketing.brand', descKey: 'marketing.brand', icon: 'fa-solid fa-palette', category: 'Marketing', slug: 'brand-identity' },

  // Cloud & Hosting
  { id: '19', titleKey: 'cloud.infra', descKey: 'cloud.infra', icon: 'fa-solid fa-cloud', category: 'Cloud', slug: 'cloud-infrastructure' },
  { id: '20', titleKey: 'cloud.hosting', descKey: 'cloud.hosting', icon: 'fa-solid fa-server', category: 'Cloud', slug: 'managed-hosting' },
  { id: '21', titleKey: 'cloud.security', descKey: 'cloud.security', icon: 'fa-solid fa-shield-halved', category: 'Cloud', slug: 'cybersecurity' },
  { id: '22', titleKey: 'cloud.devops', descKey: 'cloud.devops', icon: 'fa-solid fa-infinite', category: 'Cloud', slug: 'devops-engineering' },
  { id: '23', titleKey: 'cloud.serverless', descKey: 'cloud.serverless', icon: 'fa-solid fa-bolt', category: 'Cloud', slug: 'serverless-architecture' },
  { id: '24', titleKey: 'cloud.recovery', descKey: 'cloud.recovery', icon: 'fa-solid fa-house-medical', category: 'Cloud', slug: 'disaster-recovery' },
];

// Helper to generate mock detailed content based on the service
export const getServiceDetails = (service: ServiceItem): ServiceDetailContent => {
  // In a real app, this would be fetched or translated individually
  // Here we generate distinct structures based on category to maintain the illusion of depth
  
  if (service.category === 'Software') {
    return {
      features: ['Microservices Architecture', 'High-Availability Design', 'Enterprise-Grade Security', 'Real-time Data Processing', 'Cross-Platform Compatibility'],
      benefits: [
        { title: 'Scalability', desc: 'Systems designed to handle millions of requests without degradation.' },
        { title: 'Maintainability', desc: 'Clean, modular codebases that are easy to update and extend.' },
        { title: 'Performance', desc: 'Optimized logic ensuring sub-100ms response times.' }
      ],
      process: [
        { step: '01', title: 'Requirement Analysis', desc: 'Deep dive into technical constraints and business logic.' },
        { step: '02', title: 'System Architecture', desc: 'Blueprinting the database, API layer, and frontend services.' },
        { step: '03', title: 'Agile Development', desc: 'Two-week sprints with continuous integration and delivery.' },
        { step: '04', title: 'QA & Deployment', desc: 'Rigorous automated testing before production rollout.' }
      ]
    };
  }
  
  if (service.category === 'AI') {
    return {
      features: ['Neural Network Optimization', 'Real-time Inference', 'Adaptive Learning Models', 'Data Sanitization Pipelines', 'Ethical AI Guardrails'],
      benefits: [
        { title: 'Automation', desc: 'Reduce manual workload by 80% through intelligent agents.' },
        { title: 'Insight', desc: 'Discover patterns in data invisible to the human eye.' },
        { title: 'Prediction', desc: 'Forecast trends with high accuracy to stay ahead of the market.' }
      ],
      process: [
        { step: '01', title: 'Data Ingestion', desc: 'Aggregating and cleaning structured and unstructured data.' },
        { step: '02', title: 'Model Training', desc: 'Selecting and tuning algorithms for maximum accuracy.' },
        { step: '03', title: 'Validation', desc: 'Testing against real-world scenarios to ensure robustness.' },
        { step: '04', title: 'Integration', desc: 'Embedding the model into your existing software ecosystem.' }
      ]
    };
  }

  if (service.category === 'Marketing') {
    return {
      features: ['Audience Segmentation', 'Omnichannel Campaigns', 'Conversion Rate Optimization', 'Visual Storytelling', 'Analytics & Reporting'],
      benefits: [
        { title: 'Visibility', desc: 'Dominate search results and social feeds.' },
        { title: 'Engagement', desc: 'Create meaningful connections with your target demographic.' },
        { title: 'ROI', desc: 'Measurable returns on every dollar of ad spend.' }
      ],
      process: [
        { step: '01', title: 'Discovery', desc: 'Understanding your brand voice and market position.' },
        { step: '02', title: 'Strategy', desc: 'Crafting a roadmap to reach and convert your audience.' },
        { step: '03', title: 'Execution', desc: 'Launching campaigns across selected high-impact channels.' },
        { step: '04', title: 'Optimization', desc: 'Continuous A/B testing to improve performance over time.' }
      ]
    };
  }

  // Cloud
  return {
    features: ['Auto-Scaling Groups', 'Geo-Redundancy', 'Serverless Functions', 'Container Orchestration', 'Infrastructure as Code'],
    benefits: [
      { title: 'Uptime', desc: 'Guaranteed 99.99% availability SLAs.' },
      { title: 'Security', desc: 'Bank-grade encryption at rest and in transit.' },
      { title: 'Cost Efficiency', desc: 'Pay only for the resources you actually use.' }
    ],
    process: [
      { step: '01', title: 'Audit', desc: 'Analyzing current infrastructure for bottlenecks.' },
      { step: '02', title: 'Migration Plan', desc: 'Zero-downtime strategy to move workloads to the cloud.' },
      { step: '03', title: 'Implementation', desc: 'Provisioning environments using Terraform/Ansible.' },
      { step: '04', title: 'Management', desc: '24/7 monitoring and automated incident response.' }
    ]
  };
};
