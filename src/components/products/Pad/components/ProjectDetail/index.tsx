import React, { useMemo, useState, useEffect, useRef  } from 'react'
import BuyButton from "@app/components/common/BuyButton"
import GoBack from "../Buttons/GoBack"
import { IDO_LIST } from "../../constants/Idos"
import WhiteListOpenButton from '../Buttons/WhiteListOpen'
export default function EndedIdoTable({project}:{project:any}) {    
    const IdoListComplete = IDO_LIST // fetch this list from the server    
    const IdoProject = useMemo(() => {        
        return IdoListComplete.filter(item => item.project===project)[0]
    }, [IdoListComplete])    
    const handleBackClick = () =>{

    }
    
    return (
        <div className="w-full">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-[32px] font-medium">OrbitPad</h1>
                <BuyButton />
            </div>   
            <div className="flex flex-row items-center justify-between mt-10">
                <div>
                    <GoBack handleClick={handleBackClick} />
                    <p className='text-white text-[48px] font-normal mt-2'>{IdoProject.project}</p>
                    <p className='text-[#7A7A7A] text-[14px]'>Created by {IdoProject.createdBy}</p>
                </div>
                <div className="flex flex-row justify-center">
                    <WhiteListOpenButton url={IdoProject.whitelist} />
                </div>
            </div>       
        </div>
    )
}