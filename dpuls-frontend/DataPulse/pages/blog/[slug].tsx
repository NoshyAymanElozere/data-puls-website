import BlogDetail from "@/views/BlogDetails/BlogDetail";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { API_BASE_URL } from "@/config/api";

export default function BlogDetailPage({ slug }: { slug: string }) {
  return (
    <>
      <Head>
        <title>Blog Post | Data Pulse</title>
        <meta
          name="description"
          content="Read this article to learn more about the latest trends in technology and software solutions."
        />
        <meta
          name="keywords"
          content="blog post, article, data pulse, technology insights"
        />
        <link rel="canonical" href={`https://datapulse.com/blog/${slug}/`} />
        <meta property="og:title" content="Blog Post | Data Pulse" />
        <meta
          property="og:description"
          content="Read this article to learn more about the latest trends in technology and software solutions."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://datapulse.com/blog/${slug}/`} />
      </Head>
      <BlogDetail slug={slug} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`);
    if (res.ok) {
      const resJson = await res.json();
      if (resJson.success && Array.isArray(resJson.data)) {
        const paths = resJson.data.map((blog: any) => ({
          params: { slug: blog.slug || blog.id },
        }));
        return {
          paths,
          fallback: "blocking",
        };
      }
    }
  } catch (err) {
    console.warn("[getStaticPaths] Failed to fetch blogs from API, returning empty paths.", err);
  }

  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      slug: params?.slug,
    },
  };
};
