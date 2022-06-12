import React, { useMemo, useState, useEffect, useRef } from 'react'
import BetQtyInputBox from './BetQtyInputBox'

interface TokenInputProps {
    value: any    
    onChange: (val: any) => void
}

export default function BetAmountInput({ value, onChange }: TokenInputProps) {
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    
    return (
        <div className="flex flex-col rounded-2xl bg-[#06111C] py-3 px-5" style={{ border: isBorder ? "1px solid white" : "none" }}>
            <div className="text-[12px] font-bold uppercase text-app-primary">
                BET Amount
            </div>
            <div className='flex gap-2 justify-between w-full mt-1'>
                <div className='flex gap-4'>                    
                    <BetQtyInputBox
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        onChange={onChange}
                        value={value}
                    />
                </div>
                <div className="text-[#FFFFFF] text-[16px] rounded-md text-right">
                    ORBIT
                </div>
            </div>
        </div>
    )
}