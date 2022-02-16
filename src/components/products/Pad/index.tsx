import React, { useMemo, useState, useEffect, useRef  } from 'react'
import BuyButton from "./components/Buttons/BuyButton"
import FeaturedList from './components/FeaturedList'
import moment from 'moment'
import { IDO_LIST } from "./constants/Idos"
import RightArrow from './components/Buttons/RightArrow'
import LeftArrow from './components/Buttons/LeftArrow'
import EndedTabHeader from './components/EndedTable/EndedTabHeader'
import EndedIdoTable from './components/EndedTable'
import { useRouter } from 'next/router'

const styleHeight = {
    height: '300px',
    textAlign: 'center' as 'center',
    color: 'grey',
}

export default function Pad() {
    const [filterChain, setChainId] = useState(0)
    const [IdoEndedFiltered, setIdoEndedFiltered]=useState<any>()
    const [tableWidth, setTableWidth]=useState(1)
    const widthRef = useRef<any>();
    const router = useRouter()
    const IdoListComplete = IDO_LIST // fetch this list from the server    
    const IdoUpcomingFiltered = useMemo(() => {        
        return IdoListComplete.filter(item => moment(item?.launchDate ?? '').isAfter(moment.now()))
    }, [IdoListComplete])    
    
    const [cardIndex, setCardIndex] = useState(0)    
    const handleLeftClick=()=>{
        if (cardIndex>0) setCardIndex(cardIndex-1)
        else setCardIndex(IdoUpcomingFiltered.length-1)                  
    }
    const handleRightClick=()=>{
        if (cardIndex<IdoUpcomingFiltered.length-1) setCardIndex(cardIndex+1)
        else setCardIndex(0)
    }
    const handleTabClick = (id:number) => {
        setChainId(id)
    }    
    const onDetail = (ido:any) => {
        router.push({
            pathname: '/pad',
            query: { project: ido.project },
          })
    }
    useEffect(() => {        
        setIdoEndedFiltered(IdoListComplete.filter(item => moment(item?.endDate ?? '').isBefore(moment.now())))        
    }, [IdoListComplete])

    useEffect(()=>{
        if (filterChain===0) setIdoEndedFiltered(IdoListComplete.filter(item => moment(item?.endDate ?? '').isBefore(moment.now())))
        else setIdoEndedFiltered(IdoListComplete.filter(item => moment(item?.endDate ?? '').isBefore(moment.now()) && item.chainId===filterChain))
    }, [filterChain])

    const getListSize = () => {   
        if (widthRef){
            const newWidth = widthRef?.current?.clientWidth;
            setTableWidth(newWidth)          
        }
    };

    useEffect(() => {
        const newWidth = widthRef?.current?.clientWidth;
        setTableWidth(newWidth)         
        window.addEventListener("resize", getListSize);
    }, []);
    return (
        <div className="w-full" ref={widthRef}>
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-[40px] font-medium">OrbitPad</h1>
                <BuyButton />
            </div>
            <div className="mt-8">
                <h1 className="text-white text-[24px]">Featured projects</h1>
                <FeaturedList IdoUpcomingFiltered={IdoUpcomingFiltered} cardIndex={cardIndex} onDetail={onDetail} />     
                    <div className='flex justify-end mt-4 w-full mr-8'>
                        <div className="flex flex-row gap-8">
                            <LeftArrow handleLeftClick={handleLeftClick} />
                            <RightArrow handleRightClick={handleRightClick} />
                        </div>
                    </div>
            </div>
            <EndedTabHeader handleTabClick={handleTabClick} />
            {IdoEndedFiltered && <EndedIdoTable idos={IdoEndedFiltered} width={tableWidth} />}
        </div>
    )
}