// @todo: create dedicated dir in lib for fund domain with services, constants, abi related to fund
// @todo: current fund address here is related to testnet > we need to create a .env to use testnet on dev and mainnet en prd

import { Contract } from "@ethersproject/contracts";
import OrbitFundAbi from "./../contract/abis/fund/orbitfund.abi.json"
const orbitFundAddress = "0x3367cDA140fe536E55b65E523044AFB946Df23B5";

export async function getTotalInvestors() {
    try {
        const orbitFundContract = new Contract(orbitFundAddress, OrbitFundAbi);
        const totalInvestors = await orbitFundContract.getTotalInvestors();
        return totalInvestors;
    } catch (error) {
        console.log(error);
        return "err";
    }
}