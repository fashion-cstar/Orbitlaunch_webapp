import { Button } from "@mui/material";
const buyM31viaPCS = 'https://pancakeswap.finance/swap?outputCurrency=0xb46acb1f8d0ff6369c2f00146897aea1dfcf2414';

export default function BuyButton() {
    return (
        <>
            <div className="absolute right-10">
                <Button
                    variant="contained"
                    href={buyM31viaPCS}
                    target="_blank">
                    Buy M31
                </Button>
            </div>
        </>
    )
}