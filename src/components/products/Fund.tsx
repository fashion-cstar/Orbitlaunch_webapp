import { Button } from "@mui/material";
import BuyButton from "../common/BuyButton";

export default function Fund() {
    return (
        <>
            <div className="flex flex-col space-y-4 w-full">
                <div className="flex flex-row items-center">
                    <h1 className="text-[40px] font-medium">OrbitFund</h1>
                    <BuyButton></BuyButton>
                    <div className="absolute right-10">
                        <Button
                            color="primary"
                            variant="outlined"
                            href='https://pancakeswap.finance/swap?outputCurrency=0xb46acb1f8d0ff6369c2f00146897aea1dfcf2414'>
                            Withdrawal
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
                            <div className="container items-center">
                                <div className="grid grid-cols-1 md:grid-cols-12">
                                    <div className="flex text-xl md:col-span-4 lg:col-span-3 xl:col-span-2 items-center">Tier 5</div>
                                    <div className="flex text-slate-400 md:col-span-8 lg:col-span-9 xl:col-span-10 text-sm">Up to 8% monthly ROI</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}