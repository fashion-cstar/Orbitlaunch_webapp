import Head from "next/head";
import Play from "@app/components/products/Play/index";

export default function Home() {
  return (
    <>
      <Head>
        <title>OrbitPlay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Play></Play>
    </>
  );
}
