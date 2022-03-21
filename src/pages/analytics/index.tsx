import Head from "next/head";
import Analytics from "@app/components/products/Analytics/index";

export default function Home() {
  return (
    <>
      <Head>
        <title>OrbitAnalytics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Analytics></Analytics>
    </>
  );
}
