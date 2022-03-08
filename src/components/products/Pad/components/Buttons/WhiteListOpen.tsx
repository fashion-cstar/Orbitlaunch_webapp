import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Button } from "@mui/material";
import ShareIcon from "../svgs/ShareIcon";
import styled from 'styled-components'

const CopiedContainer = styled.div`
    -webkit-animation-name: fadeIn; /* Fade in the background */
    -webkit-animation-duration: 0.8s;
    animation-name: fadeIn;
    animation-duration: 0.8s

    @-webkit-keyframes fadeIn {
        from {opacity: 0} 
        to {opacity: 1}
    }
    
    @keyframes fadeIn {
        from {opacity: 0} 
        to {opacity: 1}
    }
`

export default function WhiteListOpenButton({ status }: { status: string }) {
    const [isCopied, setIsCopied] = useState(false);
    const copyTextToClipboard = async (text: string) => {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    const handleShareClick = () => {
        copyTextToClipboard(document.URL)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <div>
            <div className="flex space-x-4 items-center">
                <div className="px-4 h-8 flex items-center text-black text-[14px] justify-center bg-[#29D9D0] rounded-lg uppercase">
                    {status}
                </div>
                <div className="w-6 cursor-pointer" onClick={handleShareClick}><ShareIcon /></div>
            </div>
            <div className='flex justify-end mt-2'>
                <div className="relative">
                    <div className='absolute right-0 top-0'>
                        {isCopied && <span className='text=[10px] text-white font-light whitespace-nowrap text-[#a0a0a0]'>URL copied</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}