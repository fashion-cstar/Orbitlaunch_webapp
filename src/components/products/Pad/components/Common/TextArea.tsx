import React, { useMemo, useState, useEffect, useRef } from 'react'
export default function TextArea({ name, value, placeholder, required, id, onChange }:
    { name: string, value: string, placeholder: string, required: boolean, id: string, onChange: (val: any) => void }) {
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
            <textarea
                id={id}
                className="bg-[#001926] text-white text-[16px] rounded-md block w-full pt-1.5 focus:outline-none" rows={5}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(event) => onChange(event.target.value)}
                value={value}
                required={required ? true : false}
            />
        </div>
    )
}