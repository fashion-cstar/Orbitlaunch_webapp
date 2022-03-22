import React, { ReactNode, useEffect } from "react"

interface TokenProps {
    token: string
    amount: number
    percent: number
    percentOfSupply: number
    children: ReactNode
}

export default function TokenCard({ token, amount, percent, percentOfSupply, children }: TokenProps) {

    return (
        <div className="w-full bg-[#867EE8]/[.08] rounded-2xl p-4 h-full flex flex-col justify-between">
            {children}
            <p className="text-[14px] md:text-[16px] text-[#867EE8] mt-2">{`$${token}: ${amount.toLocaleString()} (${percent}%)`}</p>
            <p className="text-[12px] text-white mt-2">{`${percentOfSupply}% of total ${token} supply`}</p>
        </div>
    )
}