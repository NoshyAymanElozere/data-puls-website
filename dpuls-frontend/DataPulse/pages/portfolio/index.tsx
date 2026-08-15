import Portfolio from "@/views/Portfolio/Portfolio";
import Head from "next/head";

export default function PortfolioPage() {
  return (
    <>
      <Head>
        <title>Our Portfolio | Data Pulse</title>
        <meta
          name="description"
          content="Browse through our successful projects and case studies showcasing our expertise in software development."
        />
        <meta
          name="keywords"
          content="portfolio, projects, case studies, data pulse, success stories"
        />
        <link rel="canonical" href="https://datapulse.com/portfolio" />
        <meta property="og:title" content="Our Portfolio | Data Pulse" />
        <meta
          property="og:description"
          content="Browse through our successful projects and case studies showcasing our expertise in software development."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datapulse.com/portfolio" />
      </Head>
      <Portfolio />
    </>
  );
}
