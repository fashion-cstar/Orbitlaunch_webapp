import React, { useMemo, useState, useEffect, useRef } from 'react'
import TokenQtyInputBox from '@app/components/common/TokenQtyInputBox'
import ORBTIcon from './../svgs/ORBTIcon'
import { Orbt_Icon } from './../svgs/MigrationIcon'

interface TokenInputProps {
    value: any
    name: string
    balance: string
    onChange: (val: any) => void
}

export default function MigrateOutput({ value, name, balance, onChange }: TokenInputProps) {
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    return (
        <div className="flex flex-col rounded-2xl bg-[#001926] py-3 px-5" style={{ border: isBorder ? "1px solid white" : "none" }}>
            <div className="flex items-center justify-between gap-3 text-[12px] font-bold uppercase text-app-primary">
                <span>To</span>
                <span>Balance</span>
            </div>
            <div className='flex gap-2 justify-between w-full mt-2'>
                <div className='flex gap-4'>
                    <div className='flex space-x-4 py-2 px-4 bg-[#06111C] rounded-xl justify-center'>
                        <div className="flex items-center justify-center w-6 h-6">
                            {/* <ORBTIcon /> */}
                            <img style={{borderRadius:'50%'}} src={Orbt_Icon} width="22px" />
                        </div>
                        <div className='uppercase text-white text-[14px]'>{name}</div>
                    </div>
                    <TokenQtyInputBox
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        onChange={onChange}
                        value={value}
                    />
                </div>
                <div className="text-[#FFFFFF]/[.5] text-[20px] rounded-md text-right">
                    <span>{balance}</span>
                </div>
            </div>
        </div>
    )
}