import React, { useMemo, useState, useEffect } from 'react'
import TabButton from "../Buttons/TabButton"
export default function EndedTabHeader({ handleTabClick }: { handleTabClick: (chainId: number) => void }) {
    const [id, setChainId] = useState(0)
    const handleClick = (id: number) => {
        setChainId(id)
        handleTabClick(id)
    }

    return (
        <div className="flex gap-6">
            <TabButton isSelected={id === 0} name="All" chainId={0} handleTabClick={handleClick} />
            <TabButton isSelected={id === 56} name="Binance Smart Chain" chainId={56} handleTabClick={handleClick} />
            <TabButton isSelected={id === 1} name="Ethereum" chainId={1} handleTabClick={handleClick} />
            <TabButton isSelected={id === 137} name="Polygon" chainId={137} handleTabClick={handleClick} />
        </div>
    )
}