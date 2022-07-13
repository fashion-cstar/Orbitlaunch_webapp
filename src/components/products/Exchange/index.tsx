import React, { useMemo, useState, useEffect, useRef } from 'react'
import BuyButton from "../../common/BuyButton";
import SearchInput from './components/SearchInput'
import LoadingButton from '@mui/lab/LoadingButton'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Indicators from '../Board/Indicators'
import { AppTokenAddress } from "@app/shared/AppConstant"
import TvChart from './components/TvChart'
import OrbitSwap from './components/OrbitSwap'
import Transactions from './components/Transactions'
import PromotedVideos from './components/PromotedVideos'
import DriveTradingTokens from './components/DriveTradingTokens'
import PromotedTrendingTokens from './components/PromotedTrendingTokens'

export default function Exchange() {
    const [width, setWidth] = useState(0)
    const widthRef = useRef<any>()
    const [searchText, setSearchText] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    const getListSize = () => {
        if (widthRef) {
            const newWidth = widthRef?.current?.clientWidth;
            setWidth(newWidth)
        }
    };

    useEffect(() => {
        const newWidth = widthRef?.current?.clientWidth;
        setWidth(newWidth)
        window.addEventListener("resize", getListSize);
    });

    const onSearchTextChange = (val: string) => {
        setSearchText(val)
    }

    const handleSearchClick = () => {
        if (searchText) {
           
        }
    }

    return (
        <>
            <div className="block relative w-full" ref={widthRef}></div>
            <div className="block relative w-1">
                <div className="inline-block flex flex-col space-y-4" style={{ width: `${width}px` }}>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex justify-between">
                            <h1 className="text-[32px] md:text-[40px] font-medium">OrbitExchange</h1>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <SearchInput id="psr_token_search" value={searchText} onChange={onSearchTextChange} />
                            <LoadingButton
                                onClick={handleSearchClick}
                                startIcon={<SearchOutlinedIcon />}
                                loading={isSearching}
                                loadingPosition="start"
                                variant="outlined"
                                sx={{ borderRadius: "12px" }}
                            >
                                Search
                            </LoadingButton>
                        </div>
                        <div>
                            <BuyButton />
                        </div>
                    </div>                    
                    <div className="w-full flex flex-col xl:flex-row gap-4">
                        <div className="xl:basis-2/3 w-full">
                            <Indicators />
                            <TvChart address={AppTokenAddress} symbol={'M31'} />
                        </div>
                        <div className="xl:basis-1/3 w-full">
                            <div className="flex flex-col gap-4">
                               <OrbitSwap />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col xl:flex-row gap-4 xl:items-stretch">
                        <div className="xl:basis-3/5 w-full">
                           <Transactions />
                        </div>
                        <div className="xl:basis-2/5 w-full">
                            <PromotedVideos />
                        </div>
                    </div>
                    <div className="w-full flex flex-col xl:flex-row gap-4">
                        <div className="xl:basis-1/2 w-full">
                           <DriveTradingTokens />
                        </div>
                        <div className="xl:basis-1/2 w-full">
                            <PromotedTrendingTokens />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}