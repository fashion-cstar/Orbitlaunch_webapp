import Head from "next/head";
import Board from "@app/components/products/Board";

export default function Home() {
  return (
    <>
      <Head>
        <title>Orbit Launch — Mother Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* @todo: add elements that corresponds to board content */}
      {/* @todo: then create large board related to each sub products:
      e.g when user click on menu or board card title for Orbit Fund, the screen change the content and load related Orbit Fund features */}
      <Board></Board>
    </>
  );
}
