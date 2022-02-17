//@todo: add api dedicated to fund data
// get current investors amount
// get total profit to date
// get total invested to date

export default function FundCard() {

    const currentInvestorsAmount = "18,643";
    const totalProfitToDate = "$2,737,195";
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