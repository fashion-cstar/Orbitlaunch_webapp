import ChainIcon from "../ChainIcon";
import { Button } from "@mui/material";
import { getJoinPresaleButtonActive } from 'src/utils'

export default function About({ ido, projectStatus, handleClickJoinPresale }: { ido: any, projectStatus: number, handleClickJoinPresale: () => void }) {
    return (
        <div className="min-w-[360px] rounded-2xl bg-[#001926] p-4">
            <div className='text-[#919699] text-[14px]'>
                <p>Allocations</p>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-white text-[32px]">
                    <span>{`$${ido.tierAllocation7} - $${ido.tierAllocation1}`}</span>
                </div>
                <div>
                    <ChainIcon blockchain={ido.blockchain} />
                </div>
            </div>
            <div className='text-[#919699] text-[14px] mt-6'>
                <p>{ido.shortDescription}</p>
            </div>
            <div className="mt-12">
                <Button
                    variant="contained"
                    sx={{ width: "100%", borderRadius: "12px" }}
                    onClick={handleClickJoinPresale}
                    disabled={!getJoinPresaleButtonActive(projectStatus)}
                >
                    Join Presale Now
                </Button>
            </div>
        </div>
    );
}