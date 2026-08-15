import ServiceDetail from "@/views/ServiceDetails/ServiceDetail";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import servicesAllEn from "../../static-content/Services/All/en.json";

export default function ServiceDetailPage({ slug }: { slug: string }) {
  return (
    <>
      <Head>
        <title>Service Details | Data Pulse</title>
        <meta
          name="description"
          content="Detailed information about our specific service offerings tailored to your business needs."
        />
        <meta
          name="keywords"
          content="service details, solutions, data pulse, enterprise software"
        />
        <link rel="canonical" href={`https://datapulse.com/services/${slug}/`} />
        <meta property="og:title" content="Service Details | Data Pulse" />
        <meta
          property="og:description"
          content="Detailed information about our specific service offerings tailored to your business needs."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://datapulse.com/services/${slug}/`} />
      </Head>
      <ServiceDetail slug={slug} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = servicesAllEn.services.map((service) => ({
    params: { slug: service.slug },
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
