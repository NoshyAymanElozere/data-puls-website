import Contact from "@/views/Contact/Contact";
import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Data Pulse</title>
        <meta
          name="description"
          content="Get in touch with Data Pulse for your software needs. We are ready to help you transform your business."
        />
        <meta
          name="keywords"
          content="contact, support, inquiry, data pulse, software consultation"
        />
        <link rel="canonical" href="https://datapulse.com/contact" />
        <meta property="og:title" content="Contact Us | Data Pulse" />
        <meta
          property="og:description"
          content="Get in touch with Data Pulse for your software needs. We are ready to help you transform your business."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datapulse.com/contact" />
      </Head>
      <Contact />
    </>
  );
}
