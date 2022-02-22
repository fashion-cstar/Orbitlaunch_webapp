import React, { useMemo, useState, useEffect, useRef } from 'react'
import FeaturedList from '@app/components/products/Pad/components/FeaturedList'
import moment from 'moment'
import { IDO_LIST } from '@app/components/products/Pad/constants/Idos'
import RightArrow from '@app/components/products/Pad/components/Buttons/RightArrow'
import LeftArrow from '@app/components/products/Pad/components/Buttons/LeftArrow'
import { useRouter } from 'next/router'

export default function PadCard() {

    const router = useRouter()
    const IdoListComplete = IDO_LIST // fetch this list from the server    
    const IdoUpcomingFiltered = useMemo(() => {
        return IdoListComplete.filter(item => moment(item?.launchDate ?? '').isAfter(moment.now()))
    }, [IdoListComplete])

    const [cardIndex, setCardIndex] = useState(0)
    const handleLeftClick = () => {
        if (cardIndex > 0) setCardIndex(cardIndex - 1)
        else setCardIndex(IdoUpcomingFiltered.length - 1)
    }
    const handleRightClick = () => {
        if (cardIndex < IdoUpcomingFiltered.length - 1) setCardIndex(cardIndex + 1)
        else setCardIndex(0)
    }
    const onDetail = (ido: any) => {
        router.push({
            pathname: '/pad',
            query: { project: ido.project },
        })
    }

    const featuredListOptions = {
        'bgCard': '#06111C',
        'width': '250px',
        'titleFontSize': '18px',
        'descFontSize': '12px',
    }

    return (
        <div className="flex flex-col flex-1 rounded-2xl bg-[#001926] p-4">
            <div className="mb-4 text-[24px] font-medium">OrbitPad</div>
            <FeaturedList IdoUpcomingFiltered={IdoUpcomingFiltered} cardIndex={cardIndex} onDetail={onDetail} options={featuredListOptions} />
            <div className='flex justify-center mt-4 w-full mr-8'>
                <div className="flex flex-row gap-8">
                    <LeftArrow handleLeftClick={handleLeftClick} />
                    <RightArrow handleRightClick={handleRightClick} />
                </div>
            </div>
        </div>
    )
}