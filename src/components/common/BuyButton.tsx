import { Button } from "@mui/material";
import { AppTokenAddress } from '@app/shared/AppConstant';

const buyM31viaPCS = 'https://pancakeswap.finance/swap?outputCurrency=' + AppTokenAddress;

interface BuyButtonProps {
    className?: string;
}

export default function BuyButton({ className }: BuyButtonProps) {
    return (
        <Button
            variant="contained"
            className={className}
            href={buyM31viaPCS}
            target="_blank"
            sx={{ minWidth: "90px", borderRadius: "12px" }}
        >
            Buy M31
        </Button>
    )
}