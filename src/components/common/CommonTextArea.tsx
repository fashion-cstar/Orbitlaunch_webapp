import React, { useMemo, useState, useEffect, useRef } from 'react'

interface TextAreaProps {
    value: string
    placeholder: string
    required: boolean
    id: string
    onChange: (val: any) => void
    handleFocus: () => void
    handleBlur: () => void
}

export default function CommonTextArea({ value, placeholder, required, id, onChange, handleFocus, handleBlur }: TextAreaProps) {
    return (
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
    )
}