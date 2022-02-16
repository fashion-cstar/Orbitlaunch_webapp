import BSCIcon from "@app/components/products/Pad/components/svgs/BSCIcon"
import ETHIcon from "@app/components/products/Pad/components/svgs/ETHIcon"
import POLYGONIcon from "@app/components/products/Pad/components/svgs/POLYGONIcon"

export default function ChainIcon({chainId}:{chainId:number}) {

    const iconsrc={
        1: (<ETHIcon />),
        56: (<BSCIcon />),
        137: (<POLYGONIcon />),
    }
    return (        
        <div className="w-10 h-10 flex items-center justify-center p-0">
            {iconsrc[chainId]}
        </div>
    )
}