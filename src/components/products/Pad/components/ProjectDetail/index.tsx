import React, { useMemo, useState, useEffect, useRef } from 'react'
import BuyButton from "@app/components/common/BuyButton"
import GoBack from "../Buttons/GoBack"
import WhiteListOpenButton from '../Buttons/WhiteListOpen'
import { useRouter } from 'next/router'
import Indicators from "@app/components/products/Pad/components/ProjectDetail/Indicators"
import Detail from '@app/components/products/Pad/components/ProjectDetail/Detail'
import About from '@app/components/products/Pad/components/ProjectDetail/About'
import FeaturedProjects from '@app/components/products/Pad/components/FeaturedProjects'
import { fetchProjectList } from 'src/state/Pad/hooks'
import JoinPresaleModal from '@app/components/products/Pad/components/ProjectDetail/JoinPresaleModal'
import { useLaunchTokenPrice } from 'src/state/Pad/hooks'
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from 'src/utils'
import { useEthers, useToken, ChainId } from "@usedapp/core";
import { useFundTier } from "src/state/Pad/hooks";

export default function ProjectDetail({ project }: { project: any }) {
    const [IdoList, setIdoList] = useState<any>()
    const [IdoProject, setIdoProject] = useState<any>()
    const [isOpenJoinPresale, setIsOpenJoinPresale] = useState(false);
    const [launchTokenPrice, setLaunchTokenPrice] = useState(0)
    const { launchTokenPriceCallback } = useLaunchTokenPrice()
    const { library, account, chainId } = useEthers()
    const hideTierCard = useRef(null)
    const router = useRouter()
    const currentTierNo = useFundTier();

    useEffect(() => {
        try {
            launchTokenPriceCallback(IdoProject.contractAddress).then((res: BigNumber) => {
                setLaunchTokenPrice(formatEther(res, 18, 5))
            }).catch((error: any) => {
                console.log(error)
            })
        } catch (error) {
            console.debug('Failed to get launch price', error)
        }
    }, [account, IdoProject])


    const handleBackClick = async () => {
        // router.back()        
        await router.push('/pad')
    }

    useEffect(() => {
        fetchProjectList().then(res => {
            if (res) setIdoList(res.data)
        })
    }, [])

    useEffect(() => {
        if (IdoList) {
            setIdoProject(IdoList.filter((item: any) => item.projectName === project)[0])
        }
    }, [IdoList, project])

    const handleClickJoinPresale = () => {
        setIsOpenJoinPresale(true);
    };

    const handleCloseJoinPresale = () => {
        setIsOpenJoinPresale(false);
    };

    const handleHideTierCard = (event) => {

    }

    return (
        <>
            {IdoProject && (<JoinPresaleModal project={IdoProject}
                isOpen={isOpenJoinPresale} launchTokenPrice={launchTokenPrice}
                currentTierNo={currentTierNo} handleClose={handleCloseJoinPresale} />)}
            <div className="w-full" onClick={(e) => handleHideTierCard(e)} >
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-[32px] font-medium">OrbitPad</h1>
                    <BuyButton />
                </div>
                {IdoProject && (<>
                    <div className="flex flex-col md:flex-row items-center justify-between mt-10">
                        <div>
                            <GoBack handleClick={handleBackClick} />
                            <p className='text-white text-[48px] font-normal mt-2'>{IdoProject.projectName}</p>
                            <p className='text-[#7A7A7A] text-[14px]'>Created by {IdoProject.createdBy ?? ''}</p>
                        </div>
                        <div className="flex flex-row justify-center mt-8 md:mt-0">
                            <WhiteListOpenButton url={IdoProject.whitelist ?? ''} />
                        </div>
                    </div>
                    <div className='mt-10'>
                        <div className='flex flex-col gap-6 lg:flex-row'>
                            <div className='flex flex-col space-y-6'>
                                <Indicators ido={IdoProject} launchTokenPrice={launchTokenPrice} currentTierNo={currentTierNo} hideTierCard={hideTierCard} />
                                <Detail ido={IdoProject} />
                            </div>
                            <div className='flex-1'><About ido={IdoProject} handleClickJoinPresale={handleClickJoinPresale} /></div>
                        </div>
                    </div>
                </>)}
                <div className="mt-8">
                    <h1 className="text-white text-[24px]">Featured projects</h1>
                    <FeaturedProjects options={null} />
                </div>
            </div>
        </>
    )
}