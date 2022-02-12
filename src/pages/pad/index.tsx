import Head from "next/head";
import Pad from "@app/components/products/Pad";

export default function Home() {
  return (
    <>
      <Head>
        <title>OrbitPad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pad></Pad>
    </>
  );
}
