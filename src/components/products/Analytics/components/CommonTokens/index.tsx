import React, { useEffect } from "react"
import TokensCard from "./TokenCard"
import M31Icon from "../../svgs/M31Icon"
import ADAIcon from "../../svgs/ADAIcon"
import BTCIcon from "../../svgs/BTCIcon"
import SOLIcon from "../../svgs/SOLIcon"

export default function CommonTokens() {

    return (
        <div className="w-full">
            <div className="flex gap-4 text-[18px] md:text-[24px] text-white my-3">
                <span>Common Tokens</span>
                <div className="px-4 pt-2 text-[#00D98D] text-[16px] bg-[#00D98D]/[.16] rounded-2xl">Top 15 Holders</div>
            </div>
            <div className="flex-1">
                <div className="flex gap-3 mt-8 items-stretch">
                    <div className="basis-1/2">
                        <TokensCard token="M31" percent={45} amount={37516} percentOfSupply={13.8} >
                            <M31Icon />
                        </TokensCard>
                    </div>
                    <div className="basis-1/2">
                        <TokensCard token="ADA" percent={29} amount={24317} percentOfSupply={4.2} >
                            <ADAIcon />
                        </TokensCard>
                    </div>
                </div>
                <div className="flex gap-3 mt-3 items-stretch">
                    <div className="basis-1/2">
                        <TokensCard token="BTC" percent={14} amount={11498} percentOfSupply={1.1} >
                            <BTCIcon />
                        </TokensCard>
                    </div>
                    <div className="basis-1/2">
                        <TokensCard token="SOL" percent={9.6} amount={7942} percentOfSupply={3.2} >
                            <SOLIcon />
                        </TokensCard>
                    </div>
                </div>
            </div>
        </div>
    )
}