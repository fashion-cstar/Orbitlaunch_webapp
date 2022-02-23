import { ethers } from "ethers";

const noTierInfo = { tierNo: 0, requiredTokens: ethers.BigNumber.from("0"), shownRequiredTokens: "0", monthlyPercent: "0" }

export const tierInformation = [
    { tierNo: 1, requiredTokens: ethers.BigNumber.from("250000"), shownRequiredTokens: "250,000", monthlyPercent: "10" },
    { tierNo: 2, requiredTokens: ethers.BigNumber.from("100000"), shownRequiredTokens: "100,000", monthlyPercent: "9.5" },
    { tierNo: 3, requiredTokens: ethers.BigNumber.from("50000"), shownRequiredTokens: "50,000", monthlyPercent: "9" },
    { tierNo: 4, requiredTokens: ethers.BigNumber.from("25000"), shownRequiredTokens: "25,000", monthlyPercent: "8.5" },
    { tierNo: 5, requiredTokens: ethers.BigNumber.from("10000"), shownRequiredTokens: "10,000", monthlyPercent: "8" },
    { tierNo: 6, requiredTokens: ethers.BigNumber.from("5000"), shownRequiredTokens: "5,000", monthlyPercent: "7.5" },
    { tierNo: 7, requiredTokens: ethers.BigNumber.from("2500"), shownRequiredTokens: "2,500", monthlyPercent: "7" }
]

export const getTierValues = async (tokenAmount: ethers.BigNumber) => {
    const currentTierInformation = [...tierInformation];

    if (Number(tokenAmount) === 0) {
        return noTierInfo;
    }

    let requiredTokenList = currentTierInformation.map(tier => tier.requiredTokens._hex);
    requiredTokenList.push(tokenAmount._hex);
    const sortedList = requiredTokenList.sort((a, b) => (ethers.utils.formatEther(a) <= ethers.utils.formatEther(b)) ? 0 : -1)

    const index = sortedList.indexOf(tokenAmount._hex);

    return tierInformation[index];
}