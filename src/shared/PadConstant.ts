import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainId } from "@usedapp/core";
import { ethers } from "ethers"

export const WBNBTokenAddress: { [chainId in ChainId]?: string } = {
    [ChainId.BSC]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    [ChainId.BSCTestnet]: "0xae13d989dac2f0debff460ac112a837c89baa7cd"
}

export const BUSDTokenAddress: { [chainId in ChainId]?: string } = {
    [ChainId.BSC]: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    [ChainId.BSCTestnet]: "0xcbdeb985e2189e615eae14f5784733c0122c253c" // testnet MOCK BUSD
}

export const USDTokenAddress: { [chainId in ChainId]?: string } = {
    [ChainId.Mainnet]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    [ChainId.Rinkeby]: "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad",
    [ChainId.BSC]: "0x55d398326f99059fF775485246999027B3197955",
    [ChainId.BSCTestnet]: "0x377533d0e68a22cf180205e9c9ed980f74bc5050"
}

export const M31TokenAddress: { [chainId in ChainId]?: string } = {
    [ChainId.BSC]: "0xB46aCB1f8D0fF6369C2f00146897aeA1dFCf2414",
    [ChainId.BSCTestnet]: "0x8401e6e7ba1a1ec011bdf34cd59fb11545fae523"
}

export const RpcProviders: { [chainId in ChainId]?: JsonRpcProvider } = {
    [ChainId.Mainnet]: new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/b6a2f439eeb57f2c3c4334a6/eth/mainnet'),    
    [ChainId.Rinkeby]: new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/b6a2f439eeb57f2c3c4334a6/eth/rinkeby'),
    [ChainId.BSC]: new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/b6a2f439eeb57f2c3c4334a6/bsc/mainnet'),
    [ChainId.BSCTestnet]: new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/b6a2f439eeb57f2c3c4334a6/bsc/testnet')
}
