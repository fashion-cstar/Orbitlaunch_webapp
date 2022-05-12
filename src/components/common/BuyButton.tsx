import React, { useMemo, useState, useEffect } from 'react'
import { Button } from "@mui/material"
import { AppTokenAddress } from '@app/shared/AppConstant'
import MigrationModal from 'src/components/products/MigrationModal'

const buyM31viaPCS = 'https://pancakeswap.finance/swap?outputCurrency=' + AppTokenAddress;

interface BuyButtonProps {
    className?: string;
}

export default function BuyButton({ className }: BuyButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    
    const handleClose = () => {
        setIsOpen(false)
    }
    return (
        <>
            <MigrationModal isOpen={isOpen} handleClose={handleClose} />
            {process.env.NEXT_PUBLIC_ORBITMIGRATION === 'true' ?
                <Button variant="contained"
                    className={className}
                    onClick={() => setIsOpen(true)}
                    sx={{ minWidth: "100px", borderRadius: "12px" }}
                >
                    Migrate
                </Button> :
                <Button
                    variant="contained"
                    className={className}
                    href={buyM31viaPCS}
                    target="_blank"
                    sx={{ minWidth: "90px", borderRadius: "12px" }}
                >
                    Buy Orbit
                </Button>
            }
        </>
    )
}