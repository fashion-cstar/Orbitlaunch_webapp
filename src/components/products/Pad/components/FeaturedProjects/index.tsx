import React, { useMemo, useState, useEffect, useRef } from 'react'
import FeaturedCard from "./FeaturedCard"
import moment from 'moment'
import FeaturedList from './FeaturedList'
import { useRouter } from 'next/router'
import RightArrow from '../Buttons/RightArrow'
import LeftArrow from '../Buttons/LeftArrow'
import { fetchProjectList } from 'src/state/Pad/hooks'

export default function FeaturedProjects({ options }: { options: any }) {
    const [IdoList, setIdoList] = useState<any>()
    const router = useRouter()
    const [IdoFeaturedProjects, setFeaturedProjects] = useState<any>()

    const [cardIndex, setCardIndex] = useState(0)

    useEffect(() => {
        fetchProjectList().then(res => {
            if (res) setIdoList(res.data)
        })
    }, [])

    useEffect(() => {
        if (IdoList) {        
            setFeaturedProjects(IdoList.filter(item => true))
            // setFeaturedProjects(IdoList.filter(item => moment((item?.launchEndDate * 1000) ?? '').isAfter(moment.now())))
        }
    }, [IdoList])

    const handleLeftClick = () => {
        if (cardIndex > 0) setCardIndex(cardIndex - 1)
        else setCardIndex(IdoFeaturedProjects.length - 1)
    }

    const handleRightClick = () => {
        if (cardIndex < IdoFeaturedProjects.length - 1) setCardIndex(cardIndex + 1)
        else setCardIndex(0)
    }

    const onDetail = (ido: any) => {
        router.push({
            pathname: '/pad',
            query: { project: ido.projectName },
        })
    }

    let justifyCenter = (!!options && !!options.center) ? true : false;

    return (
        <div>
            {IdoFeaturedProjects && <>
                <FeaturedList IdoUpcomingFiltered={IdoFeaturedProjects} cardIndex={cardIndex} onDetail={onDetail} options={options} />
                {(justifyCenter) ?
                    <>
                        <div className='flex justify-center mt-4 w-full mr-8'>
                            <div className="flex flex-row gap-8">
                                <LeftArrow handleLeftClick={handleLeftClick} />
                                <RightArrow handleRightClick={handleRightClick} />
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className='flex justify-end mt-4 w-full mr-8'>
                            <div className="flex flex-row gap-8">
                                <LeftArrow handleLeftClick={handleLeftClick} />
                                <RightArrow handleRightClick={handleRightClick} />
                            </div>
                        </div>
                    </>}
            </>}
        </div>
    )
}