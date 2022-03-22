import React, { useMemo, useState, useEffect, useRef } from 'react'
import BuyButton from "../../common/BuyButton"
import dynamic from "next/dynamic"
import { AppTokenAddress } from "@app/shared/AppConstant"
import { useGlobalCurrency } from "@app/lib/context/GlobalCurrencyContext"
import HolderInfo from "./components/HolderInfo"
import Volume from "./components/Volume"
import AllTimeHigh from "./components/AllTimeHigh"
import TokenDistribution from "./components/TokenDistribution"
import CommonTokens from './components/CommonTokens'
import TopWallets from './components/TopWallets'

const styleHeight = {
    height: '300px',
    textAlign: 'center' as 'center'
}

const Chart = dynamic(() => import("@app/components/common/Chart/Chart"), {
    ssr: false,
});

export default function Analytics() {
    const [width, setWidth] = useState(0)
    const { bnbPrice } = useGlobalCurrency();
    const widthRef = useRef<any>();

    const getListSize = () => {
        if (widthRef) {
            const newWidth = widthRef?.current?.clientWidth;
            setWidth(newWidth)
        }
    };

    useEffect(() => {
        const newWidth = widthRef?.current?.clientWidth;
        setWidth(newWidth)
        window.addEventListener("resize", getListSize);
    }, []);
    return (
        <>
            <div className="block relative w-full" ref={widthRef}></div>
            <div className="block relative w-1">
                <div className="inline-block flex flex-col space-y-4" style={{ width: `${width}px` }}>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex justify-between">
                            <h1 className="text-[32px] md:text-[40px] font-medium">OrbitAnalytics</h1>
                        </div>
                        <div>
                            <BuyButton />
                        </div>
                    </div>
                    <div className="w-full flex flex-col xl:flex-row gap-4">
                        <div className="xl:basis-1/3 w-full">
                            <div className="flex flex-col lg:flex-row xl:flex-col gap-4">
                                <div className="md:basis-1/2 items-center rounded-2xl bg-[#001926] p-4">
                                    <HolderInfo width={width} />
                                </div>
                                <div className="md:basis-1/2 items-center rounded-2xl bg-[#001926] p-4">
                                    <Volume width={width} />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row xl:flex-col gap-4 mt-4">
                                <div className="md:basis-1/2 items-center rounded-2xl bg-[#001926] p-4">
                                    <AllTimeHigh width={width} />
                                </div>
                                <div className="md:basis-1/2 items-start justify-start rounded-2xl bg-[#001926] p-4">
                                    <TokenDistribution width={width} />
                                </div>
                            </div>
                        </div>
                        <div className="xl:basis-2/3 w-full">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <Chart address={AppTokenAddress} symbol={"M31"} bnbPrice={bnbPrice} />
                                </div>
                                <div>
                                    Graph
                                </div>           
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="md:basis-1/2 items-center rounded-2xl bg-[#001926] p-4">
                                        <CommonTokens />
                                    </div>
                                    <div className="md:basis-1/2 items-center rounded-2xl bg-[#001926] p-4">
                                        <TopWallets />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}