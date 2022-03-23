import React, { ReactNode, useEffect } from "react"
import { getEtherscanLink } from 'src/utils'

interface TokenProps {
    address: string
    chainId: number
    percentage: number
    quantity1: string
    quantity2: string
    quantity3: string
}

export default function WalletCard({ address, chainId, percentage, quantity1, quantity2, quantity3 }: TokenProps) {

    return (
        <div className="flex gap-2 w-full items-center">
            <p className="text-white text-[14px] underline w-[48px] min-w-[48px]">
                <a href={getEtherscanLink(chainId, address, "address")} target="_blank">
                    ...{address.substring(address.length-4, address.length)}
                </a>
            </p>
            <div className="w-full">
                <div className="w-full flex justify-between text-white text-[12px]">
                    <span>{quantity1}</span>
                    <span>{quantity2}</span>
                </div>
                <div className="flex gap-2 w-full">
                    <div className="bg-gradient-to-r from-[#00D98D] to-[#29D9D0] h-[12px]" style={{width: `${percentage}%`}}>
                    </div>
                    <div className="bg-[#BAB8CC]/[.64] h-[12px]" style={{width: `${100-percentage}%`, display: percentage>=100?'none':'block'}}>
                    </div>
                </div>
            </div>
            <p className="text-[#29D9D0] text-[14px] w-[32px] min-w-[32px]">
                {quantity3}
            </p>
        </div>
    )
}