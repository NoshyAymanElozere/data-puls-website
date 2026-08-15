import React, {useRef, useEffect} from "react";
import {useLanguage} from "../../../../components/LanguageContext";
import {PortfolioItem} from "../data/portfolio";

import CTA from "../../../Home/layouts/HomeCTA/HomeCTA";
import Services from "../../../Home/layouts/HomeServices/HomeServices";
import Contact from "../../../Home/layouts/HomeContact/HomeContact";
import Clients from "../../../Home/layouts/HomeClients/HomeClients";

import AIProjectHero from "./layouts/AIProjectHero";
import AIProjectContext from "./layouts/AIProjectContext";
import AIProjectProblem from "./layouts/AIProjectProblem";
import AIProjectStrategy from "./layouts/AIProjectStrategy";
import AIProjectSystem from "./layouts/AIProjectSystem";
import AIProjectTraining from "./layouts/AIProjectTraining";
import AIProjectArchitecture from "./layouts/AIProjectArchitecture";
import AIProjectDeployment from "./layouts/AIProjectDeployment";
import AIProjectPerformance from "./layouts/AIProjectPerformance";
import AIProjectIntegration from "./layouts/AIProjectIntegration";
import AIProjectResults from "./layouts/AIProjectResults";
import AIProjectGallery from "./layouts/AIProjectGallery";
import AIProjectRelated from "./layouts/AIProjectRelated";

interface Props {
  project: any;
  projectContent: any;
  content: any;
  allServices: any;
}

export default function AIProjectLayout({
  project,
  projectContent,
  content,
  allServices,
}: Props) {
  const {language} = useLanguage();

  // Select the specific AI project content based on language
  const aiContent =
    language === "ar" ? projectContent.ai_project : projectContent.ai_project;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-brand-900 selection:text-white">
      <AIProjectHero project={project} content={aiContent} />
      <AIProjectContext project={project} content={aiContent} />
      <AIProjectProblem project={project} content={aiContent} />
      <AIProjectStrategy content={aiContent} />
      <AIProjectSystem project={project} content={aiContent} />
      <AIProjectTraining project={project} content={aiContent} />
      <AIProjectArchitecture project={project} content={aiContent} />
      <AIProjectDeployment content={aiContent} />
      <AIProjectPerformance content={aiContent} />
      <AIProjectIntegration project={project} content={aiContent} />
      <AIProjectResults project={project} content={aiContent} />
      <AIProjectGallery project={project} content={aiContent} />
      <AIProjectRelated project={project} content={aiContent} />

      {/* Shared Footer Sections using Global Content */}
      <CTA content={content.ctaSection} />
      <Services
        services={allServices?.slice(0, 6) || []}
        content={content?.servicesSection?.services}
      />
      <Contact content={content.contactSection} />
      <Clients content={content.clientsSection} />
    </div>
  );
}
