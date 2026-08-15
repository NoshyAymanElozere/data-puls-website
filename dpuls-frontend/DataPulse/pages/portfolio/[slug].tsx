import PortfolioDetail from "@/views/PortfolioDetails/PortfolioDetails";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import portfolioAllEn from "../../static-content/Portfolio/All/en.json";

export default function PortfolioDetailsPage({ slug }: { slug: string }) {
  return (
    <>
      <Head>
        <title>Project Details | Data Pulse</title>
        <meta
          name="description"
          content="In-depth look at one of our featured projects and the solutions we provided."
        />
        <meta
          name="keywords"
          content="project details, case study, data pulse, software implementation"
        />
        <link rel="canonical" href={`https://datapulse.com/portfolio/${slug}/`} />
        <meta property="og:title" content="Project Details | Data Pulse" />
        <meta
          property="og:description"
          content="In-depth look at one of our featured projects and the solutions we provided."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://datapulse.com/portfolio/${slug}/`} />
      </Head>
      <PortfolioDetail slug={slug} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = portfolioAllEn.projects.map((project) => ({
    params: { slug: project.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      slug: params?.slug,
    },
  };
}
