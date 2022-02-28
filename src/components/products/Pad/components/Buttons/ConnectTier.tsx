import QuestionMark from "../svgs/QuestionMark"
export default function ConnectTier(){
    return (
        <div className="flex items-center h-10 space-x-4 bg-[#001926] p-4" style={{minWidth:"240px", borderRadius:"12px"}}>
            <div className="w-6 cursor-pointer"><QuestionMark /></div>
            <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary">
                <span>Connect to view your tier</span>
            </div>            
        </div>
    )
}