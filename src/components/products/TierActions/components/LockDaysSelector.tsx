import React, { useMemo, useState, useEffect } from 'react'
import { FOURTEEN_DAYS, TWENTY_EIGHT_DAYS } from "@app/utils";

interface LockDaysSelectorProps {    
    lockDays: number
    setLockDays: (value: number) => void
}

const checkedSvg = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" fill="#867EE8" stroke="#867EE8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 10L9 12L13 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

const uncheckedSvg = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="#BAB8CC" stroke-opacity="0.64" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export default function LockDaysSelector({ lockDays, setLockDays }: LockDaysSelectorProps) {    

    return (
        <div className='w-full'>
            <div className='flex justify-between w-full items-stretch gap-4'>
                <div className={`flex rounded-2xl bg-[#06111C] p-4 basis-1/2 w-full justify-between items-center ${lockDays != 14 ? 'cursor-pointer hover:border hover:border-[#c1c1c1]' : ''}`} onClick={() => setLockDays(FOURTEEN_DAYS)}>
                    <div className='flex flex-col gap-2'>
                        <div className='text-white text-[16px]'>14 days</div>
                        <div className='text-[#BAB8CC]/[.64] text-[12px]'>
                            Most popular among <br />OrbitPad users
                        </div>
                    </div>
                    <div>
                        {lockDays === 14 ? checkedSvg() : uncheckedSvg()}
                    </div>
                </div>
                <div className={`flex rounded-2xl bg-[#06111C] p-4 basis-1/2 w-full justify-between items-center ${lockDays === 14 ? 'cursor-pointer hover:border hover:border-[#c1c1c1]' : ''}`} onClick={() => setLockDays(TWENTY_EIGHT_DAYS)}>
                    <div className='flex flex-col gap-2'>
                        <div className='text-white text-[16px]'>28 days</div>
                        <div className='text-[#BAB8CC]/[.64] text-[12px]'>
                            Most popular among <br />OrbitFund users
                        </div>
                    </div>
                    <div>
                        {lockDays === 14 ? uncheckedSvg() : checkedSvg()}
                    </div>
                </div>
            </div>
        </div>
    );
}
