import Head from "next/head";
import Fund from "@app/components/products/Fund";

export default function Home() {
  return (
    <>
      <Head>
        <title>OrbitFund</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Fund></Fund>
    </>
  );
}