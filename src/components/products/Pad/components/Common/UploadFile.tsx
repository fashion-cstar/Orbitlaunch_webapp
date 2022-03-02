import React, { useMemo, useState, useEffect, useRef  } from 'react'
import UploadIcon from '../svgs/UploadIcon'
export default function UploadFile({name, placeholder, id, onChange}:
    {name:string, placeholder:string, id:string, onChange:(val:any) => void}){
    const fileRef = useRef(null);        
    const [isBorder, setIsBorder] = useState(false)
    const [file, setFile] = useState<any>()
    const handleChange = (e) => {            
        setFile(e.target.files[0])
        onChange(e.target.files[0])        
    };
    const handleFocus = () => {
        setIsBorder(true)
    }

    const handleBlur = () => {
        setIsBorder(false)
    }
    return (
        <div className="flex-1 rounded-2xl bg-[#001926] py-4 px-6" style={{border: isBorder?"1px solid white":"none"}}>
            <div className="flex items-center space-x-3 text-[12px] font-bold uppercase text-app-primary mb-2">
                <span>{name}</span><span className='text-[#ff0000]'>*</span>
            </div>
            <div className="flex w-full">
                <input
                id={id}                
                className="bg-[#001926] text-white text-[16px] rounded-lg block w-full p-0 focus:outline-none"
                aria-disabled
                value={file?`${file.name}-${file.type}`:""}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                />
                <input
                hidden
                type="file"
                ref={fileRef}
                multiple={false}                
                onChange={(event) => handleChange(event)}                              
                />
                <div className="cursor-pointer" 
                    onClick={e => fileRef.current && fileRef.current.click()}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                >
                    <UploadIcon />
                </div>
            </div>
        </div>
    )
}