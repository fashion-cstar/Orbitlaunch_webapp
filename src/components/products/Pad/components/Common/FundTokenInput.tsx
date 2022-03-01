import React, { useMemo, useState, useEffect, useRef  } from 'react'
import InputBoxContainer from './InputBoxContainer'

export default function FundTokenInput({value, icon, name, onChange}:
    {value:any, icon:string, name:string, onChange:(val:any) => void}){
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    return (
        <div className="flex-1 rounded-2xl bg-[#001926] py-4 px-6" style={{border: isBorder?"1px solid white":"none"}}>
            <div className="flex items-center space-x-3 text-[12px] font-bold uppercase text-app-primary mb-2">
                <span>Amount</span>
            </div>
            <div className='flex space-x-2'>
                <InputBoxContainer>
                    <input
                    type="number"                
                    className="bg-[#001926] text-white text-[24px] rounded-lg block w-full p-0 focus:outline-none"
                    placeholder="0.0"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={(event) => onChange(event.target.value)}
                    value={value ?? ''}
                    required={true}
                    />
                </InputBoxContainer>
                <div className='flex space-x-4 py-2 px-4 bg-[#06111C] rounded-xl justify-center'>
                    <img src={icon} className="w-6 h-6" />
                    <div className='uppercase text-white text-[14px]'>{name}</div>
                </div>
            </div>
        </div>
    )
}