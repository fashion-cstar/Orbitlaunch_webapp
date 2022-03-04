import React, { useMemo, useState, useEffect, useRef } from 'react'
import InputBoxContainer from './InputBoxContainer'

export default function InputBox({ name, type, value, placeholder, required, id, onChange }:
    { name: string, type: string, value: any, placeholder: string, required: boolean, id: string, onChange: (val: any) => void }) {
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    return (
        <div className="flex-1 rounded-2xl bg-[#001926] py-4 px-6" style={{ border: isBorder ? "1px solid white" : "none" }}>
            <div className="flex items-center space-x-3 text-[12px] font-bold uppercase text-app-primary mb-2">
                <span>{name}</span>{(required && <span className='text-[#ff0000]'>*</span>)}
            </div>
            <InputBoxContainer>
                <input
                    id={id}
                    type={type}
                    className="bg-[#001926] text-white text-[16px] rounded-lg block w-full p-0 focus:outline-none"
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={(event) => onChange(event.target.value)}
                    value={value}
                    required={required ? true : false}
                />
            </InputBoxContainer>
        </div>
    )
}