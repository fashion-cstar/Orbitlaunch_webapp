import React, { useMemo, useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button';
import Modal from 'src/components/common/Modal'
import swapTokens from '@app/shared/SwapTokens'
import SearchInput from './SearchInput';
import { debounce } from "lodash"
import SearchTokenInput from './SearchTokenInput';

interface ModalProps {
    isOpen: boolean
    inToken: any
    outToken: any
    handleClose: () => void
}

const selectContentStyle = {  
    overflow:'auto', 
    maxHeight:'calc(100vh - 350px)'
}

export default function SelectTokenModal({ isOpen, inToken, outToken, handleClose }: ModalProps) {
    const [searchText, setSearchText] = useState('')
    const [isFilterTokens, setIsFilterTokens] = useState(false)
    const [filteredTokens, setFilteredTokens] = useState<any[]>(swapTokens)
    
    useEffect(() => {
        if (isFilterTokens) {            
            setFilteredTokens(swapTokens.filter((item) => !searchText || item.symbol.toLowerCase().indexOf(searchText.toLowerCase())>0 || item.name.toLowerCase().indexOf(searchText.toLowerCase())>0))
            setIsFilterTokens(false)
        }
    }, [isFilterTokens])

    const filterTokens = useRef(
        debounce(async () => {
            setIsFilterTokens(true)
        }, 500)
    ).current;

    useEffect(() => {
        filterTokens()
    }, [searchText])

    const onSearchTextChange = (val: string) => {
        setSearchText(val)
    }

    const onClose = () => {
        setSearchText('')
        handleClose()
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                header="Select a Token"
                handleClose={onClose}
            >
                <div className='m-4 md:m-6 w-[250px] md:w-[300px]'>
                    <SearchTokenInput id="psr_token_search" value={searchText} onChange={onSearchTextChange} />
                    <div className='mt-4' style={selectContentStyle}>
                        {
                            filteredTokens.map((item, index) => {
                                if (item?.symbol.toLowerCase() === inToken?.symbol.toLowerCase() || item?.symbol.toLowerCase() === outToken?.symbol.toLowerCase()){
                                    return (                                    
                                        <div className='flex gap-4 items-center p-2 w-full rounded-md' key={index} >
                                            <div className="flex items-center justify-center w-7 h-7">
                                                <img src={item?.logoURI} className='w-[22px] h-[22px] md:w-[24px] md:h-[24px] opacity-70' />
                                            </div>                                        
                                            <div className='flex flex-col'>
                                                <div className="text-[14px] md:text-[16px] text-[#cccccc] font-semibold">{item?.name}</div>
                                                <div className="text-[12px] md:text-[14px] text-slate-400">{item?.symbol}</div>
                                            </div>
                                        </div>
                                    )
                                }else{
                                    return (                                    
                                        <div className='flex gap-4 items-center p-2 w-full cursor-pointer hover:bg-[#0A171F] rounded-md' key={index} >
                                            <div className="flex items-center justify-center w-7 h-7">
                                                <img src={item?.logoURI} className='w-[22px] h-[22px] md:w-[24px] md:h-[24px]' />
                                            </div>                                        
                                            <div className='flex flex-col'>
                                                <div className="text-[14px] md:text-[16px] text-white font-semibold">{item?.name}</div>
                                                <div className="text-[12px] md:text-[14px] text-slate-200">{item?.symbol}</div>
                                            </div>
                                        </div>
                                    )
                                }                                
                            })
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}
