import { Button } from "@mui/material";
import { AppTokenAddress } from '@app/shared/AppConstant';

const buyM31viaPCS = 'https://pancakeswap.finance/swap?outputCurrency=' + AppTokenAddress;

export default function BuyButton() {
    return (
        <>
            <Button
                variant="contained"
                href={buyM31viaPCS}
                target="_blank">
                Buy M31
            </Button>
        </>
    )
}