import React, {useEffect} from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "@/components/RouterShim";
import {LanguageProvider, useLanguage} from "./components/LanguageContext";
import {Navbar, Footer} from "./components/Layout";
import Home from "./views/Home/Home";
import Services from "./views/Services/Services";
import ServiceDetail from "./views/ServiceDetails/ServiceDetail";
import Portfolio from "./views/Portfolio/Portfolio";
import PortfolioDetail from "./views/PortfolioDetails/PortfolioDetails";
import Contact from "./views/Contact/Contact";
import About from "./views/About/About";
import Blog from "./views/Blog/Blog";
import BlogDetail from "./views/BlogDetails/BlogDetail";

import footerEn from "./static-content/Footer/en.json";
import footerAr from "./static-content/Footer/ar.json";

const ScrollToTop = () => {
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const {language} = useLanguage();
  const footerContent = language === "ar" ? footerAr : footerEn;

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="*" element={<Home />} /> {/* Fallback to Home */}
          </Routes>
        </main>
        <Footer content={footerContent} />
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
