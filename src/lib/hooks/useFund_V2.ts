import { formatEther } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useMemo, useState } from "react";
import {
    AppTokenAddress,
    BusdContractAddress,
    OrbitFundContractAddress_V2,    
    OrbitStableTokenAddress
} from "@app/shared/AppConstant";
import { ethers } from "ethers";
import { getTierValues } from '@app/shared/TierLevels';
import moment from 'moment';
import { getRemainingTimeBetweenTwoDates } from '@app/shared/helpers/time';
import busdAbi from "@app/lib/contract/abis/busdAbi.json";
import orbitStableCoinAbi from "@app/lib/contract/abis/orbitStableCoinAbi.json";
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbi.json";
import { getContract, getProviderOrSigner } from '@app/utils';

export default function useFund() {
    const { account, library } = useEthers();
    const connectedUserBalance = useTokenBalance(AppTokenAddress, account);

    const agreeToTerms = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return orbitFundContract.agreeToTerms()
                .then(() => {
                    return {
                        ok: true
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    return {
                        ok: false,
                        message: "Cannot agree to terms now. Please try again."
                    };
                });
        }
        catch (err: any) {
            console.error("ERROR: " + (err.data?.message || err));
            return {
                ok: false,
                message: "Cannot agree to terms now. Please try again."
            };
        }
    }

    const userAgreed = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.userAgreed(account)
                .then((response: any) => {
                    return {
                        ok: true,
                        returnedModel: response
                    }
                })
                .catch((err: any) => {
                    console.error("ERROR: " + err.data?.message);
                    return {
                        ok: false,
                        message: "User Agreement cannot be checked. Please try again.",
                    };
                });
        } catch (err: any) {
            console.error("ERROR: " + err.data?.message);
            return {
                ok: false,
                message: "User Agreement cannot be checked. Please try again.",
            };
        }
    }

    const depositBusd = async (amount: string) => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);
            const busdContract = getContract(BusdContractAddress, busdAbi, library, account ? account : undefined);
            const provider = getProviderOrSigner(library, account) as any;

            const weiAmount = ethers.utils.parseEther(amount);
            const approveTxHash = await busdContract
                .connect(provider)
                .approve(OrbitFundContractAddress_V2, weiAmount);

            return approveTxHash.wait().then(async (_: any) => {
                return await orbitFundContract.deposit(weiAmount)
                    .then(() => {
                        return {
                            ok: true
                        };
                    }).catch((err: any) => {
                        console.error("ERROR: " + (err.data?.message || err));
                        return {
                            ok: false,
                            message: "Deposit transaction rejected. Please try again."
                        };
                    });
            });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err));
            return {
                ok: false,
                message: "Deposit transaction rejected. Please try again."
            };
        }
    }

    const [{
        startInvestmentPeriodDate,
        endInvestmentPeriodDate,
        currentInvestment,
        totalInvestedToDate,
        totalInvestors,
        roiToDate, currentTierNo,
        currentTierPercentage,
        disableDeposit,
        disableWithdraw,
        remainingTimeText,
        balance
    }, setInfo] = useState({
        startInvestmentPeriodDate: '-',
        endInvestmentPeriodDate: '-',
        currentInvestment: '0.00',
        totalInvestedToDate: '0.00',
        totalInvestors: 0,
        roiToDate: '0.0',
        currentTierNo: 0,
        currentTierPercentage: "0",
        disableDeposit: true,
        disableWithdraw: true,
        remainingTimeText: '0 days 0 hours 0 minutes',
        balance: '0.00'
    });

    const totalInvestedAmount = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.totalInvestedAmount()
                .then((response: any) => {
                    return response
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    return ethers.utils.parseEther('0');
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err));
            return ethers.utils.parseEther('0');
        }
    }

    const getTotalInvestors = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.getTotalInvestors()
                .then((response: any) => {
                    return response;
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    return '0';
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err));
            return '0';
        }
    }

    const startPeriodTime = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.startTime()
                .then((response: any) => {
                    return {
                        ok: true,
                        returnedModel: response
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    return {
                        ok: false,
                        message: "Start time is not received. Please try again."
                    };
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err));
            return {
                ok: false,
                message: "Start time is not received. Please try again."
            };
        }
    }

    const endPeriodTime = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.endTime()
                .then((response: any) => {
                    return {
                        ok: true,
                        returnedModel: response
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    return {
                        ok: false,
                        message: "End time is not received. Please try again."
                    };
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err));
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

    const depositInfos = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.depositInfos(account)
                .then((response: any) => {
                    return formatEther(response.amount);
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    return formatEther(ethers.utils.parseEther('0.000'));
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err));
            return formatEther(ethers.utils.parseEther('0.000'));
        }
    }

    const userWithdrew = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.userWithdrew(account)
                .then(async (result: any) => {
                    return result;
                }).catch((err: any) => {
                    console.error("ERROR: " + err.data?.message);
                    return true;
                })
        }
        catch (err) {
            console.error("ERROR: " + err.data?.message);
            return true;
        }
    }

    const withdraw = async (weiAmount: ethers.BigNumber) => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress_V2, orbitFundAbi, library, account ? account : undefined);
            const orbitStableContract = getContract(OrbitStableTokenAddress, orbitStableCoinAbi, library, account ? account : undefined);
            const provider = getProviderOrSigner(library, account) as any;

            const approveTxHash = await orbitStableContract
                .connect(provider)
                .approve(OrbitFundContractAddress_V2, weiAmount);

            return approveTxHash.wait().then(async (_: any) => {
                return await orbitFundContract.withdraw()
                    .then(() => {
                        return {
                            ok: true
                        };
                    }).catch((err: any) => {
                        console.error("ERROR: " + err.data?.message);
                        return {
                            ok: false,
                            message: "Withdrawal cannot be made. Please try again."
                        };
                    });
            })
        }
        catch (err) {
            console.error("ERROR: " + err.data?.message);
            return {
                ok: false,
                message: "Withdrawal cannot be made. Please try again."
            };
        }
    }

    useEffect(() => {

        const fetchConnectedData = async () => {
            let depositPeriodResult = await depositPeriodInfo();
            let userWithdrewResult = await userWithdrew();

            let totalInvestment = await depositInfos();
            const investmentAmountInDollars = (parseFloat(totalInvestment) * parseFloat("1")).toFixed(2);
            const formattedConnectedBalance = formatEther(connectedUserBalance);

            let tierResult = await getTierValues(ethers.BigNumber.from(Math.trunc(parseFloat(formattedConnectedBalance))));

            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,
                currentInvestment: userWithdrewResult ? '0.00' : investmentAmountInDollars,
                totalInvestedToDate: '0.00',
                totalInvestors: 0,
                roiToDate: '0.00',
                currentTierNo: tierResult.tierNo,
                currentTierPercentage: tierResult.monthlyPercent,
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText,
                balance: formattedConnectedBalance
            };
        }

        const fetchNotConnectedData = async () => {
            let depositPeriodResult = await depositPeriodInfo();
            let totalInvestment = ethers.utils.formatEther(await totalInvestedAmount());
            let totalInvestorNumber = await getTotalInvestors();

            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,
                currentInvestment: '0.00',
                totalInvestedToDate: totalInvestment,
                totalInvestors: totalInvestorNumber,
                roiToDate: '0.00',
                currentTierNo: 0,
                currentTierPercentage: "0",
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText,
                balance: '0.00'
            }
        }

        if (!!account && !!library && !!connectedUserBalance) {
            fetchConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate: result.endInvestmentPeriodDate,
                    currentInvestment: result.currentInvestment,
                    totalInvestedToDate: result.totalInvestedToDate,
                    totalInvestors: result.totalInvestors,
                    roiToDate: result.roiToDate,
                    currentTierNo: result.currentTierNo,
                    currentTierPercentage: result.currentTierPercentage,
                    disableDeposit: result.disableDeposit,
                    disableWithdraw: result.disableWithdraw,
                    remainingTimeText: result.remainingTimeText,
                    balance: result.balance,
                });
            }).catch(console.error);;
        }
        else {
            fetchNotConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate: result.endInvestmentPeriodDate,
                    currentInvestment: result.currentInvestment,
                    totalInvestedToDate: result.totalInvestedToDate,
                    totalInvestors: result.totalInvestors,
                    roiToDate: result.roiToDate,
                    currentTierNo: result.currentTierNo,
                    currentTierPercentage: result.currentTierPercentage,
                    disableDeposit: result.disableDeposit,
                    disableWithdraw: result.disableWithdraw,
                    remainingTimeText: result.remainingTimeText,
                    balance: result.balance
                });
            }).catch(console.error);
        }

    }, [account, connectedUserBalance, library]);

    const fundInfo = useMemo(
        () => ({
            startInvestmentPeriodDate,
            endInvestmentPeriodDate,
            currentInvestment,
            totalInvestedToDate,
            totalInvestors,
            roiToDate,
            currentTierNo,
            currentTierPercentage,
            disableDeposit,
            disableWithdraw,
            remainingTimeText,
            balance,
            agreeToTerms,
            userAgreed,
            depositBusd,
            withdraw
        }),
        [startInvestmentPeriodDate, endInvestmentPeriodDate, currentInvestment, totalInvestors,
            roiToDate, currentTierNo, currentTierPercentage, disableDeposit, disableWithdraw,
            remainingTimeText, balance, totalInvestedToDate, agreeToTerms, userAgreed, depositBusd, withdraw]
    );

    return fundInfo;
}