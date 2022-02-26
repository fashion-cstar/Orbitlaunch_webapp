import GoBackIcon from "@app/components/products/Pad/components/svgs/GoBackIcon"
import { useRouter } from "next/router";

export default function GoBack({handleClick}:{handleClick:()=>void}) {
    const router = useRouter();

    const goBack = () => {
        router.back();
    }

    return (
        <div className="cursor-pointer flex" onClick={goBack}>
            <div className="w-6"><GoBackIcon /></div>
            <p className="text-[#919699] text-[16px]">Go Back</p>
        </div>
    )
}