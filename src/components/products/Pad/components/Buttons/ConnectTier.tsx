import { Web3ModalButton } from "@app/components/WalletConnect/Web3Modal";
import { Button } from "@mui/material";
import { useEthers } from "@usedapp/core";
import QuestionMark from "../svgs/QuestionMark"
import useFund from "@app/lib/hooks/useFund";

export default function ConnectTier() {

    const activateProvider = Web3ModalButton();
    const { account } = useEthers();
    const {
        currentTierNo,
    } = useFund();

    return (
        <div className="flex items-center h-10 space-x-4 bg-[#001926] p-4 justify-center" style={{ minWidth: "140px", borderRadius: "12px" }}>
            {/* <div className="w-6 cursor-pointer"><QuestionMark /></div> */}
            <div className="flex items-center space-x-5 text-[14px] font-bold uppercase text-app-primary">
                {!!account
                    ? (<>
                        <span>Tier {currentTierNo}</span>
                    </>)
                    : (
                        <Button
                            variant="outlined"
                            onClick={activateProvider}
                            className="relative"
                            sx={{ borderRadius: "12px" }}
                        >
                            Connect to view your tier
                        </Button>
                    )
                }

            </div>
        </div>
    )
}