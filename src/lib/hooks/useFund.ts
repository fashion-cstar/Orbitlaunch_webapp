import { formatEther } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useMemo, useState } from "react";
import {
    AppTokenAddress,
    BusdContractAddress,
    OrbitFundContractAddress,
    OrbitStableTokenAddress,
    LAST_MONTH_PROFIT_URL
} from "@app/shared/AppConstant";
import { BigNumber, ethers } from "ethers";
import { getTierValues, tierInformation } from '@app/shared/TierLevels';
import moment from 'moment';
import { getRemainingTimeBetweenTwoDates } from '@app/shared/helpers/time';
import busdAbi from "@app/lib/contract/abis/busdAbi.json";
import orbitStableCoinAbi from "@app/lib/contract/abis/orbitStableCoinAbi.json";
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbi.json";
import { getContract, getProviderOrSigner } from '@app/utils';

export default function useFund() {
    const { account, library } = useEthers();
    const connectedUserBalance = useTokenBalance(AppTokenAddress, account);    
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const [isDepositing, setIsDepositing] = useState(false)

    const agreeToTerms_V1 = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

            return orbitFundContract.agreeToTerms()
                .then((tx:any) => {
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

    const userAgreed_V1 = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

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

    const approve_V1 = async (amount: string) => {
        try {
            const busdContract = getContract(BusdContractAddress, busdAbi, library, account ? account : undefined);
            const provider = getProviderOrSigner(library, account) as any;

            const weiAmount = ethers.utils.parseEther(amount);
            return await busdContract.connect(provider).approve(OrbitFundContractAddress, weiAmount)
                .then((response: any) => {
                    return response.wait().then(async (_: any) => {
                        return {
                            ok: true,
                            hash: response.hash
                        };
                    });
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    return {
                        ok: false,
                        message: (err.data?.message || err?.message || err).toString()
                    };
                });
        }
        catch (err) {            
            console.error("ERROR: " + (err.data?.message || err));
            return {
                ok: false,
                message: "Approve transaction rejected. Please try again."
            };
        }
    }

    const depositBusd_V1 = async (amount: string) => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

            const weiAmount = ethers.utils.parseEther(amount);           
                return await orbitFundContract.deposit(weiAmount)
                    .then((response: any) => {
                        return {
                            ok: true,
                            hash: response.hash
                        };
                    }).catch((err: any) => {
                        console.error("ERROR: " + (err.data?.message || err));
                        return {
                            ok: false,
                            message: (err.data?.message || err?.message || err).toString()
                        };
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
        startInvestmentPeriodDate_V1,
        endInvestmentPeriodDate_V1,
        currentInvestment_V1,
        totalInvestedToDate_V1,
        totalInvestors_V1,
        userLastInvestment_V1,
        roiToDate_V1, 
        userReturned_V1,
        currentTierNo_V1,
        currentTierPercentage_V1,
        disableDeposit_V1,
        disableWithdraw_V1,
        remainingTimeText_V1,
        balance_V1,
        totalProfit_V1,
        totalReturned_V1
    }, setInfo] = useState({
        startInvestmentPeriodDate_V1: '-',
        endInvestmentPeriodDate_V1: '-',
        currentInvestment_V1: '0.00',
        totalInvestedToDate_V1: '0.00',
        totalInvestors_V1: 0,
        userLastInvestment_V1: '0.00',
        roiToDate_V1: '0.00',
        userReturned_V1: '0.00',
        currentTierNo_V1: 0,
        currentTierPercentage_V1: "0",
        disableDeposit_V1: true,
        disableWithdraw_V1: true,
        remainingTimeText_V1: '0 days 0 hours 0 minutes',
        balance_V1: '0.00',
        totalProfit_V1: '0.00',
        totalReturned_V1: '0.00'
    });

    const totalInvestedAmount = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

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
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

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
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

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
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

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

    const getPriorMonthProfit = async () => {
        return await (fetch(LAST_MONTH_PROFIT_URL)
            .then((res: any) => res.json())
            .then((res) => {
                if (res)
                    return res.data.roiToDate.toFixed(2)
                else
                    return '0.00'
            })
            .catch(error => {
                console.error("Failed to get Prior Months's Total Profit to Investors: " + error)
                return '0.00'
            }))
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
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

            return await orbitFundContract.depositInfos(account)
                .then((response: any) => {
                    return { tierValue: response.tierValue.toNumber(), amount: formatEther(response.amount) };
                }).catch((err: any) => {
                    console.error("ERROR: " + (err.data?.message || err));
                    // return formatEther(ethers.utils.parseEther('0.000'));
                    return { tierValue: -1, amount: formatEther(ethers.utils.parseEther('0.000')) };
                });
        }
        catch (err) {
            console.error("ERROR: " + (err.data?.message || err));
            return { tierValue: -1, amount: formatEther(ethers.utils.parseEther('0.000')) };
        }
    }

    const userWithdrew = async () => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);

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

    const withdraw_V1 = async (weiAmount: ethers.BigNumber) => {
        try {
            const orbitFundContract = getContract(OrbitFundContractAddress, orbitFundAbi, library, account ? account : undefined);
            const orbitStableContract = getContract(OrbitStableTokenAddress, orbitStableCoinAbi, library, account ? account : undefined);
            const provider = getProviderOrSigner(library, account) as any;

            const approveTxHash = await orbitStableContract
                .connect(provider)
                .approve(OrbitFundContractAddress, weiAmount);

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

            // let totalInvestment = await depositInfos();
            let depositinfo = await depositInfos();
            let ROIToDate = 0
            if (depositinfo.tierValue !== -1) {
                let profitPercent = Number(tierInformation[depositinfo.tierValue].monthlyPercent)
                ROIToDate = Math.round(profitPercent * Number(depositinfo.amount)) / 100
            }
            const investmentAmountInDollars = (parseFloat(depositinfo.amount) * parseFloat("1")).toFixed(2);
            const formattedConnectedBalance = formatEther(connectedUserBalance);
            let totalInvestment = ethers.utils.formatEther(await totalInvestedAmount());
            let tierResult = await getTierValues(ethers.BigNumber.from(Math.trunc(parseFloat(formattedConnectedBalance))));

            let totalProfit = await getPriorMonthProfit()
            let totalReturn = ethers.FixedNumber.fromString(totalInvestment).addUnsafe(ethers.FixedNumber.fromString(totalProfit)).round(2).toString()
            let userReturn = (Number(ROIToDate) + Number(investmentAmountInDollars)).toLocaleString()
            
            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,
                currentInvestment: userWithdrewResult ? '0.00' : investmentAmountInDollars,
                totalInvestedToDate: totalInvestment,
                totalInvestors: 0,
                userLastInvestment: investmentAmountInDollars,
                roiToDate: ROIToDate.toLocaleString(),
                userReturned: userReturn,
                currentTierNo: tierResult.tierNo,
                currentTierPercentage: tierResult.monthlyPercent,
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText,
                balance: formattedConnectedBalance,
                totalProfit: totalProfit,
                totalReturn: totalReturn
            };
        }

        const fetchNotConnectedData = async () => {
            let depositPeriodResult = await depositPeriodInfo();
            let totalInvestment = ethers.utils.formatEther(await totalInvestedAmount());
            let totalInvestorNumber = await getTotalInvestors();
            let totalProfit = await getPriorMonthProfit()
            let totalReturn = ethers.FixedNumber.fromString(totalInvestment).addUnsafe(ethers.FixedNumber.fromString(totalProfit)).round(2).toString()

            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,
                currentInvestment: '0.00',
                totalInvestedToDate: totalInvestment,
                totalInvestors: totalInvestorNumber,
                userLastInvestment: '0.00',
                roiToDate: '0.00',
                userReturned: '0.00',
                currentTierNo: 0,
                currentTierPercentage: "0",
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText,
                balance: '0.00',
                totalProfit: totalProfit,
                totalReturn: totalReturn
            }
        }

        if (!!account && !!library && !!connectedUserBalance) {
            fetchConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate_V1: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate_V1: result.endInvestmentPeriodDate,
                    currentInvestment_V1: result.currentInvestment,
                    totalInvestedToDate_V1: result.totalInvestedToDate,
                    totalInvestors_V1: result.totalInvestors,
                    userLastInvestment_V1: result.userLastInvestment,
                    roiToDate_V1: result.roiToDate,
                    userReturned_V1: result.userReturned,
                    currentTierNo_V1: result.currentTierNo,
                    currentTierPercentage_V1: result.currentTierPercentage,
                    disableDeposit_V1: result.disableDeposit,
                    disableWithdraw_V1: result.disableWithdraw,
                    remainingTimeText_V1: result.remainingTimeText,
                    balance_V1: result.balance,
                    totalProfit_V1: result.totalProfit,
                    totalReturned_V1: result.totalReturn
                });
            }).catch(console.error);;
        }
        else {
            fetchNotConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate_V1: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate_V1: result.endInvestmentPeriodDate,
                    currentInvestment_V1: result.currentInvestment,
                    totalInvestedToDate_V1: result.totalInvestedToDate,
                    totalInvestors_V1: result.totalInvestors,
                    userLastInvestment_V1: result.userLastInvestment,
                    roiToDate_V1: result.roiToDate,
                    userReturned_V1: result.userReturned,
                    currentTierNo_V1: result.currentTierNo,
                    currentTierPercentage_V1: result.currentTierPercentage,
                    disableDeposit_V1: result.disableDeposit,
                    disableWithdraw_V1: result.disableWithdraw,
                    remainingTimeText_V1: result.remainingTimeText,
                    balance_V1: result.balance,
                    totalProfit_V1: result.totalProfit,
                    totalReturned_V1: result.totalReturn
                });
            }).catch(console.error);
        }

    }, [account, connectedUserBalance, library]);

    const fundInfo = useMemo(
        () => ({
            isWalletApproving,
            isDepositing,
            startInvestmentPeriodDate_V1,
            endInvestmentPeriodDate_V1,
            currentInvestment_V1,
            totalInvestedToDate_V1,
            totalInvestors_V1,
            userLastInvestment_V1,
            roiToDate_V1,
            userReturned_V1,
            currentTierNo_V1,
            currentTierPercentage_V1,
            disableDeposit_V1,
            disableWithdraw_V1,
            remainingTimeText_V1,
            balance_V1,
            totalProfit_V1,
            totalReturned_V1,
            agreeToTerms_V1,
            userAgreed_V1,
            approve_V1,
            depositBusd_V1,
            withdraw_V1
        }),
        [ isWalletApproving, isDepositing, startInvestmentPeriodDate_V1, endInvestmentPeriodDate_V1, currentInvestment_V1, totalInvestors_V1,userLastInvestment_V1,
            roiToDate_V1, userReturned_V1, currentTierNo_V1, currentTierPercentage_V1, disableDeposit_V1, disableWithdraw_V1,
            remainingTimeText_V1, balance_V1, totalProfit_V1, totalReturned_V1, totalInvestedToDate_V1, agreeToTerms_V1, userAgreed_V1, approve_V1, depositBusd_V1, withdraw_V1]
    );

    return fundInfo;
}