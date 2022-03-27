import React, { useMemo, useState, useEffect, useRef } from 'react'
import TokenQtyInputBox from '@app/components/common/TokenQtyInputBox'

interface TokenInputProps {
    value: any
    icon: string
    name: string
    onChange: (val: any) => void
    onMax: () => void
}

export default function ProjectTokenInput({ value, icon, name, onChange, onMax }: TokenInputProps) {
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    return (
        <div className="flex-1 rounded-2xl bg-[#001926] py-4 px-6" style={{ border: isBorder ? "1px solid white" : "none" }}>
            <div className="flex items-center space-x-3 justify-between text-[12px] font-bold uppercase text-app-primary mb-2">
                <span>Amount</span>
                <div className='cursor-pointer' onClick={onMax}>
                    MAX ALLOCATION
                </div>
            </div>
            <div className='flex space-x-2'>
                <TokenQtyInputBox
                    handleFocus={handleFocus}
                    handleBlur={handleBlur}
                    onChange={onChange}
                    value={value}
                />
                <div className='flex space-x-4 py-2 px-4 bg-[#06111C] rounded-xl justify-center'>
                    <img src={icon} className="w-6 h-6" />
                    <div className='uppercase text-white text-[14px]'>{name}</div>
                </div>
            </div>
        </div>
    )
}