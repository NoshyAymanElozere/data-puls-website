import Home from "@/views/Home/Home";
import Head from "next/head";
import {useLanguage} from "@/components/LanguageContext";

export default function HomePage() {
  const {t} = useLanguage();
  return (
    <>
      <Head>
        <title>{t("metadata.home.title")}</title>
        <meta name="description" content={t("metadata.home.description")} />
        <meta
          name="keywords"
          content="software, enterprise, web development, digital transformation, data pulse"
        />
        <link rel="canonical" href="https://datapulse.com/" />
        <meta property="og:title" content={t("metadata.home.title")} />
        <meta
          property="og:description"
          content={t("metadata.home.description")}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datapulse.com/" />
      </Head>
      <Home />
    </>
  );
}
