import moment from 'moment'
import ChainIcon from '../ChainIcon'
export default function EndedIdoRow({ido}:{ido:any}) {    
    return (
        <div className="border-b last:border-0 border-[#112B40] flex py-6">
            <div className="min-w-[190px]" style={{width:"19%"}}>
                <div className='flex items-center'>
                    <img src={ido.logo} className='w-8 h-8 mr-4'/>
                    <div>
                        <div className="text-white text-[16px] p-0">{ido.project}</div>
                        <div className="text-[#919699] text-[12px] uppercase p-0">${ido.tokenSymbol}</div>
                    </div>
                </div>
            </div>
            <div className="min-w-[80px] justify-end text-[16px] flex items-center" style={{width:"9%"}}>${ido.yourInvestment.toLocaleString()}</div>
            <div className="min-w-[70px] justify-end text-[16px] flex items-center" style={{width:"7%"}}>{ido.participants.toLocaleString()}</div>
            <div className="min-w-[130px] justify-end text-[16px] flex items-center" style={{width:"13%"}}>
                ${ido.totalRaise.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="min-w-[100px] justify-end text-[16px] flex items-center" style={{width:"10%"}}>${ido.whitelistPrice}</div>
            <div className="min-w-[100px] justify-end text-[16px] flex items-center" style={{width:"10%"}}>${ido.currentPrice}</div>
            <div className="min-w-[110px] justify-end flex items-center" style={{width:"10%"}}>
                <div className='w-14 h-6 bg-[#00D98D] rounded text-black text-[12px] flex items-center justify-center font-normal'>
                    {ido.ATHSinceLaunch}
                </div>
            </div>
            <div className="min-w-[140px] justify-end text-[16px] flex items-center" style={{width:"15%"}}>{moment(ido.launchDate).format("MMM Do YY")}</div>
            <div className="min-w-[70px] justify-end flex items-center" style={{width:"7%"}}><ChainIcon chainId={ido.chainId} /></div>          
        </div>
    )
}