import React, { useMemo, useState, useEffect } from 'react'
import HeatMap from '../../svgs/HeatMap'
export default function PublicSafetyRating() {
    const [LP_Target, setLPTarget] = useState(3)
    const [Doxed_Target, setDoxedTarget] = useState(0)
    const [Fair_Target, setFairTarget] = useState(2)
    const [Contract_Target, setContractTarget] = useState(1)

    return (
        <div className="w-full">
            <div className="flex gap-4 text-[18px] md:text-[24px] text-white my-3">
                <span>Public Safety Rating</span>
                <div className="px-4 pt-2 text-[#00D98D] text-[16px] bg-[#00D98D]/[.16] rounded-2xl">{`${68}%`}</div>
            </div>
            <HeatMap LP_Target={LP_Target} Doxed_Target={Doxed_Target} Fair_Target={Fair_Target} Contract_Target={Contract_Target} />
        </div>
    )
}