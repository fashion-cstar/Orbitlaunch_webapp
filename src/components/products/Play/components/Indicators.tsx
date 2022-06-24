import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useEthers } from "@usedapp/core";
import { OrbitPlayContractAddress } from "@app/shared/PlayConstant"
import { usePlay } from '@app/contexts'
import { formatEther } from '@app/utils'

export default function Indicators({orbitDecimals}:{orbitDecimals: number}) {
    const { playInfo } = usePlay()

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1 rounded-2xl bg-[#001926] p-4 lg:basis-1/3 w-full">
                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                        <span>GAMES PLAYED</span>
                    </div>
                    <div className="text-xl text-white">{playInfo?.timesPlayed.toLocaleString()}</div>
                </div>
                <div className="flex-1 rounded-2xl bg-[#001926] p-4 lg:basis-1/3 w-full">
                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                        <span>TOTAL $ORBIT WON</span>
                    </div>
                    <div className="text-xl text-white">{formatEther(playInfo?.paidOut, orbitDecimals, 2)}</div>
                </div>
                <div className="flex-1 rounded-2xl bg-[#001926] p-4 lg:basis-1/3 w-full">
                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                        <span>TOTAL $ORBIT BURNT</span>
                    </div>
                    <div className="text-xl text-white">{formatEther(playInfo?.burnt, orbitDecimals, 2)}</div>
                </div>
            </div>
        </div>
    );
}