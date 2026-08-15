import App, {AppContext, AppProps} from "next/app";
import {LanguageProvider, useLanguage} from "@/components/LanguageContext";
import {Navbar, Footer, WhatsAppButton} from "@/components/Layout";
import footerEn from "../static-content/Footer/en.json";
import footerAr from "../static-content/Footer/ar.json";

type Language = "en" | "ar";

interface MyAppProps extends AppProps {
  initialLanguage: Language;
}

const MainLayout = ({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) => {
  const {language} = useLanguage();
  const footerContent = language === "ar" ? footerAr : footerEn;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Component {...pageProps} />
      <Footer content={footerContent} />
      <WhatsAppButton />
    </div>
  );
};

function MyApp({Component, pageProps, initialLanguage}: MyAppProps) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <MainLayout Component={Component} pageProps={pageProps} />
    </LanguageProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  let initialLanguage: Language = "ar";

  if (appContext.ctx.req?.headers.cookie) {
    const match =
      appContext.ctx.req.headers.cookie.match(/(^| )dp_lang=([^;]+)/);
    if (match) {
      const value = match[2];
      if (value === "ar") initialLanguage = "ar";
    }
  }

  return {...appProps, initialLanguage};
};

export default MyApp;
