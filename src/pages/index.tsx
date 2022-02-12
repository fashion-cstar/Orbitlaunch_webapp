import Head from "next/head";
import Board from "@app/components/products/Board";

export default function Home() {
  return (
    <>
      <Head>
        <title>Orbit - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Board></Board>
    </>
  );
}
