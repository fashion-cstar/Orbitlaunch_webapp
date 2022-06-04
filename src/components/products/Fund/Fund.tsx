import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { Button } from "@mui/material";
import { Web3ModalButton } from "@app/components/WalletConnect/Web3Modal";
import useFund from "@app/lib/hooks/useFund";
import useFund_V2 from "@app/lib/hooks/useFund_V2";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { tierInformation as tierInfo } from "@app/shared/TierLevels";
import { checkUserAlreadyReferred, getUserReferralInfo, registerSoloUser, registerUserWithParent } from "@app/state/Referral";
import { ReferralStatus } from "@app/constants/constant";
import BuyButton from "../../common/BuyButton";
import SliderCards from "../../common/SliderCards";
import DepositPopup from "./DepositPopup";
import useFundWithV3 from "@app/lib/hooks/useFundWithV3";
import useFundWithV4 from "@app/lib/hooks/useFundWithV4";
import { useLockActions } from "@app/contexts"
import FundLockTierModal from "../TierActions/FundLockTierModal";
import { TWENTY_SIX_DAYS, ONEDAY_SECS } from "@app/utils";
import LoadingButton from '@mui/lab/LoadingButton';
import { useTokenBalanceCallback } from 'src/state/hooks'
import {
    OrbitStableTokenAddressWithV3 as OrbitStableTokenAddressWithV4
} from "@app/shared/AppConstant";
import { BigNumber } from "ethers";
import { formatEther } from "@ethersproject/units";

export default function Fund() {
    const activateProvider = Web3ModalButton();
    const router = useRouter();
    const snackbar = useSnackbar();
    const depositModalId = "deposit-busd-modal";
    const { account, library } = useEthers();
    const [version, setVersion] = useState(2);
    const [isOpenDeposit, setIsOpenDeposit] = useState(false)
    const { tokenBalanceCallback } = useTokenBalanceCallback()
    const { userClaimedTier, unlockTimes, updateTierAndUnlockTime } = useLockActions()
    const {
        totalInvestedToDate_V1,
        userLastInvestment_V1,
        roiToDate_V1,
        userReturned_V1,
        totalInvestors_V1,
        disableWithdraw_V1,
        totalProfit_V1,
        totalReturned_V1,
        isWithdrawApproving: isWithdrawApprovingV1,
        isWithdrawing: isWithdrawingV1,
        withdraw_V1
    } = useFund();

    const {
        startInvestmentPeriodDate,
        endInvestmentPeriodDate,
        currentInvestment,
        totalInvestedToDate,
        currentTierNo: currentTierNoV2,
        roiToDate,
        totalInvestors,
        disableDeposit,
        profitUpToDate,
        disableWithdraw: disableWithdraw_V2,
        isWithdrawApproving: isWithdrawApprovingV2,
        isWithdrawing: isWithdrawingV2,
        balance: balanceV2,
        withdraw: withdraw_V2
    } = useFund_V2();

    const {
        disableDeposit: disableDepositV3,
        currentTierNo: currentTierNoV3,
        currentInvestment: currentInvestmentV3,
        disableWithdraw: disableWithdraw_V3,
        isWithdrawApproving: isWithdrawApprovingV3,
        isWithdrawing: isWithdrawingV3,
        balance: balanceV3,
        withdraw: withdraw_V3,
    } = useFundWithV3();

    const {
        disableDeposit: disableDepositV4,
        currentInvestment: currentInvestmentV4,
        disableWithdraw: disableWithdraw_V4,
        balance: balanceV4,
        isWithdrawApproving: isWithdrawApprovingV4,
        isWithdrawing: isWithdrawingV4,
        withdraw: withdraw_V4
    } = useFundWithV4();

    const [totalReferred, setTotalReferred] = useState(0);
    const [referredBy, setReferredBy] = useState('');
    const [commissionEarned, setCommissionEarned] = useState(0);
    const tierInformation = tierInfo;
    const { id } = router.query;
    const [isOpenLockTier, setIsOpenLockTier] = useState(false)

    const handleOpenDepositModalV4 = () => {
        if (Math.floor(unlockTimes / ONEDAY_SECS) < TWENTY_SIX_DAYS) {
            setIsOpenLockTier(true)
        } else {
            setVersion(4);
            setIsOpenDeposit(true)
        }
    }

    const handleWithdrawalSubmitV2 = async () => {
        const weiAmount = ethers.utils.parseEther(balanceV2);
        const withdrawalResult = await withdraw_V2(weiAmount);
        if (!withdrawalResult.ok) {
            snackbar.snackbar.show(withdrawalResult.message, "error");
            return;
        }

        snackbar.snackbar.show("Withdraw is succesfull (v2)", "success");
    }

    const handleWithdrawalSubmitV3 = async () => {
        const weiAmount = ethers.utils.parseEther(balanceV3);
        const withdrawalResult = await withdraw_V3(weiAmount);
        if (!withdrawalResult.ok) {
            snackbar.snackbar.show(withdrawalResult.message, "error");
            return;
        }

        snackbar.snackbar.show("Withdraw is succesfull (v3)", "success");
    }

    const handleWithdrawalSubmitV4 = async () => {
        let bal = balanceV4
        if (Number(bal) <= 0) {
            try {
                let oscbal: BigNumber = await tokenBalanceCallback(OrbitStableTokenAddressWithV4, 'bsc')
                if (oscbal.gt(0)) bal = formatEther(oscbal)
            } catch (error) {
                console.debug('Failed to get OSC balance', error)
            }
        }
        let approveAmount = Math.max(Math.floor(Number(bal)) + 1, Math.floor(Number(currentInvestmentV4)) + 1)
        const weiAmount = ethers.utils.parseEther(approveAmount.toString());
        const withdrawalResult = await withdraw_V4(weiAmount);
        if (!withdrawalResult.ok) {
            snackbar.snackbar.show(withdrawalResult.message, "error");
            return;
        }

        snackbar.snackbar.show("Withdraw is succesfull", "success");
    }

    useEffect(() => {
        const processUserReferral = async () => {
            console.log('processUserReferral');

            if (account && library) {
                const signer = library.getSigner();
                // Check current user referral status
                const result = await checkUserAlreadyReferred(account)
                const { msg } = result;

                // User visited the link with the referral link
                if (id) {
                    const walletAddress = window.atob(id as string);
                    if (msg === ReferralStatus.NEW_USER) {
                        if (ethers.utils.isAddress(walletAddress)) {
                            // Sign a message
                            const hash = ethers.utils.keccak256(account);
                            const signature = await signer.signMessage(ethers.utils.arrayify(hash));

                            await registerUserWithParent(window.btoa(account), id as string, signature, hash);
                        }
                    }
                } else {
                    if (msg === ReferralStatus.NEW_USER) {
                        const hash = ethers.utils.keccak256(account);
                        const signature = await signer.signMessage(ethers.utils.arrayify(hash));

                        await registerSoloUser(window.btoa(account), signature, hash);
                    }
                }

                const referralInfo = await getUserReferralInfo(account);
                if (referralInfo.data !== undefined) {
                    const { claimedReferralFee, parent, totalReferralFee, totalReferred } = referralInfo.data;
                    setTotalReferred(totalReferred);
                    if (parent === null) {
                        setReferredBy(null);
                    } else {
                        setReferredBy(`https://app.orbitlaunch.io/fund/${window.btoa(parent)}`);
                    }
                    setCommissionEarned(totalReferralFee);
                }
            }
        }
        processUserReferral();
    }, [id, account]);

    const getCurrentInvestors = (v1_investors: number, v2_investors: number) => {
        return Number(v1_investors) + Number(v2_investors)
    }

    const closeLockTierModal = () => {
        setIsOpenLockTier(false)
    }

    return (
        <>
            <DepositPopup isOpen={isOpenDeposit} version={version} handleClose={() => setIsOpenDeposit(false)} />
            <FundLockTierModal isOpen={isOpenLockTier} handleClose={closeLockTierModal} />
            <div className="desktop-content flex flex-col space-y-4 w-full">

                <div className="flex flex-row items-center">
                    <h1 className="text-[40px] font-medium">OrbitFund</h1>
                    <div className="absolute right-10 space-x-3">
                        <BuyButton></BuyButton>
                        {!!account
                            ? (<>
                                <LoadingButton
                                    variant="outlined"
                                    loading={isWithdrawApprovingV2 || isWithdrawingV2}
                                    loadingPosition="start"
                                    sx={{ borderRadius: "12px" }}
                                    onClick={disableWithdraw_V2 ? null : async () => await handleWithdrawalSubmitV2()}
                                    disabled={disableWithdraw_V2 || currentTierNoV2 === 0}
                                >
                                    {isWithdrawApprovingV2 ? 'Approving ...' : isWithdrawingV2 ? 'Withdrawing...' : 'Withdrawal (v2)'}
                                </LoadingButton>
                                <LoadingButton
                                    variant="outlined"
                                    loading={isWithdrawApprovingV3 || isWithdrawingV3}
                                    loadingPosition="start"
                                    sx={{ borderRadius: "12px" }}
                                    onClick={disableWithdraw_V3 ? null : async () => await handleWithdrawalSubmitV3()}
                                    disabled={disableWithdraw_V3 || currentTierNoV3 === 0}
                                >
                                    {isWithdrawApprovingV3 ? 'Approving ...' : isWithdrawingV3 ? 'Withdrawing...' : 'Withdrawal (v3)'}
                                </LoadingButton>
                                <Button
                                    type="button"
                                    disabled={disableDepositV4}
                                    onClick={(disableDepositV4) ? null : handleOpenDepositModalV4}
                                    variant="outlined"
                                    sx={{ borderRadius: "12px" }}
                                >
                                    {disableDepositV4 ? 'Deposit window closed (v4)' : userClaimedTier ? 'Deposit BUSD (v4)' : 'Claim your tier'}
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
                            <div className="text-xl">
                                {!!account ? `$${(parseFloat(currentInvestment) + parseFloat(currentInvestmentV3)).toFixed(2)}` : getCurrentInvestors(totalInvestors, totalInvestors_V1).toString()}
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                            <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                <span>{!!account ? 'ROI to Date' : 'Total Invested to Date'}</span>
                            </div>
                            <div className="text-xl">${!!account ? roiToDate :
                                ethers.FixedNumber.fromString(ethers.utils.formatEther(ethers.utils.parseEther(totalInvestedToDate).add(ethers.utils.parseEther(totalInvestedToDate_V1)))).round(2).toString()
                            }</div>
                        </div>
                        <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                            <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                <span>{!!account ? 'Current Tier' : 'Profit to Date'}</span>
                            </div>
                            <div className="container">
                                <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                                    {!!account
                                        ? <>
                                            {/* <div className="flex text-xl md:col-span-4 lg:col-span-3 xl:col-span-3 items-center">Tier {currentTierNo}</div>
                                            <div className="flex text-slate-400 md:col-span-8 lg:col-span-9 xl:col-span-9 text-sm">Up to {currentTierPercentage}% monthly ROI</div> */}
                                            <div className="flex text-xl md:col-span-4 lg:col-span-3 xl:col-span-3 items-center">Tier {userClaimedTier}</div>
                                            <div className="flex text-slate-400 md:col-span-8 lg:col-span-9 xl:col-span-9 text-sm">Up to {userClaimedTier > 0 ? tierInformation[userClaimedTier - 1].monthlyPercent : '0'}% monthly ROI</div>
                                        </>
                                        : <>
                                            <div className="flex text-xl md:col-span-4 lg:col-span-3 xl:col-span-3 items-center">${profitUpToDate}</div>
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
                                <div className="items-center text-l text-white">
                                    Deposit Window Closes on <span className="text-app-primary">{startInvestmentPeriodDate}</span><br />
                                    (Trading period lasts 4 weeks/28 days)<br />
                                    Withdrawal Window Opens on <span className="text-app-primary">{endInvestmentPeriodDate}</span>
                                </div>
                                <hr style={{ borderColor: "#112B40" }} />
                            </div>
                            <div className="space-y-3 pt-4">
                                <div className="items-center text-l text-white">
                                    {!!account ? "Personal Stats - Prior Trading Period" : "Global Stats - Prior Trading Period"}
                                </div>
                                {!!account
                                    ? <>
                                        <div className="items-center text-xs text-white mb-2 font-light">
                                            Last Month Investment:&nbsp;<span className="text-app-primary">${userLastInvestment_V1}</span>
                                        </div>
                                        <div className="items-center text-xs text-white mb-2 font-light">
                                            Last Month Profit:&nbsp;<span className="text-app-primary">${roiToDate_V1}</span>
                                        </div>
                                        <div className="items-center text-xs text-white mb-2 font-light">
                                            Last Month Return:&nbsp;<span className="text-app-primary">${userReturned_V1}</span>
                                        </div>
                                    </>
                                    : <>
                                        <div className="items-center text-xs text-white mb-2 font-light">
                                            Last Month Investment:&nbsp;<span className="text-app-primary">${ethers.FixedNumber.fromString(totalInvestedToDate_V1).round(2).toString()}</span>
                                        </div>
                                        <div className="items-center text-xs text-white mb-2 font-light">
                                            Last Month Profit:&nbsp;<span className="text-app-primary">${totalProfit_V1}</span>
                                        </div>
                                        <div className="items-center text-xs text-white mb-2 font-light">
                                            Last Month Return:&nbsp;<span className="text-app-primary">${totalReturned_V1}</span>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        {!account
                            ? (
                                <div className="flex-1 rounded-2xl bg-[#001926] p-4 min-h-[250px]">
                                    <div className="space-y-4">
                                        <div className="items-center text-l text-white">
                                            Learn About OrbitFund (ORBIT)
                                        </div>
                                        <hr style={{ borderColor: "#112B40" }} />
                                    </div>
                                    <div className="flex-1 justify-center items-center bg-[#001926] text-gray-400 w-full">
                                        <iframe src="videos/OrbitFundEasyDemo.mp4"
                                            className="min-h-[250px]"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            allow="autoplay; picture-in-picture"
                                            allowFullScreen={true}>
                                        </iframe>
                                    </div>
                                </div>
                            )
                            : (
                                <div className="flex-1 rounded-2xl bg-[#001926] p-4 min-h-[250px] leading-7">
                                    <p className="text-l break-all">
                                        Referral URL: &nbsp;
                                        <span className="text-m cursor-pointer text-app-primary" onClick={() => {
                                            navigator.clipboard.writeText(`https://orbitlaunch.io/fund/${window.btoa(account)}`);
                                        }}>
                                            {`https://app.orbitlaunch.io/fund/${window.btoa(account)}`}
                                        </span>
                                    </p>
                                    <p className="text-l break-all">
                                        Total Referrals Based on Connected Wallets: &nbsp;
                                        <span className="text-m cursor-pointer text-app-primary"
                                        >
                                            {totalReferred}
                                        </span>
                                    </p>
                                    <p className="text-l break-all">
                                        Commision Earned: &nbsp;
                                        <span className="text-m cursor-pointer text-app-primary">
                                            {commissionEarned}
                                        </span>
                                    </p>
                                    {
                                        referredBy !== null && (
                                            <p className="text-l break-all">
                                                You Were Referred by:&nbsp;
                                                <span className="text-m cursor-pointer text-app-primary">
                                                    {referredBy}
                                                </span>
                                            </p>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="rounded-2xl bg-[#001926] p-4">
                    <div className="space-y-2">
                        <div className="text-l">Available Investment Tiers</div>
                    </div>
                    <SliderCards
                        cardInformationList={tierInformation}
                        selectedCardIndex={userClaimedTier - 1}
                    />
                </div>
            </div>

            <div className="mobile-content flex flex-col space-y-4 w-full">
                <div className="flex flex-row items-center">
                    <h1 className="text-[35px]">OrbitFund</h1>
                    <div className="absolute right-10"><BuyButton /></div>
                </div>
                <div className="flex flex-row items-center space-x-4">
                    {!!account
                        ? (
                            <>
                                <LoadingButton
                                    variant="outlined"
                                    className="w-full"
                                    loading={isWithdrawApprovingV2 || isWithdrawingV2}
                                    loadingPosition="start"
                                    sx={{ borderRadius: "12px" }}
                                    onClick={disableWithdraw_V2 ? null : async () => await handleWithdrawalSubmitV2()}
                                    disabled={disableWithdraw_V2 || currentTierNoV2 === 0}
                                >
                                    {isWithdrawApprovingV2 ? 'Approving ...' : isWithdrawingV2 ? 'Withdrawing...' : 'Withdrawal (v2)'}
                                </LoadingButton>
                                <LoadingButton
                                    variant="outlined"
                                    className="w-full"
                                    loading={isWithdrawApprovingV3 || isWithdrawingV3}
                                    loadingPosition="start"
                                    sx={{ borderRadius: "12px" }}
                                    onClick={disableWithdraw_V3 ? null : async () => await handleWithdrawalSubmitV3()}
                                    disabled={disableWithdraw_V3 || currentTierNoV3 === 0}
                                >
                                    {isWithdrawApprovingV3 ? 'Approving ...' : isWithdrawingV3 ? 'Withdrawing...' : 'Withdrawal (v3)'}
                                </LoadingButton>
                                <Button
                                    type="button"
                                    className="w-full"
                                    disabled={disableDepositV4}
                                    onClick={(disableDepositV4) ? null : handleOpenDepositModalV4}
                                    variant="outlined"
                                    sx={{ borderRadius: "12px" }}
                                >
                                    {disableDepositV4 ? 'Deposit window closed (v4)' : userClaimedTier ? 'Deposit BUSD (v4)' : 'Claim your tier'}
                                </Button>
                            </>
                        )
                        : (
                            <Button
                                variant="outlined"
                                className="relative w-full"
                                onClick={activateProvider}
                                sx={{ borderRadius: "12px" }}
                            >
                                Connect to Deposit
                            </Button>
                        )
                    }
                </div>
                <div className="flex flex-row items-center space-x-4">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>{!!account ? 'Current Investment' : 'Investors'}</span>
                        </div>
                        <div className="text-xl">{!!account ? `$${(parseFloat(currentInvestment) + parseFloat(currentInvestmentV3)).toFixed(2)}` : getCurrentInvestors(totalInvestors, totalInvestors_V1).toString()}</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>{!!account ? 'ROI to Date' : 'Total Invested to Date'}</span>
                        </div>
                        <div className="text-xl">${!!account ? roiToDate_V1 :
                            ethers.FixedNumber.fromString(ethers.utils.formatEther(ethers.utils.parseEther(totalInvestedToDate).add(ethers.utils.parseEther(totalInvestedToDate_V1)))).round(2).toString()
                        }</div>
                    </div>
                </div>
                <div className="flex flex-row items-center space-x-4">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>{!!account ? 'Current Tier' : 'Profit to Date'}</span>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            {!!account
                                ? <>
                                    {/* <div className="text-xl items-center">Tier {currentTierNo}</div>
                                    <div className="text-slate-400 text-sm">Up to {currentTierPercentage}% monthly ROI</div> */}
                                    <div className="text-xl items-center">Tier {userClaimedTier}</div>
                                    <div className="text-slate-400 text-sm">Up to {userClaimedTier > 0 ? tierInformation[userClaimedTier - 1].monthlyPercent : '0'}% monthly ROI</div>
                                </>
                                : <>
                                    <div className="text-xl items-center">${profitUpToDate}</div>
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-row space-x-4">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                        <div className="space-y-4">
                            <div className="items-center text-l text-white">
                                Deposit Window Closes on <span className="text-app-primary">{startInvestmentPeriodDate}</span><br />
                                (Trading period lasts 4 weeks/28 days)<br />
                                Withdrawal Window Opens on <span className="text-app-primary">{endInvestmentPeriodDate}</span>
                            </div>
                            <hr style={{ borderColor: "#112B40" }} />
                        </div>
                        <div className="space-y-3 pt-4">
                            <div className="items-center text-l text-white">
                                {!!account ? "Personal Stats - Prior Trading Period" : "Global Stats - Prior Trading Period"}
                            </div>
                            {!!account
                                ? <>
                                    <div className="items-center text-xs text-white mb-2 font-light">
                                        Last Month Investment:&nbsp;<span className="text-app-primary">${userLastInvestment_V1}</span>
                                    </div>
                                    <div className="items-center text-xs text-white mb-2 font-light">
                                        Last Month Profit:&nbsp;<span className="text-app-primary">${roiToDate_V1}</span>
                                    </div>
                                    <div className="items-center text-xs text-white mb-2 font-light">
                                        Last Month Return:&nbsp;<span className="text-app-primary">${userReturned_V1}</span>
                                    </div>
                                </>
                                : <>
                                    <div className="items-center text-xs text-white mb-2 font-light">
                                        Last Month Investment:&nbsp;<span className="text-app-primary">${ethers.FixedNumber.fromString(totalInvestedToDate_V1).round(2).toString()}</span>
                                    </div>
                                    <div className="items-center text-xs text-white mb-2 font-light">
                                        Last Month Profit:&nbsp;<span className="text-app-primary">${totalProfit_V1}</span>
                                    </div>
                                    <div className="items-center text-xs text-white mb-2 font-light">
                                        Last Month Return:&nbsp;<span className="text-app-primary">${totalReturned_V1}</span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                </div>
                <div className="flex flex-row space-x-4">
                    {!account
                        ? (
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                                <div className="space-y-4">
                                    <div className="items-center text-l text-white">
                                        Learn About OrbitFund (ORBIT)
                                    </div>
                                    <hr style={{ borderColor: "#112B40" }} />
                                </div>
                                <div className="flex-1 justify-center items-center rounded-2xl bg-[#001926] text-gray-400 w-full">
                                    <iframe src="videos/OrbitFundEasyDemo.mp4"
                                        className="min-h-[250px]"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allow="autoplay; picture-in-picture"
                                        allowFullScreen={true}>
                                    </iframe>
                                </div>
                            </div>
                        )
                        : (
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 min-h-[250px] leading-7">
                                <p className="text-l break-all">
                                    Referral URL: &nbsp;
                                    <span className="text-m cursor-pointer text-app-primary" onClick={() => {
                                        navigator.clipboard.writeText(`https://orbitlaunch.io/fund/${window.btoa(account)}`);
                                    }}>
                                        {`https://app.orbitlaunch.io/fund/${window.btoa(account)}`}
                                    </span>
                                </p>
                                <p className="text-l break-all">
                                    Total Referrals Based on Connected Wallets: &nbsp;
                                    <span className="text-m cursor-pointer text-app-primary"
                                    >
                                        {totalReferred}
                                    </span>
                                </p>
                                <p className="text-l break-all">
                                    Commision Earned: &nbsp;
                                    <span className="text-m cursor-pointer text-app-primary">
                                        {commissionEarned}
                                    </span>
                                </p>
                                {
                                    referredBy !== null && (
                                        <p className="text-l break-all">
                                            You Were Referred by:&nbsp;
                                            <span className="text-m cursor-pointer text-app-primary">
                                                {referredBy}
                                            </span>
                                        </p>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-row space-x-4">
                    <div className="rounded-2xl bg-[#001926] p-4 w-full">
                        <div className="space-y-2">
                            <div className="text-l">Available Investment Tiers</div>
                        </div>
                        <SliderCards
                            cardInformationList={tierInformation}
                            selectedCardIndex={userClaimedTier - 1}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}