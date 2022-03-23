import React, { useMemo, useState, useEffect, useRef } from 'react'
import BuyButton from "./components/Buttons/BuyButton"
import moment from 'moment'
import EndedTabHeader from './components/EndedTable/EndedTabHeader'
import EndedIdoTable from './components/EndedTable'
import { useRouter } from 'next/router'
import FeaturedProjects from './components/FeaturedProjects'
import ConnectTier from './components/Buttons/ConnectTier'
import { Button } from "@mui/material"
import ProjectSubmitModal from './components/ProjectSubmitModal'
import { fetchProjectList } from 'src/state/Pad/hooks'

export default function Pad() {
    const [filterChain, setChainName] = useState('all')
    const [tableWidth, setTableWidth] = useState(1)
    const [isOpenProjectSubmit, setIsOpenProjectSubmit] = useState(false);
    const [IdoList, setIdoList] = useState<any>()
    const [IdoEndedProjects, setEndedProjects] = useState<any>()
    const router = useRouter()
    const widthRef = useRef<any>();

    const handleTabClick = (chainName: string) => {
        setChainName(chainName)
    }

    useEffect(() => {
        fetchProjectList().then(res => {
            if (res) setIdoList(res.data)
        })
    }, [])

    useEffect(() => {
        if (IdoList) {
            if (filterChain === 'all') setEndedProjects(IdoList.filter(item => moment((item?.launchEndDate * 1000) ?? '').isBefore(moment.now()) && Number(item?.launchEndDate) !== 0))
            else setEndedProjects(IdoList.filter(item => moment((item?.launchEndDate * 1000) ?? '').isBefore(moment.now()) && Number(item?.launchEndDate) !== 0 && item.blockchain.toLowerCase() === filterChain))
        }
    }, [IdoList, filterChain])

    const getListSize = () => {
        if (widthRef) {
            const newWidth = widthRef?.current?.clientWidth;
            setTableWidth(newWidth)
        }
    };

    const handleClickProjectSubmit = () => {
        setIsOpenProjectSubmit(true);
    };

    const handleCloseProjectSubmit = () => {
        setIsOpenProjectSubmit(false);
    };

    const handleCreateNewProject = () => {
        router.push({
            pathname: '/pad',
            query: { project: "register" },
        })
    };

    useEffect(() => {
        const newWidth = widthRef?.current?.clientWidth;
        setTableWidth(newWidth)
        window.addEventListener("resize", getListSize);
    }, []);

    useEffect(() => {
        const newWidth = widthRef?.current?.clientWidth;
        setTableWidth(newWidth)
    }, [IdoEndedProjects]);

    return (
        <>
            <ProjectSubmitModal isOpen={isOpenProjectSubmit} handleClose={handleCloseProjectSubmit} />
            <div className="w-full" ref={widthRef}>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex justify-between w-full lg:w-auto">
                        <h1 className="text-[35px] md:text-[40px] font-medium">OrbitPad</h1>
                        <div className="md:hidden">
                            <BuyButton />
                        </div>
                    </div>
                    <div className='w-full flex flex-col md:flex-row gap-4 justify-start lg:justify-end items-start md:items-center'>
                        <ConnectTier />
                        <div className="hidden md:block"><BuyButton /></div>
                        <div className="hidden md:block">
                            <Button variant="outlined" sx={{ minWidth: "160px", borderRadius: "12px" }} onClick={handleClickProjectSubmit}>
                                Submit your project
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <h1 className="text-white text-[21px] md:text-[24px]">Featured projects</h1>
                    <FeaturedProjects options={null} />
                </div>
                {IdoEndedProjects &&
                    <>
                        <EndedTabHeader handleTabClick={handleTabClick} />
                        <EndedIdoTable idos={IdoEndedProjects} width={tableWidth} />
                    </>
                }
                <div className="block md:hidden mt-4">
                    <Button variant="outlined" sx={{ minWidth: "160px", borderRadius: "12px" }} onClick={handleClickProjectSubmit}>
                        Submit your project
                    </Button>
                </div>
            </div>
        </>
    )
}