import busdAbi from '@app/lib/contract/abis/busdAbi.json';
import { startPeriodTime, totalInvestedAmount, endPeriodTime, getTotalInvestors, depositInfos, depositBusd } from '@app/lib/contract/abis/consumers/fundService';
import { formatEther } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useMemo, useState } from "react";
import {
    AppTokenAddress,
    MockOrbitFundContractAddress,
    BSC_RPC_URL,
    MockBusdContractAddress
} from "@app/shared/AppConstant";
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbi.json";
import { ethers } from "ethers";
import { getTierValues } from '@app/shared/TierLevels';

export default function useFund() {
    const { account } = useEthers();
    const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
    const orbitFundContract = new ethers.Contract(
        MockOrbitFundContractAddress,
        orbitFundAbi,
        provider.getSigner()
    );
    const busdContract = new ethers.Contract(
        MockBusdContractAddress,
        busdAbi,
        provider.getSigner()
    );
    const connectedUserBalance = useTokenBalance(AppTokenAddress, account);

    const [{
        currentInvestment,
        totalInvestors,
        roiToDate, currentTierNo,
        currentTierPercentage,
        isInvestmentPeriodAvailable,
        balance
    }, setInfo] = useState({
        currentInvestment: '0.000',
        totalInvestors: 0,
        roiToDate: '0.0',
        currentTierNo: 0,
        currentTierPercentage: "0",
        isInvestmentPeriodAvailable: true,
        balance: '0.000'
    });

    //------ EVENTS ------

    orbitFundContract.on('Deposited', (wallet: any, amount: any, tierValue: any) => {
        console.log("DEPOSIT EVENT TRIGGERED");
        console.log("WALLET: " + wallet);
        console.log("AMOUNT: " + amount);
        console.log("TIER VALUE: " + tierValue);

        return;
    });

    busdContract.on('Approval', async (owner: any, spender: any, value: any) => {
        console.log("APPROVAL EVENT TRIGGERED");
        console.log("OWNER: " + owner);
        console.log("SPENDER: " + spender);
        console.log("VALUE: " + value);

        const depositResult = await depositBusd({ amount: value });
        if (!depositResult.ok) {
            console.error(depositResult.message);
            return;
        }
    })

    //----------------------

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

    const isDepositPeriodAvailable = async () => {
        const startTime = await startPeriodTime();
        if (!startTime.ok) return false;

        const endTime = await endPeriodTime();
        if (!endTime.ok) return false;

        return startTime.returnedModel > Math.round(new Date().getTime() / 1000);
    }

    const getTotalDepositedInfo = async () => {
        const depositedAmount = await depositInfos({ address: account });
        if (!depositedAmount.ok) return '0.000';

        return depositedAmount.returnedModel;
    }

    useEffect(() => {

        const fetchConnectedData = async () => {
            let periodAvailable = await isDepositPeriodAvailable();

            let totalInvestment = await getTotalDepositedInfo();
            const formattedFundBalance = (!!totalInvestment) ? formatEther(totalInvestment) : '0';
            const investmentAmountInDollars = (parseFloat(formattedFundBalance) * parseFloat("1")).toFixed(2);

            const formattedConnectedBalance = (!!connectedUserBalance) ? formatEther(connectedUserBalance) : '0';
            let tierResult = await getTierValues((!!formattedConnectedBalance) ? ethers.BigNumber.from(parseFloat(formattedConnectedBalance)) : ethers.BigNumber.from('0'));

            return {
                currentInvestment: investmentAmountInDollars,
                totalInvestors: 0,
                roiToDate: '0.0',
                currentTierNo: tierResult.tierNo,
                currentTierPercentage: tierResult.monthlyPercent,
                isInvestmentPeriodAvailable: periodAvailable,
                balance: investmentAmountInDollars
            };
        }

        const fetchNotConnectedData = async () => {
            let periodAvailable = await isDepositPeriodAvailable();
            let totalInvestment = ethers.utils.formatEther(await getTotalInvestment());
            let totalInvestorNumber = await getTotalInvestorNumber();

            return {
                currentInvestment: totalInvestment,
                totalInvestors: totalInvestorNumber,
                roiToDate: '0.0',
                currentTierNo: 0,
                currentTierPercentage: "0",
                isInvestmentPeriodAvailable: periodAvailable,
                balance: totalInvestment
            }
        }

        if (!!account && !!connectedUserBalance) {
            fetchConnectedData().then(result => {
                setInfo({
                    currentInvestment: result.currentInvestment,
                    totalInvestors: result.totalInvestors,
                    roiToDate: result.roiToDate,
                    currentTierNo: result.currentTierNo,
                    currentTierPercentage: result.currentTierPercentage,
                    isInvestmentPeriodAvailable: result.isInvestmentPeriodAvailable,
                    balance: result.currentInvestment
                });
            }).catch(console.error);;
        }
        else {
            fetchNotConnectedData().then(result => {
                setInfo({
                    currentInvestment: result.currentInvestment,
                    totalInvestors: result.totalInvestors,
                    roiToDate: result.roiToDate,
                    currentTierNo: result.currentTierNo,
                    currentTierPercentage: result.currentTierPercentage,
                    isInvestmentPeriodAvailable: result.isInvestmentPeriodAvailable,
                    balance: result.currentInvestment
                });
            }).catch(console.error);
        }

    }, [account, connectedUserBalance]);

    const fundInfo = useMemo(
        () => ({
            currentInvestment,
            totalInvestors,
            roiToDate,
            currentTierNo,
            currentTierPercentage,
            isInvestmentPeriodAvailable,
            balance
        }),
        [currentInvestment, totalInvestors, roiToDate, currentTierNo, currentTierPercentage, isInvestmentPeriodAvailable, balance]
    );

    return fundInfo;
}
