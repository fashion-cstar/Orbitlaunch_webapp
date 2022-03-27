import React, { useMemo, useState, useEffect, useRef } from 'react'
import CommonTextArea from 'src/components/common/CommonTextArea'

interface TextAreaProps {
    name: string
    value: string
    placeholder: string
    required: boolean
    id: string
    onChange: (val: any) => void
}

export default function TextArea({ name, value, placeholder, required, id, onChange }: TextAreaProps) {
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
            <CommonTextArea
                id={id}               
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