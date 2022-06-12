import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useMemo, useState } from "react";
import {
    AppTokenAddress,
    BusdContractAddress, OrbitStableTokenAddress
} from "@app/shared/AppConstant";
import { BigNumber, ethers } from "ethers";
import moment from 'moment';
import { getRemainingTimeBetweenTwoDates } from '@app/shared/helpers/time';
import busdAbi from "@app/lib/contract/abis/busdAbi.json";
import orbitStableCoinAbi from "@app/lib/contract/abis/orbitStableCoinAbi.json";
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbiLockTier.json";
import { getContract, getProviderOrSigner } from '@app/utils';
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { RpcProviders } from "@app/shared/PadConstant"
import { getChainIdFromName } from 'src/utils'
import { formatEther, parseEther } from "@ethersproject/units";
import { getTierValues } from "@app/shared/TierLevels";
import { maxUserLockAmount } from "@app/utils";

export default function useFund_OSCV2(fundContractAddress: string) {
    const { account, library } = useEthers();    
    const connectedUserBalance = useTokenBalance(AppTokenAddress, account);
    const [isWithdrawApproving, setIsWithdrawApproving] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const snackbar = useSnackbar()

    const agreeToTerms = async () => {
        try {
            const orbitFundContract = getContract(fundContractAddress, orbitFundAbi, library, account ? account : undefined);

            return orbitFundContract.agreeToTerms()
                .then((tx: any) => {
                    return tx.wait().then(async (_: any) => {
                        return {
                            ok: true
                        };
                    }).catch(error => {
                        return {
                            ok: false,
                            message: "Cannot agree to terms now. Please try again."
                        };
                    })
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err?.message || err));
                    return {
                        ok: false,
                        message: "Cannot agree to terms now. Please try again."
                    };
                });
        }
        catch (err: any) {
            console.error("ERROR: " + (err.data?.message || err?.message || err));
            return {
                ok: false,
                message: "Cannot agree to terms now. Please try again."
            };
        }
    }

    const userAgreed = async () => {
        try {
            const orbitFundContract = getContract(fundContractAddress, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.userAgreed(account)
                .then((response: any) => {
                    return {
                        ok: true,
                        returnedModel: response
                    }
                })
                .catch((err: any) => {
                    console.error("ERROR: " + err.data?.message || err?.message || err);
                    return {
                        ok: false,
                        message: "User Agreement cannot be checked. Please try again.",
                    };
                });
        } catch (err: any) {
            console.error("ERROR: " + err.data?.message || err?.message || err);
            return {
                ok: false,
                message: "User Agreement cannot be checked. Please try again.",
            };
        }
    }

    const approve = async (amount: string) => {
        try {
            const busdContract = getContract(BusdContractAddress, busdAbi, library, account ? account : undefined);
            const provider = getProviderOrSigner(library, account) as any;

            const weiAmount = ethers.utils.parseEther(amount);
            return await busdContract.connect(provider).approve(fundContractAddress, weiAmount)
                .then((response: any) => {
                    return response.wait().then(async (_: any) => {
                        return {
                            ok: true,
                            hash: response.hash
                        };
                    });
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err?.message || err));
                    return {
                        ok: false,
                        message: (err.data?.message || err?.message || err).toString()
                    };
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err?.message || err));
            return {
                ok: false,
                message: "Approve transaction rejected. Please try again."
            };
        }
    }

    const depositBusd = async (amount: string) => {
        try {
            const orbitFundContract = getContract(fundContractAddress, orbitFundAbi, library, account ? account : undefined);

            const weiAmount = ethers.utils.parseEther(amount);
            return await orbitFundContract.deposit(weiAmount)
                .then((response: any) => {
                    return {
                        ok: true,
                        hash: response.hash
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err?.message || err));
                    return {
                        ok: false,
                        message: (err.data?.message || err?.message || err).toString()
                    };
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err?.message || err));
            return {
                ok: false,
                message: "Deposit transaction rejected. Please try again."
            };
        }
    }

    const [{
        startInvestmentPeriodDate,
        endInvestmentPeriodDate,
        disableDeposit,
        disableWithdraw,
        remainingTimeText,
        balance,
        currentTierNo
    }, setInfo] = useState({
        startInvestmentPeriodDate: '-',
        endInvestmentPeriodDate: '-',       
        disableDeposit: true,
        disableWithdraw: true,
        remainingTimeText: '0 days 0 hours 0 minutes',
        balance: '0.00',
        currentTierNo: 0
    });

    const startPeriodTime = async () => {
        try {
            const orbitFundContract = getContract(fundContractAddress, orbitFundAbi, RpcProviders[getChainIdFromName('bsc')], account ? account : undefined);

            return await orbitFundContract.startTime()
                .then((response: any) => {
                    return {
                        ok: true,
                        returnedModel: response
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err?.message || err));
                    return {
                        ok: false,
                        message: "Start time is not received. Please try again."
                    };
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err?.message || err));
            return {
                ok: false,
                message: "Start time is not received. Please try again."
            };
        }
    }

    const endPeriodTime = async () => {
        try {
            const orbitFundContract = getContract(fundContractAddress, orbitFundAbi, RpcProviders[getChainIdFromName('bsc')], account ? account : undefined);

            return await orbitFundContract.endTime()
                .then((response: any) => {
                    return {
                        ok: true,
                        returnedModel: response
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err?.message || err));
                    return {
                        ok: false,
                        message: "End time is not received. Please try again."
                    };
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err?.message || err));
            return {
                ok: false,
                message: "End time is not received. Please try again."
            };
        }
    }

    const depositPeriodInfo = async () => {
        let returnedModel = {
            startDate: new Date(),
            endDate: new Date(),
            disabledDeposit: true,
            disabledWithdraw: true,
            remainingTimeText: '0 days 0 hours 0 minutes'
        }
        const startTime = await startPeriodTime();
        returnedModel.startDate = !startTime.ok ? new Date() : new Date(startTime.returnedModel * 1000);

        const endTime = await endPeriodTime();
        returnedModel.endDate = !endTime.ok ? new Date() : new Date(endTime.returnedModel * 1000);

        const nowTime = new Date().getTime();
        returnedModel.disabledDeposit = startTime.ok
            ? nowTime >= returnedModel.startDate.getTime()
            : returnedModel.disabledDeposit;
        returnedModel.disabledWithdraw = endTime.ok
            ? nowTime <= returnedModel.endDate.getTime()
            : returnedModel.disabledWithdraw;

        const comparedDate = returnedModel.disabledDeposit ? returnedModel.startDate : returnedModel.endDate;
        const remainingTimeResult = returnedModel.disabledDeposit
            ? getRemainingTimeBetweenTwoDates(nowTime, comparedDate.getTime())
            : getRemainingTimeBetweenTwoDates(comparedDate.getTime(), nowTime);

        return {
            startDate: moment.utc(returnedModel.startDate).format("MMMM D [-] h[:]mma [UTC]"),
            endDate: moment.utc(returnedModel.endDate).format("MMMM D [-] h[:]mma [UTC]"),
            disabledDeposit: returnedModel.disabledDeposit,
            disabledWithdraw: returnedModel.disabledWithdraw,
            remainingTimeText: remainingTimeResult
        }
    }

    const withdraw = async (weiAmount: ethers.BigNumber) => {
        try {
            const orbitFundContract = getContract(fundContractAddress, orbitFundAbi, library, account ? account : undefined);
            const orbitStableContract = getContract(OrbitStableTokenAddress, orbitStableCoinAbi, library, account ? account : undefined);
            const provider = getProviderOrSigner(library, account) as any;
            
            setIsWithdrawApproving(true)
            const approveTxHash = await orbitStableContract
                .connect(provider)
                .approve(fundContractAddress, parseEther(maxUserLockAmount.toString()));

            return approveTxHash.wait().then(async (_: any) => {
                snackbar.snackbar.show("Approved!", "success");
                setIsWithdrawApproving(false)
                setIsWithdrawing(true)
                return await orbitFundContract.withdraw()
                    .then(() => {
                        setIsWithdrawing(false)
                        return {
                            ok: true
                        };
                    }).catch((err: any) => {
                        setIsWithdrawing(false)
                        console.error("ERROR: " + err.data?.message || err?.message || err);
                        return {
                            ok: false,
                            message: "Withdrawal cannot be made. Please try again."
                        };
                    });
            })
        }
        catch (err) {
            setIsWithdrawApproving(false)
            console.error("ERROR: " + err.data?.message || err?.message || err);
            return {
                ok: false,
                message: "Withdrawal cannot be made. Please try again."
            };
        }
    }

    useEffect(() => {

        const fetchConnectedData = async () => {
            let depositPeriodResult = await depositPeriodInfo();        
            const formattedConnectedBalance = formatEther(connectedUserBalance ?? BigNumber.from(0));
            let tierResult = await getTierValues(ethers.BigNumber.from(Math.trunc(parseFloat(formattedConnectedBalance))));
            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,                
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText,
                balance: formattedConnectedBalance,
                currentTierNo: tierResult.tierNo
            };
        }

        const fetchNotConnectedData = async () => {
            let depositPeriodResult = await depositPeriodInfo();          
            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,                
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText,
                balance: '0.00',
                currentTierNo: 0
            }
        }

        if (!!account && !!library && !!connectedUserBalance) {
            fetchConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate: result.endInvestmentPeriodDate,                    
                    disableDeposit: result.disableDeposit,
                    disableWithdraw: result.disableWithdraw,
                    remainingTimeText: result.remainingTimeText,
                    balance: result.balance,
                    currentTierNo: result.currentTierNo
                });
            }).catch(console.error);;
        }
        else {
            fetchNotConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate: result.endInvestmentPeriodDate,                    
                    disableDeposit: result.disableDeposit,
                    disableWithdraw: result.disableWithdraw,
                    remainingTimeText: result.remainingTimeText,
                    balance: result.balance,
                    currentTierNo: result.currentTierNo
                });
            }).catch(console.error);
        }

    }, [account, library]);

    const fundInfo = useMemo(
        () => ({
            isWithdrawApproving,
            isWithdrawing,
            startInvestmentPeriodDate,
            endInvestmentPeriodDate,            
            disableDeposit,
            disableWithdraw,
            remainingTimeText,
            balance,
            currentTierNo,
            agreeToTerms,
            userAgreed,
            approve,
            depositBusd,
            withdraw
        }),
        [isWithdrawApproving, isWithdrawing, startInvestmentPeriodDate, endInvestmentPeriodDate, disableDeposit, disableWithdraw,
            remainingTimeText, balance, currentTierNo, agreeToTerms, userAgreed, approve, depositBusd, withdraw]
    );

    return fundInfo;
}