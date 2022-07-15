import React, { useMemo, useState, useEffect, useRef } from 'react'
import SwapQtyInputBox from '@app/components/common/SwapQtyInputBox'

interface TokenInputProps {
    value: any
    name: string
    balance: string
    logoURI: string
    onChange: (val: any) => void
    onOpenSelectModal: () => void
}

export default function SwapOutput({ value, name, balance, logoURI, onChange, onOpenSelectModal }: TokenInputProps) {
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    return (
        <div className="flex flex-col rounded-2xl bg-[#06111C] py-3 px-5" style={{ border: isBorder ? "1px solid white" : "none" }}>
            <div className="flex items-center justify-between gap-3 text-[12px] font-bold uppercase text-app-primary">
                <span>To</span>
                <span>Balance</span>
            </div>
            <div className='flex gap-2 justify-between items-center w-full mt-2'>
                <div className='flex gap-3 items-center'>
                    <div className='flex min-w-[100px] gap-3 py-2 px-3 bg-[#001926] rounded-xl justify-left hover:bg-[#102936]  cursor-pointer' onClick={onOpenSelectModal}>
                        <div className="flex items-center justify-center w-6 h-6">                            
                            <img src={logoURI} width="22" height="22" />
                        </div>
                        <div className='uppercase text-white text-[14px]'>{name}</div>
                    </div>
                    <SwapQtyInputBox
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        onChange={onChange}
                        value={value}
                        readOnly={true}
                    />
                </div>
                <div className="text-[#FFFFFF]/[.5] text-[20px] rounded-md text-right">
                    <span>{balance}</span>
                </div>
            </div>
        </div>
    )
}