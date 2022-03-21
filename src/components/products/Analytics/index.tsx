import BuyButton from "../../common/BuyButton";
import dynamic from "next/dynamic";
import { AppTokenAddress } from "@app/shared/AppConstant";
import { useGlobalCurrency } from "@app/lib/context/GlobalCurrencyContext";
import HolderInfo from "./components/HolderInfo";
import Volume from "./components/Volume/index";
import AllTimeHigh from "./components/AllTimeHigh";
import TokenDistribution from "./components/TokenDistribution";

const styleHeight = {
    height: '300px',
    textAlign: 'center' as 'center'
}

const Chart = dynamic(() => import("@app/components/common/Chart/Chart"), {
    ssr: false,
});

export default function Analytics() {
    const { bnbPrice } = useGlobalCurrency();

    return (
        <>
            <div className="flex flex-col space-y-4 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex justify-between">
                        <h1 className="text-[40px] font-medium">OrbitAnalytics</h1>                        
                    </div>     
                    <div>
                        <BuyButton />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center rounded-2xl bg-[#001926] px-6 py-4">
                            <HolderInfo />
                        </div>
                        <div className="flex flex-col items-center rounded-2xl bg-[#001926] px-6 py-4">
                            <Volume />
                        </div>
                        <div className="flex flex-col items-center rounded-2xl bg-[#001926] px-6 py-4">
                            <AllTimeHigh />
                        </div>
                        <div className="flex flex-col items-start justify-start rounded-2xl bg-[#001926] px-6 py-4">
                            <TokenDistribution />
                        </div>
                    </div>                    
                    <div className="flex flex-col gap-4">
                        <div>
                            <Chart address={AppTokenAddress} symbol={"M31"} bnbPrice={bnbPrice} />
                        </div>
                        <div>
                            Graph
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center rounded-2xl bg-[#001926] px-6 py-4">Holder Info</div>
                            <div className="flex flex-col items-center rounded-2xl bg-[#001926] px-6 py-4">Volume</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}