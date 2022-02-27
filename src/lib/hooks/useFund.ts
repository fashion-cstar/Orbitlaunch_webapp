import { startPeriodTime, totalInvestedAmount, endPeriodTime, getTotalInvestors, depositInfos, depositBusd, userWithdrew } from '@app/lib/contract/abis/consumers/fundService';
import { formatEther } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useMemo, useState } from "react";
import { AppTokenAddress } from "@app/shared/AppConstant";
import { ethers } from "ethers";
import { getTierValues } from '@app/shared/TierLevels';
import moment from 'moment';
import { getRemainingTimeBetweenTwoDates } from '@app/shared/helpers/time';

export default function useFund() {
    const { account } = useEthers();
    const connectedUserBalance = useTokenBalance(AppTokenAddress, account);

    const [{
        startInvestmentPeriodDate,
        endInvestmentPeriodDate,
        currentInvestment,
        totalInvestors,
        roiToDate, currentTierNo,
        currentTierPercentage,
        disableDeposit,
        disableWithdraw,
        remainingTimeText
    }, setInfo] = useState({
        startInvestmentPeriodDate: '-',
        endInvestmentPeriodDate: '-',
        currentInvestment: '0.00',
        totalInvestors: 0,
        roiToDate: '0.0',
        currentTierNo: 0,
        currentTierPercentage: "0",
        disableDeposit: true,
        disableWithdraw: true,
        remainingTimeText: '0 days 0 hours 0 minutes'
    });

    const getTotalInvestment = async () => {
        const result = await totalInvestedAmount();
        if (!result.ok) {
            return ethers.utils.parseEther('0');
        }

        return result.returnedModel;
    }

    const getTotalInvestorNumber = async () => {
        const result = await getTotalInvestors();
        if (!result.ok) {
            return '0';
        }

        return result.returnedModel;
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

    const getTotalDepositedInfo = async () => {
        const depositedAmount = await depositInfos({ address: account });
        if (!depositedAmount.ok) {
            return formatEther(ethers.utils.parseEther('0.000'))
        };

        return formatEther(depositedAmount.returnedModel);
    }

    const isUserWithdrew = async () => {
        const userWithdrewResult = await userWithdrew({ account: account });
        if (!userWithdrewResult.ok) return true;

        return userWithdrewResult.returnedModel;
    }

    useEffect(() => {

        const fetchConnectedData = async () => {
            let depositPeriodResult = await depositPeriodInfo();
            let userWithdrewResult = await isUserWithdrew();

            let totalInvestment = await getTotalDepositedInfo();
            const investmentAmountInDollars = (parseFloat(totalInvestment) * parseFloat("1")).toFixed(2);
            const formattedConnectedBalance = formatEther(connectedUserBalance);

            let tierResult = await getTierValues(ethers.BigNumber.from(Math.trunc(parseFloat(formattedConnectedBalance))));

            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,
                currentInvestment: userWithdrewResult ? '0.00' : investmentAmountInDollars,
                totalInvestors: 0,
                roiToDate: '0.00',
                currentTierNo: tierResult.tierNo,
                currentTierPercentage: tierResult.monthlyPercent,
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText
            };
        }

        const fetchNotConnectedData = async () => {
            let depositPeriodResult = await depositPeriodInfo();
            let totalInvestment = ethers.utils.formatEther(await getTotalInvestment());
            let totalInvestorNumber = await getTotalInvestorNumber();

            return {
                startInvestmentPeriodDate: depositPeriodResult.startDate,
                endInvestmentPeriodDate: depositPeriodResult.endDate,
                currentInvestment: totalInvestment,
                totalInvestors: totalInvestorNumber,
                roiToDate: '0.00',
                currentTierNo: 0,
                currentTierPercentage: "0",
                disableDeposit: depositPeriodResult.disabledDeposit,
                disableWithdraw: depositPeriodResult.disabledWithdraw,
                remainingTimeText: depositPeriodResult.remainingTimeText
            }
        }

        if (!!account && !!connectedUserBalance) {
            fetchConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate: result.endInvestmentPeriodDate,
                    currentInvestment: result.currentInvestment,
                    totalInvestors: result.totalInvestors,
                    roiToDate: result.roiToDate,
                    currentTierNo: result.currentTierNo,
                    currentTierPercentage: result.currentTierPercentage,
                    disableDeposit: result.disableDeposit,
                    disableWithdraw: result.disableWithdraw,
                    remainingTimeText: result.remainingTimeText
                });
            }).catch(console.error);;
        }
        else {
            fetchNotConnectedData().then(result => {
                setInfo({
                    startInvestmentPeriodDate: result.startInvestmentPeriodDate,
                    endInvestmentPeriodDate: result.endInvestmentPeriodDate,
                    currentInvestment: result.currentInvestment,
                    totalInvestors: result.totalInvestors,
                    roiToDate: result.roiToDate,
                    currentTierNo: result.currentTierNo,
                    currentTierPercentage: result.currentTierPercentage,
                    disableDeposit: result.disableDeposit,
                    disableWithdraw: result.disableWithdraw,
                    remainingTimeText: result.remainingTimeText
                });
            }).catch(console.error);
        }

    }, [account, connectedUserBalance]);

    const fundInfo = useMemo(
        () => ({
            startInvestmentPeriodDate,
            endInvestmentPeriodDate,
            currentInvestment,
            totalInvestors,
            roiToDate,
            currentTierNo,
            currentTierPercentage,
            disableDeposit,
            disableWithdraw,
            remainingTimeText
        }),
        [startInvestmentPeriodDate, endInvestmentPeriodDate, currentInvestment, totalInvestors,
            roiToDate, currentTierNo, currentTierPercentage, disableDeposit, disableWithdraw,
            remainingTimeText]
    );

    return fundInfo;
}
