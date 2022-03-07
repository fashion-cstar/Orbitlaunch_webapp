import useOrbit from "@app/lib/hooks/useOrbit";
import dynamic from "next/dynamic";
import { AppTokenAddress } from "@app/shared/AppConstant";
import { useGlobalCurrency } from "@app/lib/context/GlobalCurrencyContext";

const Chart = dynamic(() => import("@app/components/Chart/Chart"), {
  ssr: false,
});

export default function Indicators() {
  const { marketCap, liquidityPool, holders, price } = useOrbit();
  const { bnbPrice } = useGlobalCurrency();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row space-x-4">
        <div className="flex-1 rounded-2xl bg-[#001926] p-4">
          <div className="mb-[6px] flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary">
            <span>Market Cap</span>
          </div>
          <div className="text-xl">$ {marketCap}</div>
        </div>
        <div className="flex-1 rounded-2xl bg-[#001926] p-4">
          <div className="mb-[6px] flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary">
            <span>Current LP</span>
          </div>
          <div className="text-xl">{liquidityPool} BNB</div>
        </div>
        <div className="flex-1 rounded-2xl bg-[#001926] p-4">
          <div className="mb-[6px] flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary">
            <span>Holders</span>
          </div>
          <div className="text-xl">{holders}</div>
        </div>
        {/* @todo: have a variation e.g up to 28% */}
        <div className="flex-1 rounded-2xl bg-[#001926] p-4">
          <div className="mb-[6px] flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary">
            <span>Price</span>
          </div>
          <div className="text-xl">$ {price}</div>
        </div>
      </div>
      <div className="rounded-2xl bg-[#001926] p-4">
       
          <Chart address={AppTokenAddress} symbol={"M31"} bnbPrice={bnbPrice} />
       
      </div>
    </div>
  );
}
