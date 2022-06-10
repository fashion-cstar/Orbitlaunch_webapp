import React, { useMemo, useState, useEffect, useRef } from 'react'
import TokenQtyInputBox from '@app/components/common/TokenQtyInputBox'

interface TokenInputProps {
    value: any
    name: string
    onChange: (val: any) => void
}

export default function BetAmountInput({ value, name, onChange }: TokenInputProps) {
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    
    return (
        <div className="flex flex-col rounded-2xl bg-[#001926] py-3 px-5" style={{ border: isBorder ? "1px solid white" : "none" }}>
            <div className="text-[12px] font-bold uppercase text-app-primary">
                BET Amount
            </div>
            <div className='flex gap-2 justify-between w-full mt-2'>
                <div className='flex gap-4'>                    
                    <TokenQtyInputBox
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        onChange={onChange}
                        value={value}
                    />
                </div>
                <div className="text-[#FFFFFF]/[.5] text-[20px] rounded-md text-right">
                    ORBIT
                </div>
            </div>
        </div>
    )
}