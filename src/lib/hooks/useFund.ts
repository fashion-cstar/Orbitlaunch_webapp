import { startPeriodTime, totalInvestedAmount, endPeriodTime } from '@app/lib/contract/abis/consumers/orbitFundContractConsumer';
import { formatEther } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useMemo, useState } from "react";
import {
    AppTokenAddress,
    MockOrbitFundContractAddress,
    BSC_RPC_URL
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
    const connectedUserBalance = useTokenBalance(AppTokenAddress, account);
    // const orbitFundUserBalance = useTokenBalance(MockOrbitFundContractAddress, account);

    const [{ currentInvestment, roiToDate, currentTierNo, currentTierPercentage, isInvestmentPeriodAvailable, balance }, setInfo] = useState({
        currentInvestment: '0.000',
        roiToDate: '0.0',
        currentTierNo: 0,
        currentTierPercentage: "0",
        isInvestmentPeriodAvailable: true,
        balance: '0.000'
    });

    orbitFundContract.on('Deposited', (wallet: any, amount: any, tierValue: any) => {
        console.log("DEPOSIT EVENT TRIGGERED");
        console.log("WALLET: " + wallet);
        console.log("AMOUNT: " + amount);
        console.log("TIER VALUE: " + tierValue);
    });

    const getTotalInvestment = async () => {
        const result = await totalInvestedAmount();
        if (!result.ok) {
            return ethers.utils.parseEther('0');
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

    useEffect(() => {

        const fetchConnectedData = async () => {
            let periodAvailable = await isDepositPeriodAvailable();

            const formattedConnectedBalance = (!!connectedUserBalance) ? formatEther(connectedUserBalance) : '0';
            const connectedAmount = (!!formattedConnectedBalance) ? parseFloat(formattedConnectedBalance).toFixed(3) : '0';
            let tierResult = await getTierValues((!!formattedConnectedBalance) ? ethers.BigNumber.from(parseFloat(formattedConnectedBalance)) : ethers.BigNumber.from('0'));
            
            debugger;
            // const formattedOrbitStableBalance = (!!orbitFundUserBalance) ? formatEther(orbitFundUserBalance) : '0';
            // const connectedOrbitAmount = (!!formattedOrbitStableBalance) ? parseFloat(formattedOrbitStableBalance).toFixed(3) : '0';
            const investmentAmountInDollars = (parseFloat(connectedAmount) * parseFloat("1")).toFixed(2);
            
            return {
                currentInvestment: investmentAmountInDollars,
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

            return {
                currentInvestment: totalInvestment,
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
            roiToDate,
            currentTierNo,
            currentTierPercentage,
            isInvestmentPeriodAvailable,
            balance
        }),
        [currentInvestment, roiToDate, currentTierNo, currentTierPercentage, isInvestmentPeriodAvailable, balance]
    );

    return fundInfo;
}
