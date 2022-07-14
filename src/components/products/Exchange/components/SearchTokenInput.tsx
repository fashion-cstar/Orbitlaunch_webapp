import React, { useMemo, useState, useEffect, useRef } from 'react'
import CommonInputBox from 'src/components/common/CommonInputBox'

interface InputBoxProps {   
    value: any
    id: string
    onChange: (val: any) => void
}

export default function SearchTokenBox({ value, id, onChange }: InputBoxProps) {
    const [isBorder, setIsBorder] = useState(false)
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    return (
        <div className="flex-1 rounded-lg bg-[#001926] py-1 px-4 max-w-[300px]" style={{ border: isBorder ? "1px solid white" : "1px solid #333" }}>   
            <CommonInputBox
                id={id}
                type="text"
                placeholder="Search name or symbol"
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                onChange={onChange}
                value={value}
                required={true}
            />
        </div>
    )
}