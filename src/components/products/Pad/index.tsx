import React, { useMemo, useState, useEffect, useRef  } from 'react'
import BuyButton from "./components/Buttons/BuyButton"
import moment from 'moment'
import EndedTabHeader from './components/EndedTable/EndedTabHeader'
import EndedIdoTable from './components/EndedTable'
import { useRouter } from 'next/router'
import FeaturedProjects from './components/FeaturedProjects'
import ConnectTier from './components/Buttons/ConnectTier'
import { Button } from "@mui/material";
import ProjectSubmitModal from './components/ProjectSubmitModal'
import { fetchProjectList } from 'src/state/Pad/hooks'
import { getChainIdFromName } from 'src/utils'

export default function Pad() {
    const [filterChain, setChainId] = useState(0)    
    const [tableWidth, setTableWidth]=useState(1)
    const [isOpenProjectSubmit, setIsOpenProjectSubmit] = useState(false);    
    const [IdoList, setIdoList] = useState<any>()
    const [IdoEndedProjects, setEndedProjects] = useState<any>()
    const router = useRouter()
    const widthRef = useRef<any>();    

    const handleTabClick = (id:number) => {
        setChainId(id)
    }        

    useEffect(() => {
        fetchProjectList().then(res => {            
          if (res) setIdoList(res.data)      
        })    
    },[])

    useEffect(() => {
        if (IdoList){                                                    
            if (filterChain===0) setEndedProjects(IdoList.filter(item => moment((item?.launchEndDate*1000) ?? '').isBefore(moment.now())))
            else  setEndedProjects(IdoList.filter(item => moment((item?.launchEndDate*1000) ?? '').isBefore(moment.now()) && getChainIdFromName(item.blockchain)===filterChain))
        }
    }, [IdoList, filterChain])

    const getListSize = () => {   
        if (widthRef){
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

    return (
        <>
            <ProjectSubmitModal isOpen={isOpenProjectSubmit} handleClose={handleCloseProjectSubmit} />            
            <div className="w-full" ref={widthRef}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <h1 className="text-[40px] font-medium">OrbitPad</h1>
                    <div className='flex flex-col md:flex-row gap-4 justify-center items-center'>                      
                        <ConnectTier />
                        <BuyButton />
                        <Button variant="outlined" sx={{minWidth:"160px", borderRadius:"12px"}} onClick={handleClickProjectSubmit}>
                            Submit your project
                        </Button>
                    </div>
                </div>
                <div className="mt-8">
                    <h1 className="text-white text-[24px]">Featured projects</h1>
                    <FeaturedProjects options={null} />
                </div>                
                {IdoEndedProjects && 
                    <>
                        <EndedTabHeader handleTabClick={handleTabClick} />
                        <EndedIdoTable idos={IdoEndedProjects} width={tableWidth} />
                    </>
                }
            </div>
        </>
    )
}