import Indicators from "@app/components/products/Cards/Indicators";
import FundCard from "./Cards/FundCard";
import ExchangeCard from "./Cards/ExchangeCard";
import PadCard from "./Cards/PadCard";
import AnalyticsCard from "./Cards/AnalyticsCard";
import BuyButton from "../common/BuyButton";
import { TwitterTimelineEmbed } from "react-twitter-embed";

export default function Board() {
  return (
    <>
      <div className="flex w-full flex-col space-y-4">
        <div className="flex flex-row items-center">
          <h1 className="text-[40px] font-medium">Dashboard</h1>
          <div className="absolute right-10">
            <BuyButton />
          </div>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex-1">
            <Indicators />
          </div>
          <div className="flex flex-col rounded-2xl bg-[#001926] p-4">
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
        <div className="flex flex-row space-x-4">
          <PadCard />
          <AnalyticsCard />
        </div>
        <div className="flex flex-row space-x-4">
          <FundCard />
          <ExchangeCard />
        </div>
      </div>
    </>
  );
}
