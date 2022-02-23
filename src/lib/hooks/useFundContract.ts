// @todo: create dedicated dir in lib for fund domain with services, constants, abi related to fund
// @todo: current fund address here is related to testnet > we need to create a .env to use testnet on dev and mainnet en prd

import { Contract } from "@ethersproject/contracts";
import { useContractFunction, useEthers } from "@usedapp/core";
// import OrbitFundAbi from "./../contract/abis/fund/orbitfund.abi.json"
// const orbitFundAddress = "0x3367cDA140fe536E55b65E523044AFB946Df23B5";
import BusdAbi from "@app/lib/contract/abis/busd.abi.json"
import { useEffect, useState } from "react";
const BusdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56"

export async function getTotalInvestors(): Promise<any> {

    // const { library } = useEthers();
    const [bidule, setBidule] = useState('');
    useEffect(() => {
        const busdContract = new Contract(BusdAddress, BusdAbi);
        const { state, send } = useContractFunction(busdContract, 'getOwner');
        send().then(res => {
            setBidule('res');
        })
    })


    // console.log({library})
    // const orbitFundContract = new Contract(orbitFundAddress, OrbitFundAbi, library);
    // const { state, send } = useContractFunction(orbitFundContract, 'getTotalInvestors');
    // const busdContract = new Contract(BusdAddress, BusdAbi, library);
    // const { state, send } = useContractFunction(busdContract, 'getOwner');
    return bidule;
}