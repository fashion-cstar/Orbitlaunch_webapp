import Head from "next/head";
import Exchange from "@app/components/products/Exchange/index";
import { GetServerSideProps } from "next";
import { getBNBPrice } from "@app/lib/hooks/useTokenPrice";
import {
  GlobalCurrencyProvider,
  GlobalCurrencyState,
} from "@app/lib/context/GlobalCurrencyContext";

interface PageWithGlobalCurrencyProps extends GlobalCurrencyState { }

export default function ExchangePage(props: PageWithGlobalCurrencyProps) {
  return (
    <GlobalCurrencyProvider bnbPrice={props.bnbPrice}>
      <Head>
        <title>OrbitExchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Exchange></Exchange>
    </GlobalCurrencyProvider>
  );
}

// export default function ExchangePage() {
//   return (
//     <>
//       <Head>
//         <title>OrbitExchange</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <Exchange></Exchange>
//     </>
//   );
// }

export const getServerSideProps: GetServerSideProps = async () => {
  const bnbPrice = await getBNBPrice();
  return {
    props: {
      bnbPrice,
    },
  };
};
