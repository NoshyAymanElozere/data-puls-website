import About from "@/views/About/About";
import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Data Pulse</title>
        <meta
          name="description"
          content="Learn more about Data Pulse, our mission, vision, and the team driving digital innovation."
        />
        <meta
          name="keywords"
          content="about us, data pulse, team, mission, vision, technology company"
        />
        <link rel="canonical" href="https://datapulse.com/about" />
        <meta property="og:title" content="About Us | Data Pulse" />
        <meta
          property="og:description"
          content="Learn more about Data Pulse, our mission, vision, and the team driving digital innovation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datapulse.com/about" />
      </Head>
      <About />
    </>
  );
}
