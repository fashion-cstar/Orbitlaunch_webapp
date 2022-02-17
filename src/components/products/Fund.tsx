import { Button } from "@mui/material";
import BuyButton from "../common/BuyButton";
import SliderCards from "../common/SliderCards";

export default function Fund() {

    const tierInformation = [
        { tierNo: 1, requiredTokens: "250,000", monthlyPercent: "10" },
        { tierNo: 2, requiredTokens: "100,000", monthlyPercent: "9.5" },
        { tierNo: 3, requiredTokens: "50,000", monthlyPercent: "9" },
        { tierNo: 4, requiredTokens: "25,000", monthlyPercent: "8.5" },
        { tierNo: 5, requiredTokens: "10,000", monthlyPercent: "8" },
        { tierNo: 6, requiredTokens: "5,000", monthlyPercent: "7.5" },
        { tierNo: 7, requiredTokens: "2,500", monthlyPercent: "7" }
    ]

    return (
        <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-row items-center">
                <h1 className="text-[40px] font-medium">OrbitFund</h1>
                <div className="absolute right-10 space-x-3">
                    <BuyButton></BuyButton>
                    <Button
                        className="text-white"
                        variant="outlined"
                        href='https://pancakeswap.finance/swap?outputCurrency=0xb46acb1f8d0ff6369c2f00146897aea1dfcf2414'>
                        Withdrawal
                    </Button>
                    <Button
                        className="text-white"
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
                    <div className="items-center text-l text-white font-bold">
                        *Deposit Window Closing in &nbsp;<span className="text-app-primary">2 days 12hours 27 minutes</span> &nbsp;(April 1 - 12am UTC)
                    </div>
                    <hr style={{ borderColor: "#112B40" }} />
                </div>
                <div className="space-y-3 pt-4">
                    <div className="items-center text-xs text-white mb-2">
                        Prior Month’s Total Investment:&nbsp;<span className="text-app-primary">$17,006.48</span>
                    </div>
                    <div className="items-center text-xs text-white mb-2">
                        Prior Month’s Profit Returned to Investors:&nbsp;<span className="text-app-primary">$1,637.26</span>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-[#001926] p-4">
                <div className="space-y-2">
                    <div className="text-l">Available Investment Tiers</div>
                </div>
                <SliderCards cardInformationList={tierInformation} firstCardIndex={0} />
            </div>
        </div>
    )
}