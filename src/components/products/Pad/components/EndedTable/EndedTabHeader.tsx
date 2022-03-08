import React, { useMemo, useState, useEffect } from 'react'
import TabButton from "../Buttons/TabButton"
export default function EndedTabHeader({ handleTabClick }: { handleTabClick: (chainName: string) => void }) {
    const [chainName, setChainName] = useState('all')
    const handleClick = (chainName: string) => {
        setChainName(chainName)
        handleTabClick(chainName)
    }

    return (
        <div className="flex gap-6">
            <TabButton isSelected={chainName === 'all'} name="All" chainName={'all'} handleTabClick={handleClick} />
            <TabButton isSelected={chainName === 'bsc'} name="Binance Smart Chain" chainName={'bsc'} handleTabClick={handleClick} />
            <TabButton isSelected={chainName === 'ethereum'} name="Ethereum" chainName={'ethereum'} handleTabClick={handleClick} />            
        </div>
    )
}