import Home from "@/views/Home/Home";
import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | Data Pulse</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Home />
    </>
  );
}
