import React, { useMemo, useState, useEffect } from 'react'
import ChartBar from './ChartBar'
export default function AllTimeHigh() {

    return (
        <div>
            <div className="text-[24px] text-white my-3">All Time High<span className="text-[16px] text-[#00D98D]">&nbsp;&nbsp;&nbsp;&nbsp;{`($${0.19} current)`}</span></div>
            <div className='flex justify-center w-full'>
                <div className="flex items-end justify-center p-2 overflow-visible" style={{width: `${95}%`}}>
                    <div style={{width:"40%"}}>
                        <ChartBar price={0.48} days={264} opacity={1} /> 
                    </div>
                    <div style={{width:"25%"}}>
                        <ChartBar price={0.32} days={180} opacity={0.8} /> 
                    </div>
                    <div style={{width:"20%"}}>
                        <ChartBar price={0.29} days={90} opacity={0.6} /> 
                    </div>
                    <div style={{width:"15%"}}>
                        <ChartBar price={0.26} days={30} opacity={0.4} /> 
                    </div>
                </div>
            </div>
            <div className="text-[14px] text-white my-3">*All time hight of $0.48 Occured on 11/28/21 at 16:45 UTC</div>          
        </div>
    )
}