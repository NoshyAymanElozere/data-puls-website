import Blog from "@/views/Blog/Blog";
import Head from "next/head";

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog | Data Pulse</title>
        <meta
          name="description"
          content="Read our latest insights, news, and articles on technology, software development, and digital trends."
        />
        <meta
          name="keywords"
          content="blog, news, insights, technology, data pulse, software trends"
        />
        <link rel="canonical" href="https://datapulse.com/blog" />
        <meta property="og:title" content="Blog | Data Pulse" />
        <meta
          property="og:description"
          content="Read our latest insights, news, and articles on technology, software development, and digital trends."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datapulse.com/blog" />
      </Head>
      <Blog />
    </>
  );
}
