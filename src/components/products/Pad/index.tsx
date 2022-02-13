import React, { useMemo, useState, useEffect } from 'react'
import BuyButton from "@app/components/common/BuyButton"
import UpcomingCard from "./components/UpcomingCard"
import moment from 'moment'
import { IDO_LIST } from "./constants/Idos"
import RightArrow from './components/RightArrow'
import LeftArrow from './components/LeftArrow'

const styleHeight = {
    height: '300px',
    textAlign: 'center' as 'center',
    color: 'grey',
}

export default function Pad() {
    const IdoListComplete = IDO_LIST // fetch this list from the server
    const IdoListFiltered = useMemo(() => {        
        return IdoListComplete.filter(item => moment(item?.launchDate ?? '').isAfter(moment.now()))
    }, [IdoListComplete])
    const [cardIndex, setCardIndex] = useState(0)    
    const handleLeftClick=()=>{
        if (cardIndex>0) setCardIndex(cardIndex-1)
        else setCardIndex(IdoListFiltered.length-1)                  
    }
    const handleRightClick=()=>{
        if (cardIndex<IdoListFiltered.length-1) setCardIndex(cardIndex+1)
        else setCardIndex(0)
    }

    return (
        <>
        <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-row items-center">
                <h1 className="text-[40px] font-medium">OrbitPad</h1>
                <BuyButton></BuyButton>
            </div>
            <div className="mt-8">
                <h1 className="text-white text-[24px]">See upcoming projects</h1>
                <div className='overflow-hidden' style={{right:"-50px"}}>
                    <div className="mt-4 block whitespace-nowrap overflow-visible relative w-1">
                        {IdoListFiltered.map((item, index) => {
                            return (
                                <UpcomingCard status="Sold out" symbol={item.tokenSymbol} project={item.project} 
                                    chainId={item.chainId} totalRaise={item.totalRaise} allocationMin={item.allocationMin} 
                                    allocationMax={item.allocationMax} hero={item.hero} firstCardIndex={cardIndex} />
                            )
                        })}                    
                    </div>
                </div>
                <div className='flex justify-end mt-4 w-full mr-8'>
                    <div className="flex flex-row gap-8">
                        <LeftArrow handleLeftClick={handleLeftClick} />
                        <RightArrow handleRightClick={handleRightClick} />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}