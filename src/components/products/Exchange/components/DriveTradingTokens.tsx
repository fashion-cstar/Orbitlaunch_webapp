import React, { useMemo, useState, useEffect } from 'react'
import { useDriveTradingTokens } from '@app/state/exchange'

const Row = ({ item }: { item: any }) => {
    return (
        <>
            <div className="flex items-center w-full text-[#919699] text-[12px]">
                <div className='flex items-center'>
                    <img src={item.logo} className='w-8 h-8 mr-4' />
                    <div className="text-white text-[16px] p-0">{item.name}{' '}<span className="uppercase">({item.symbol})</span></div>
                </div>
            </div>
            <div className="flex items-center w-[150px] text-white text-[16px]">
                <span className="w-full text-right">${item.price}</span>
            </div>
            <div className="flex items-center w-[150px] text-[#919699] text-[16px]">
                {item.H24 >= 0 ? <span className="w-full text-right text-[#00D98D]">&#9650; {item.H24==0?'0.00':item.H24}%</span> :
                    <span className="w-full text-right text-[#FE4141]">&#9660; {-item.H24}%</span>}
            </div>
        </>
    )
}

export default function DriveTradingTokens() {
    const list = useDriveTradingTokens()
    return (
        <div className="rounded-2xl bg-[#001926] p-4 h-full">
            <div className="text-[18px] md:text-[24px] text-white my-3">
                Current Data Drive Trading Tokens
            </div>
            <div className="border-b-2 border-[#112B40] flex pb-4">
                <div className="flex items-center w-full text-[#919699] text-[12px]">
                    <span className="w-full text-left">Name</span>
                </div>
                <div className="flex items-center w-[150px] text-[#919699] text-[12px]">
                    <span className="w-full text-right">Price</span>
                </div>
                <div className="flex items-center w-[150px] text-[#919699] text-[12px]">
                    <span className="w-full text-right">24h</span>
                </div>
            </div>
            <div className="">
                {list.map((item: any, index: number) => {
                    return (
                        <div key={index} className="flex font-extralight border-b border-[#112B40] last:border-b-0 py-4">
                            <Row item={item} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}