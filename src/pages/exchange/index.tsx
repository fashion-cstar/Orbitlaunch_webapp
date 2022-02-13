import Head from "next/head";
import Exchange from "@app/components/products/Exchange";

export default function Home() {
  return (
    <>
      <Head>
        <title>OrbitExchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Exchange></Exchange>
    </>
  );
}
