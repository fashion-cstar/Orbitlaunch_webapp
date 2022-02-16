import { Button } from "@mui/material";
import ShareIcon from "../svgs/ShareIcon";
export default function WhiteListOpenButton({url}:{url:string}) {
    return (
        <>
            <div className="flex space-x-4 items-center">
                <a
                    href={url}
                    target="_blank"
                    className="w-36 h-8 cursor-pointer flex items-center text-black text-[14px] hover:bg-[#10b9b0] justify-center bg-[#29D9D0] rounded-lg"                   
                >
                    WHITELIST OPEN
                </a>
                <div className="w-6"><ShareIcon /></div>
            </div>
        </>
    )
}