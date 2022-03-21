import React, { useMemo, useState, useEffect } from 'react'

export default function ChartBar({price, days, opacity}:{price: number, days: number, opacity: number}) {

    return (
        <div className="flex flex-col items-center gap-2">
            <p className="text-[16px] text-[#867EE8]">{`$${price}*`}</p>
            <img src="./images/analytics/TriChartBar.svg" style={{width: "110%", opacity: opacity}} />
            <p className="text-[12px] text-[#919699] mt-2">{`${days} days`}</p>
        </div>
    )
}