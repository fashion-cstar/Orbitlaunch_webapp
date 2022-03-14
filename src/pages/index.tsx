import Head from "next/head";
import Board from "@app/components/products/Board/Board";
import { GetServerSideProps } from "next";
import { getBNBPrice } from "@app/lib/hooks/useTokenPrice";
import {
  GlobalCurrencyProvider,
  GlobalCurrencyState,
} from "@app/lib/context/GlobalCurrencyContext";

interface PageWithGlobalCurrencyProps extends GlobalCurrencyState {}

export default function Home(props: PageWithGlobalCurrencyProps) {
  return (
    <GlobalCurrencyProvider bnbPrice={props.bnbPrice}>
      <Head>
        <title>Orbit - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Board />
    </GlobalCurrencyProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const bnbPrice = await getBNBPrice();
  return {
    props: {
      bnbPrice,
    },
  };
};
