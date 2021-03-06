import ChainIcon from "../ChainIcon";
import { Button } from "@mui/material";
import { getJoinPresaleButtonActive, getJoinPresaleButtonText } from 'src/utils'

export default function About({ ido, projectStatus, handleClickJoinPresale, handleClickClaimTokens }:
    { ido: any, projectStatus: number, handleClickJoinPresale: () => void, handleClickClaimTokens: () => void }) {
    return (
        <div className="min-w-[300px] rounded-2xl bg-[#001926] p-4">
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
                {(projectStatus >= 6 && projectStatus<=8)? < Button
                    variant="contained"
                    sx={{ width: "100%", borderRadius: "12px" }}
                    onClick={handleClickClaimTokens}
                    disabled={projectStatus == 8}
                >
                    Claim Tokens
                </Button>:
                <Button
                    variant="contained"
                    sx={{ width: "100%", borderRadius: "12px" }}
                    onClick={handleClickJoinPresale}
                    disabled={!getJoinPresaleButtonActive(projectStatus)}
                >
                    {getJoinPresaleButtonText(projectStatus)}
                </Button>}
            </div>
        </div >
    );
}