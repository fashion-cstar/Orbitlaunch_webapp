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
import { useLaunchTokenCallback, useFundTier, useProjectStatus } from 'src/state/Pad/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from 'src/utils'
import { useEthers, useToken, ChainId } from "@usedapp/core"
import { getProjectStatusText } from 'src/utils'

export default function ProjectDetail({ project }: { project: any }) {
    const [IdoList, setIdoList] = useState<any>()
    const [IdoProject, setIdoProject] = useState<any>()
    const [isOpenJoinPresale, setIsOpenJoinPresale] = useState(false);
    const [launchTokenPrice, setLaunchTokenPrice] = useState(0)
    const [launchTokenDecimals, setLaunchTokenDecimals] = useState(0)
    const { launchTokenPriceCallback, launchTokenDecimalsCallback } = useLaunchTokenCallback() 
    const { library, account, chainId } = useEthers()
    const projectStatus=useProjectStatus(IdoProject)
    const hideTierCard = useRef(null)
    const router = useRouter()
    const currentTierNo = useFundTier();

    useEffect(() => {
        if (IdoProject){
            try {
                launchTokenDecimalsCallback(IdoProject.contractAddress, IdoProject.blockchain).then((res: BigNumber) => {
                    setLaunchTokenDecimals(res?res.toNumber():0)
                }).catch((error: any) => {
                    console.log(error)
                })
            } catch (error) {
                console.debug('Failed to get launch decimals', error)
            } 
        }
    }, [IdoProject])

    useEffect(() => {
        if (launchTokenDecimals>0) {
            try {
                launchTokenPriceCallback(IdoProject.contractAddress, IdoProject.blockchain).then((res: BigNumber) => {
                    setLaunchTokenPrice(formatEther(res, 18, 5))
                }).catch((error: any) => {
                    console.log(error)
                })
            } catch (error) {
                console.debug('Failed to get launch price', error)
            }
        }
    }, [launchTokenDecimals, IdoProject])

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
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-10 ml-4 md:ml-0">
                        <div>
                            <GoBack handleClick={handleBackClick} />
                            <p className='text-white text-[40px] md:text-[48px] font-normal mt-2'>{IdoProject.projectName}</p>
                            <p className='text-[#7A7A7A] text-[14px]'>Category</p>
                            <p className='text-white text-[14px]'>{IdoProject.category}</p>
                        </div>
                        <div className="flex flex-row justify-center mt-8 md:mt-0">
                            <WhiteListOpenButton status={getProjectStatusText(projectStatus)} />
                        </div>
                    </div>
                    <div className='mt-10'>
                        <div className='flex flex-col gap-6 lg:flex-row'>
                            <div className='flex flex-col space-y-6'>
                                <Indicators ido={IdoProject} launchTokenPrice={launchTokenPrice} currentTierNo={currentTierNo} hideTierCard={hideTierCard} />
                                <Detail ido={IdoProject} />
                            </div>
                            <div className='flex-1'><About ido={IdoProject} projectStatus={projectStatus} handleClickJoinPresale={handleClickJoinPresale} /></div>
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