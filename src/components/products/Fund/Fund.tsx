import { Web3ModalButton } from "@app/components/WalletConnect/Web3Modal";
import useFund from "@app/lib/hooks/useFund";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { tierInformation as tierInfo } from "@app/shared/TierLevels";
import { Button } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import BuyButton from "../../common/BuyButton";
import SliderCards from "../../common/SliderCards";
import DepositPopup from "./DepositPopup";

export default function Fund() {
    const activateProvider = Web3ModalButton();
    const snackbar = useSnackbar();
    const depositModalId = "deposit-busd-modal";
    const { account } = useEthers();
    const {
        startInvestmentPeriodDate,
        endInvestmentPeriodDate,
        currentInvestment,
        totalInvestedToDate,
        currentTierNo,
        currentTierPercentage,
        roiToDate,
        totalInvestors,
        disableDeposit,
        disableWithdraw,
        remainingTimeText,
        balance,
        withdraw
    } = useFund();
    const tierInformation = tierInfo;

    const handleOpenDepositModal = () => {
        const modal = document.getElementById(depositModalId);
        modal.style.display = "flex";
    }

    const handleWithdrawalSubmit = async () => {
        const weiAmount = ethers.utils.parseEther(balance);
        const withdrawalResult = await withdraw(weiAmount);
        if (!withdrawalResult.ok) {
            snackbar.snackbar.show(withdrawalResult.message, "error");
            return;
        }

        snackbar.snackbar.show("Deposit is succesfull", "success");
    }

    return (
        <div className="flex flex-col space-y-4 w-full">
            <DepositPopup id={depositModalId} />

            <div className="flex flex-row items-center">
                <h1 className="text-[40px] font-medium">OrbitFund</h1>
                <div className="absolute right-10 space-x-3">
                    <BuyButton></BuyButton>
                    {!!account
                        ? (<>
                            <Button
                                type="button"
                                disabled={disableWithdraw || currentTierNo === 0}
                                variant="outlined"
                                onClick={disableWithdraw ? null : async () => await handleWithdrawalSubmit()}
                                sx={{ borderRadius: "12px" }}
                            >
                                Withdrawal
                            </Button>
                            <Button
                                type="button"
                                disabled={disableDeposit || currentTierNo === 0}
                                onClick={(disableDeposit || currentTierNo === 0) ? null : handleOpenDepositModal}
                                variant="outlined"
                                sx={{ borderRadius: "12px" }}
                            >
                                {disableDeposit ? 'Deposit window closed' : 'Deposit BUSD'}
                            </Button>
                        </>)
                        : (
                            <Button
                                variant="outlined"
                                onClick={activateProvider}
                                className="relative"
                                sx={{ borderRadius: "12px" }}
                            >
                                Connect to Deposit
                            </Button>
                        )
                    }
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-4">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>{!!account ? 'Current Investment' : 'Investors'}</span>
                        </div>
                        <div className="text-xl">{!!account ? `$${currentInvestment}` : totalInvestors.toString()}</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>{!!account ? 'ROI to Date' : 'Total Invested to Date'}</span>
                        </div>
                        <div className="text-xl">${!!account ? '0' : totalInvestedToDate}</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>{!!account ? 'Current Tier' : 'Profit to Date'}</span>
                        </div>
                        <div className="container">
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                                {!!account
                                    ? <>
                                        <div className="flex text-xl md:col-span-4 lg:col-span-3 xl:col-span-3 items-center">Tier {currentTierNo}</div>
                                        <div className="flex text-slate-400 md:col-span-8 lg:col-span-9 xl:col-span-9 text-sm">Up to {currentTierPercentage}% monthly ROI</div>
                                    </>
                                    : <>
                                        <div className="flex text-xl md:col-span-4 lg:col-span-3 xl:col-span-3 items-center">$0</div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-row space-x-4">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="space-y-4">
                            <div className="items-center text-l text-white font-bold">
                                Deposit and Withdrawal Window {disableDeposit ? 'Opens' : 'Closes'} in &nbsp;
                                <span className="text-app-primary">{remainingTimeText}</span>
                                &nbsp;({disableDeposit ? startInvestmentPeriodDate : endInvestmentPeriodDate})
                            </div>
                            <hr style={{ borderColor: "#112B40" }} />
                        </div>
                        <div className="space-y-3 pt-4">
                            <div className="items-center text-xs text-white mb-2">
                                Prior Month’s Total Investment:&nbsp;<span className="text-app-primary">$0</span>
                            </div>
                            <div className="items-center text-xs text-white mb-2">
                                Prior Month’s Profit Returned to Investors:&nbsp;<span className="text-app-primary">$0</span>
                            </div>
                        </div>
                    </div>
                    {!account
                        ? (
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                                <div className="space-y-4">
                                    <div className="items-center text-l text-white font-bold">
                                        Learn About OrbitFund (Andromeda M31)
                                    </div>
                                    <hr style={{ borderColor: "#112B40" }} />
                                </div>
                                <div className="flex justify-center items-center flex-1 rounded-2xl bg-[#001926] p-4 text-gray-400">
                                    OrbitFund Video Coming Soon
                                </div>
                                {/* <div className="grid grid-cols-2 pt-2">
                                    <div className="ml-0 col-span-1">
                                        <iframe src="https://player.vimeo.com/video/146022717?color=0c88dd&title=0&byline=0&portrait=0&badge=0"
                                            width="100%"
                                            height="70%"
                                            frameBorder="0"
                                            allow="autoplay; picture-in-picture"
                                            allowFullScreen={true}>
                                        </iframe>
                                    </div>
                                </div> */}
                            </div>
                        )
                        : null
                    }
                </div>
            </div>

            <div className="rounded-2xl bg-[#001926] p-4">
                <div className="space-y-2">
                    <div className="text-l">Available Investment Tiers</div>
                </div>
                <SliderCards
                    cardInformationList={tierInformation}
                    selectedCardIndex={currentTierNo - 1}
                />
            </div>
        </div>
    )
}