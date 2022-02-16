import EndedIdoRow from "./EndedIdoRow"
export default function EndedIdoTable({idos, width}:{idos:any, width:number}) {   
    const w=width>=990?width:990;    
    return (
        <div className='overflow-hidden'>            
            <div className="block overflow-visible relative w-1">
                <div className="rounded-2xl bg-[#001926] px-6 pt-6 inline-block" style={{width:`${w}px`}}>
                    <div className="border-b-2 border-[#112B40] flex pb-4">
                        <div className="min-w-[190px] text-[#919699] text-[12px]" style={{width:"19%"}}>Project Name</div>
                        <div className="min-w-[80px] text-[#919699] text-[12px] text-right" style={{width:"9%"}}>Your Investment</div>
                        <div className="min-w-[70px] text-[#919699] text-[12px] text-right" style={{width:"7%"}}>Participants</div>
                        <div className="min-w-[130px] text-[#919699] text-[12px] text-right" style={{width:"13%"}}>Total Raised</div>
                        <div className="min-w-[100px] text-[#919699] text-[12px] text-right" style={{width:"10%"}}>Whitelist Price</div>
                        <div className="min-w-[100px] text-[#919699] text-[12px] text-right" style={{width:"10%"}}>Current Price</div>
                        <div className="min-w-[110px] text-[#919699] text-[12px] text-right" style={{width:"10%"}}>ATH Since Launch</div>
                        <div className="min-w-[140px] text-[#919699] text-[12px] text-right" style={{width:"15%"}}>Launched</div>
                        <div className="min-w-[70px] text-[#919699] text-[12px] text-right" style={{width:"7%"}}>Networks</div>          
                    </div>
                    {idos.map((item:any, index:number) => {
                        return (
                            <div key={index} className="font-extralight">
                                <EndedIdoRow ido={item} />
                            </div>
                        )
                    })}  
                </div>
            </div>            
        </div>
    )
}