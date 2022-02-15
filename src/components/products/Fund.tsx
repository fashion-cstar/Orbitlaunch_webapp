import { Button, useTheme } from "@mui/material";
import BuyButton from "../common/BuyButton";

export default function Fund() {
    const theme = useTheme();

    return (
        <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-row items-center">
                <h1 className="text-[40px] font-medium">OrbitFund</h1>
                <div className="absolute right-10 space-x-3">
                    <BuyButton></BuyButton>
                    <Button
                        style={{ color: theme.palette.common.white }}
                        variant="outlined"
                        href='https://pancakeswap.finance/swap?outputCurrency=0xb46acb1f8d0ff6369c2f00146897aea1dfcf2414'>
                        Withdrawal
                    </Button>
                    <Button
                        style={{ color: theme.palette.common.white }}
                        variant="outlined"
                        href='https://pancakeswap.finance/swap?outputCurrency=0xb46acb1f8d0ff6369c2f00146897aea1dfcf2414'>
                        Deposit BUSD
                    </Button>
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-4">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>Current Investment</span>
                        </div>
                        <div className="text-xl">$18,643.74</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>ROI to Date</span>
                        </div>
                        <div className="text-xl">$1,637.26</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>Current Tier</span>
                        </div>
                        <div className="container">
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                                <div className="flex text-xl md:col-span-4 lg:col-span-3 xl:col-span-3 items-center">Tier 5</div>
                                <div className="flex text-slate-400 md:col-span-8 lg:col-span-9 xl:col-span-9 text-sm">Up to 8% monthly ROI</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container rounded-2xl bg-[#001926] p-4 items">
                <div className="space-y-4">
                    <div className="items-center text-l font-bold" style={{ color: theme.palette.common.white }}>
                        *Deposit Window Closing in &nbsp;<span className="text-app-primary">2 days 12hours 27 minutes</span> &nbsp;(April 1 - 12am UTC)
                    </div>
                    <hr style={{ borderColor: "#112B40" }} />
                </div>
                <div className="space-y-3 pt-4">
                    <div className="items-center text-xs mb-2" style={{ color: theme.palette.common.white }}>
                        Prior Month’s Total Investment:&nbsp;<span className="text-app-primary">$17,006.48</span>
                    </div>
                    <div className="items-center text-xs mb-2" style={{ color: theme.palette.common.white }}>
                        Prior Month’s Profit Returned to Investors:&nbsp;<span className="text-app-primary">$1,637.26</span>
                    </div>
                </div>
            </div>

            <div className="container rounded-2xl bg-[#001926] p-4 items">
                <div className="space-y-2">
                    <div className="text-l">Available Investment Tiers</div>
                </div>
            </div>
        </div>
    )
}