import React, { useMemo, useState, useEffect } from 'react'

const TxRow = ({ item }: { item: any }) => {
    return (
        <>
            <div className="flex items-center min-w-[80px] text-[#00D98D] text-[14px] uppercase" style={{ width: "20%" }}>
                <span className="w-full text-right">{item.tokens}<br />M31</span>
            </div>
            <div className="flex items-center min-w-[80px] text-[#00D98D] text-[14px] uppercase" style={{ width: "20%" }}>
                <span className="w-full text-right">{item.price}<br />0.9600 BNB</span>
            </div>
            <div className="flex items-center min-w-[80px] text-[#00D98D] text-[14px] uppercase" style={{ width: "20%" }}>
                <span className="w-full text-right">{item.pricetoken}<br />Pc v2</span>
            </div>
            <div className="flex items-center min-w-[80px] text-[#00D98D] text-[14px] uppercase" style={{ width: "20%" }}>
                <span className="w-full text-right">{item.time}<br />PM</span>
            </div>
            <div className="flex items-center min-w-[80px] text-[#29D9D0] text-[14px] uppercase pl-4" style={{ width: "20%" }}>
                <span className="w-full text-left">{item.tx}<br />Track</span>
            </div>
        </>
    )
}

const txs = [{ tokens: '10,463', price: '$0.9323', pricetoken: '$0.9323', time: '12:15:27', tx: '0x9521' },
{ tokens: '10,463', price: '$0.9323', pricetoken: '$0.9323', time: '12:15:27', tx: '0x9521' },
{ tokens: '10,463', price: '$0.9323', pricetoken: '$0.9323', time: '12:15:27', tx: '0x9521' },
{ tokens: '10,463', price: '$0.9323', pricetoken: '$0.9323', time: '12:15:27', tx: '0x9521' }]
export default function Transactions() {

    return (
        <div className="rounded-2xl bg-[#001926] p-4 h-full">
            <div className="text-[18px] md:text-[24px] text-white my-3">
                Transactions
            </div>
            <div className="border-b-2 border-[#112B40] flex pb-4">
                <div className="flex items-center min-w-[80px] text-[#919699] text-[12px] uppercase" style={{ width: "20%" }}>
                    <span className="w-full text-right">Tokens</span>
                </div>
                <div className="flex items-center min-w-[80px] text-[#919699] text-[12px] uppercase" style={{ width: "20%" }}>
                    <span className="w-full text-right">Price</span>
                </div>
                <div className="flex items-center min-w-[80px] text-[#919699] text-[12px] uppercase" style={{ width: "20%" }}>
                    <span className="w-full text-right">Price / Token</span>
                </div>
                <div className="flex items-center min-w-[80px] text-[#919699] text-[12px] uppercase" style={{ width: "20%" }}>
                    <span className="w-full text-right">Time</span>
                </div>
                <div className="flex items-center min-w-[80px] text-[#919699] text-[12px] uppercase pl-4" style={{ width: "20%" }}>
                    <span className="w-full text-left">Tx</span>
                </div>
            </div>
            <div className="">
                {txs.map((item: any, index: number) => {
                    return (
                        <div key={index} className="flex font-extralight border-b border-[#112B40] last:border-b-0 py-4">
                            <TxRow item={item} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}