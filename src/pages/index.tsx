import axios from "axios";
import { Moneys } from "iconsax-react";
import useOrbit from "@app/lib/hooks/useOrbit";
import Head from "next/head";
import { AppTokenAddress } from "@app/shared/AppConstant";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { NoSsr } from "@mui/material";

const TVChartContainer = dynamic(
  () =>
    import("@app/components/TVChartContainer/TVChartContainer").then(
      (mod) => mod.TVChartContainer
    ),
  { ssr: false }
);

export default function Home() {
  const { liquidityPool, price, marketCap, holders } = useOrbit();

  return (
    <>
      <Head>
        <title>Orbit Launch — Mother Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="space-y-6 w-full">
        <h1 className="text-3xl font-medium">Dashboard</h1>
        <div className="flex items-center space-x-6 w-full">
          <div className="space-y-2 rounded-md bg-[#001926] p-4 flex-1">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-app-primary">
              <Moneys
                variant="Bulk"
                fill="currentColor"
                size={24}
                className="text-app-primary"
              />
              <span>Market Cap</span>
            </div>
            <div className="text-2xl">${marketCap}</div>
          </div>
          <div className="space-y-2 rounded-md bg-[#001926] p-4 flex-1">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-app-primary">
              <Moneys
                variant="Bulk"
                fill="currentColor"
                size={24}
                className="text-app-primary"
              />
              <span>Liquidity Pool</span>
            </div>
            <div className="text-2xl">${liquidityPool}</div>
          </div>
          <div className="space-y-2 rounded-md bg-[#001926] p-4 flex-1">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-app-primary">
              <Moneys
                variant="Bulk"
                fill="currentColor"
                size={24}
                className="text-app-primary"
              />
              <span>Price</span>
            </div>
            <div className="text-2xl">${price}</div>
          </div>
          <div className="space-y-2 rounded-md bg-[#001926] p-4 flex-1">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-app-primary">
              <Moneys
                variant="Bulk"
                fill="currentColor"
                size={24}
                className="text-app-primary"
              />
              <span>Holders</span>
            </div>
            <div className="text-2xl">{holders}</div>
          </div>
        </div>
        <NoSsr>
          <TVChartContainer />
        </NoSsr>
      </div>
    </>
  );
}
