import useFund from "@app/lib/hooks/useFund";
import { useEthers } from "@usedapp/core";

export default function FundCard() {

    const { account } = useEthers();

    const {
        currentInvestment,
        currentTierNo,
        currentTierPercentage,
        roiToDate,
        totalInvestors
    } = useFund();

    return (
        <>
            {(!account) && (
                <div className="flex flex-col flex-1 rounded-2xl bg-[#001926] p-4">
                    <div className="mb-4 text-[24px] font-medium">OrbitFund</div>
                    <p className=""><span className="text-[#867EE8]">Earn Up to 10%</span> Monthly ROI</p>
                    <hr className="border-[#112B40] my-4" />
                    <div className="flex flex-col space-y-2 text-sm">
                        <p>Current Investors: <span className="text-[#867EE8]">{totalInvestors}</span></p>
                        <p>Profit to Date: <span className="text-[#867EE8]">{roiToDate}</span></p>
                        <p>Total Invested to Date: <span className="text-[#867EE8]">{currentInvestment}</span></p>
                    </div>
                </div>
            )}

            {(!!account) && (
                <div className="flex flex-col flex-1 rounded-2xl bg-[#001926] p-4">
                    <div className="mb-4 text-[24px] font-medium">OrbitFund</div>
                    <p className=""><span className="text-[#867EE8]">Investment Tier {currentTierNo}</span> <span className="text-sm text-[#BAB8CC]">Up to {currentTierPercentage}% monthly ROI</span></p>
                    <hr className="border-[#112B40] my-4" />
                    <div className="flex flex-col space-y-2 text-sm">
                        <p>Current Investment: <span className="text-[#867EE8]">{currentInvestment}</span></p>
                        <p>ROI to Date: <span className="text-[#867EE8]">{roiToDate}</span></p>
                    </div>
                </div>
            )}
        </>

    )
}