import React, { useMemo, useState, useEffect } from 'react'
import dynamic from "next/dynamic";
import { useGlobalCurrency } from "@app/lib/context/GlobalCurrencyContext";

const Chart = dynamic(() => import("@app/components/common/Chart/Chart"), {
    ssr: false,
});
export default function TvChart({ address, symbol }: { address: string, symbol: string }) {
    const { bnbPrice } = useGlobalCurrency();

    return (
        <div className="rounded-2xl bg-[#001926] p-4 mt-4">
            <Chart address={address} symbol={symbol} bnbPrice={bnbPrice} />
        </div>
    )
}