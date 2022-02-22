//@todo: add api dedicated to fund data
// get current investors amount
// get total profit to date
// get total invested to date

import { getTotalInvestors } from "@app/lib/hooks/useFundContract";
import { useEffect } from "react";

export default function FundCard() {

    let currentInvestorsAmount = null;
    
    // @todo: 1. should we use useEffect or direct await getTotalInvestors() ?
    // then how to manage the async call ?
    // useEffect(() => {
    //     getTotalInvestors().then((res) => {
    //         console.log({res})
    //         currentInvestorsAmount = res;
    //     })
    // }, []);

    
    const totalProfitToDate = "Coming soon";
    const totalInvestedToDate = "$15,258,526";

    return (
        <div className="flex flex-col flex-1 rounded-2xl bg-[#001926] p-4">
            <div className="mb-4 text-[24px] font-medium">OrbitFund</div>
            <p className=""><span className="text-[#867EE8]">Earn Up to 10%</span> Monthly ROI</p>
            <hr className="border-[#112B40] my-4" />
            <div className="flex flex-col space-y-2 text-sm">
                <p>Current Investors: <span className="text-[#867EE8]">{currentInvestorsAmount}</span></p>
                <p>Profit to Date: <span className="text-[#867EE8]">{totalProfitToDate}</span></p>
                <p>Total Invested to Date: <span className="text-[#867EE8]">{totalInvestedToDate}</span></p>
            </div>
        </div>
    )
}