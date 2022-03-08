import BSCIcon from "@app/components/svgs/BSCIcon"
import ETHIcon from "@app/components/svgs/ETHIcon"
import POLYGONIcon from "@app/components/svgs/POLYGONIcon"

export default function ChainIcon({ blockchain }: { blockchain: string }) {

    const iconsrc = {
        "ethereum": (<ETHIcon />),
        "bsc": (<BSCIcon />),
        "polygon": (<POLYGONIcon />),
    }
    return (
        <div className="w-10 h-10 flex items-center justify-center p-0">
            {iconsrc[blockchain.toLowerCase()]}
        </div>
    )
}