import EndedIdoMobileRow from "./EndedIdoMobileRow";
import EndedIdoRow from "./EndedIdoRow"

export default function EndedIdoTable({ idos, width }: { idos: any, width: number }) {
    const w = width >= 990 ? width : 990;
    return (
        <div>
            <div className="hidden lg:block">
                <div className='overflow-hidden mt-4'>
                    <div className="block overflow-visible relative w-1">
                        <div className="rounded-2xl bg-[#001926] px-6 pt-6 inline-block" style={{ width: `${w}px` }}>
                            <div className="border-b-2 border-[#112B40] flex pb-4">
                                <div className="flex items-center min-w-[190px] text-[#919699] text-[12px]" style={{ width: "19%" }}>Project Name</div>
                                <div className="flex items-center min-w-[80px] text-[#919699] text-[12px]" style={{ width: "9%" }}>
                                    <span className="w-full text-right">Your Investment</span>
                                </div>
                                <div className="flex items-center min-w-[70px] text-[#919699] text-[12px]" style={{ width: "7%" }}>
                                    <span className="w-full text-right">Participants</span>
                                </div>
                                <div className="flex items-center min-w-[130px] text-[#919699] text-[12px]" style={{ width: "13%" }}>
                                    <span className="w-full text-right">Total Raised</span>
                                </div>
                                <div className="flex items-center min-w-[100px] text-[#919699] text-[12px]" style={{ width: "10%" }}>
                                    <span className="w-full text-right">Whitelist Price</span>
                                </div>
                                <div className="flex items-center min-w-[100px] text-[#919699] text-[12px]" style={{ width: "10%" }}>
                                    <span className="w-full text-right">ATH Since Launch</span>
                                </div>
                                <div className="flex items-center min-w-[110px] text-[#919699] text-[12px]" style={{ width: "10%" }}>
                                    <span className="w-full text-right pr-5">ROI</span>
                                </div>
                                <div className="flex items-center min-w-[140px] text-[#919699] text-[12px]" style={{ width: "15%" }}>
                                    <span className="w-full text-right">Presale Completed</span>
                                </div>
                                <div className="flex items-center min-w-[70px] text-[#919699] text-[12px]" style={{ width: "7%" }}>
                                    <span className="w-full text-right">Networks</span>
                                </div>
                            </div>
                            <div className="">
                                {idos.map((item: any, index: number) => {
                                    return (
                                        <div key={index} className="font-extralight border-b border-[#112B40] last:border-b-0">
                                            <EndedIdoRow ido={item} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl lg:hidden mt-2">
                {idos.map((item: any, index: number) => {
                    return (
                        <EndedIdoMobileRow ido={item} key={index} />
                    )
                })}
            </div>
        </div>
    )
}