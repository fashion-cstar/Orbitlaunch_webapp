import Indicators from "@app/components/products/Cards/Indicators";
import FundCard from "./Cards/FundCard";
import ExchangeCard from "./Cards/ExchangeCard";
import PadCard from "./Cards/PadCard";
import AnalyticsCard from "./Cards/AnalyticsCard";
import BuyButton from "../common/BuyButton";

export default function Board() {
    return (
        // @todo: split by components, start chart.js, formating, align & grey center, button designs, connexion compo, menu & assets
        // @todo: find a way to keep the same css values between screens and do common css var
        <>
        <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-row items-center">
                <h1 className="text-[40px] font-medium">Dashboard</h1>
                <BuyButton></BuyButton>
            </div>
            <div className="flex flex-row space-x-4">
                <div className="flex-1">
                    <Indicators></Indicators>
                </div>
                <div className="columns-3 rounded-md bg-[#001926] p-4">
                    Latest News
                </div>
            </div>
            <div className="flex flex-row space-x-4">
                <PadCard></PadCard>
                <AnalyticsCard></AnalyticsCard>
            </div>
            <div className="flex flex-row space-x-4">
                <FundCard></FundCard>
                <ExchangeCard></ExchangeCard>
            </div>
        </div>
        </>
    )
}