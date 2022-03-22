import React, { useEffect } from "react"
import WalletCard from "./WalletCard"
export default function TopWallets() {

    return (
        <div className="w-full h-full">
            <div className="flex gap-4 text-[18px] md:text-[24px] text-white my-3">
                Top Wallets
            </div>
            <div className="flex flex-col gap-6 justify-around">
                <WalletCard address="0xD4c61D338352244332f2Ac93f8927C9FfE237e62"
                    chainId={56} percentage={100} quantity1="100k 271 days"
                    quantity2="28K 12 days" quantity3="194k" />
                <WalletCard address="0xD4c61D338352244332f2Ac93f8927C9FfE237e62"
                    chainId={56} percentage={85} quantity1="126k 271 days"
                    quantity2="25K 39 days" quantity3="149k" />
                <WalletCard address="0xD4c61D338352244332f2Ac93f8927C9FfE237e62"
                    chainId={56} percentage={75} quantity1="58k 271 days"
                    quantity2="28K 12 days" quantity3="141k" />
                <WalletCard address="0xD4c61D338352244332f2Ac93f8927C9FfE237e62"
                    chainId={56} percentage={70} quantity1="122k 271 days"
                    quantity2="no other bus" quantity3="122k" />
                <WalletCard address="0xD4c61D338352244332f2Ac93f8927C9FfE237e62"
                    chainId={56} percentage={60} quantity1="10k 271 days"
                    quantity2="92K 194 days" quantity3="119k" />
            </div>
        </div>
    )
}