import Indicators from "@app/components/products/Board/Indicators";
import FundCard from "./FundCard";
import ExchangeCard from "./ExchangeCard";
import PadCard from "./PadCard";
import AnalyticsCard from "./AnalyticsCard";
import BuyButton from "../../common/BuyButton";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import dynamic from "next/dynamic";
import { AppTokenAddress } from "@app/shared/AppConstant";
import { useGlobalCurrency } from "@app/lib/context/GlobalCurrencyContext";

const Chart = dynamic(() => import("@app/components/common/Chart/Chart"), {
  ssr: false,
});

export default function Board() {

  const { bnbPrice } = useGlobalCurrency();

  return (
    <>
      <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-row items-center">
          <h1 className="desktop-content text-[40px] font-medium">Dashboard</h1>
          <h1 className="mobile-content text-[35px] font-medium">Dashboard</h1>
          <div className="absolute right-10"><BuyButton /></div>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex-1 space-y-4">
            <Indicators />
            <div className="rounded-2xl bg-[#001926] p-4">
              <Chart address={AppTokenAddress} symbol={"M31"} bnbPrice={bnbPrice} />
            </div>
          </div>
          <div className="desktop-content flex flex-col rounded-2xl bg-[#001926] p-4">
            <span className="mb-8 block">Latest News</span>

            <div className="flex-1 rounded-2xl bg-[#06111c]">
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName="orbitlaunchm31"
                theme="dark"
                options={{ height: "100%", width: 303 }}
                noHeader
                noFooter
                noScrollbar
                transparent
                noBorders
                autoHeight
              />
            </div>
          </div>
        </div>
        <div className="desktop-content space-y-4">
          <div className="flex flex-row space-x-4">
            <PadCard />
            <AnalyticsCard />
          </div>
          <div className="flex flex-row space-x-4">
            <FundCard />
            <ExchangeCard />
          </div>
        </div>
        <div className="mobile-content space-y-4">
          <div className="flex flex-row space-x-4">
            <PadCard />
          </div>
          <div className="flex flex-row space-x-4">
            <FundCard />
          </div>
          <div className="flex flex-row space-x-4">
            <AnalyticsCard />
          </div>
          <div className="flex flex-row space-x-4">
            <ExchangeCard />
          </div>
        </div>
        <div className="mobile-content flex flex-col rounded-2xl bg-[#001926] p-4">
          <span className="mb-8 block">Latest News</span>

          <div className="flex-1 rounded-2xl bg-[#06111c]">
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="orbitlaunchm31"
              theme="dark"
              options={{ height: "100%", width: 303 }}
              noHeader
              noFooter
              noScrollbar
              transparent
              noBorders
              autoHeight
            />
          </div>
        </div>
      </div>
    </>
  );
}
