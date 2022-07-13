import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Button } from "@mui/material"
import { useEthers } from "@usedapp/core"

export default function Indicators() {
    const { account } = useEthers()

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col gap-4 xl:flex-row">
                <div className="flex gap-4 flex-col md:flex-row basis-1/2">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4 basis-1/2 w-full">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>Market Cap</span>
                        </div>
                        <div className="text-xl text-white underline">{`${Number(4908772).toLocaleString()}`}</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4 basis-1/2 w-full">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>Current LP</span>
                        </div>
                        <div className="text-xl text-white underline">{`${Number(992).toLocaleString} BNB`}</div>
                    </div>
                </div>
                <div className="flex gap-4 flex-col md:flex-row  basis-1/2">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4 basis-1/2 w-full">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>HOLDERS</span>
                        </div>
                        <div className="text-xl text-white underline">{`${Number(8753).toLocaleString()}`}</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4 basis-1/2 w-full">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>PRICE</span>
                        </div>
                        <div className="text-xl text-white underline">{`${0.0442}$`}<span className="text-[#00D98D]">{` (`}&#8593;{`${28}%)`}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}