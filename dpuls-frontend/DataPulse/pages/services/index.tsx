import Services from "@/views/Services/Services";
import Head from "next/head";

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Our Services | Data Pulse</title>
        <meta
          name="description"
          content="Explore our wide range of services including web development, mobile apps, and enterprise solutions."
        />
        <meta
          name="keywords"
          content="services, web development, mobile apps, enterprise solutions, cloud computing, data pulse"
        />
        <link rel="canonical" href="https://datapulse.com/services" />
        <meta property="og:title" content="Our Services | Data Pulse" />
        <meta
          property="og:description"
          content="Explore our wide range of services including web development, mobile apps, and enterprise solutions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datapulse.com/services" />
      </Head>
      <Services />
    </>
  );
}
