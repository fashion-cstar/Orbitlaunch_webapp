import React, { useMemo, useState, useEffect, useRef } from 'react'
import CommonInputBox from 'src/components/common/CommonInputBox'

interface InputBoxProps {
    name: string
    type: string
    value: any
    placeholder: string
    required: boolean
    id: string
    onChange: (val: any) => void
}

export default function InputBox({ name, type, value, placeholder, required, id, onChange }: InputBoxProps) {
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
            <CommonInputBox
                id={id}
                type={type}
                placeholder={placeholder}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                onChange={onChange}
                value={value}
                required={required}
            />
        </div>
    )
}