import { JsonRpcSigner, Web3Provider, JsonRpcProvider } from '@ethersproject/providers'

import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { getAddress } from '@ethersproject/address'
import { utils } from 'ethers'
import { ChainId } from "@usedapp/core";
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  if (value) {
    try {
      return getAddress(value)
    } catch (e) {
      return false
    }
  }
  return false
}

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  let prefix = `https://etherscan.io`
  if (chainId === ChainId.Rinkeby) {
    prefix = `https://rinkeby.etherscan.io`
  }
  if (chainId === ChainId.BSCTestnet) {
    prefix = `https://testnet.bscscan.com`
  }
  if (chainId === ChainId.BSC) {
    prefix = `https://bscscan.com`
  }
  if (chainId === ChainId.Polygon) {
    prefix = `https://polygonscan.com`
  }
  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function getSigner(library: JsonRpcProvider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export function getContract(address: string, ABI: any, library: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export const wait = (time: number) =>
  new Promise(resolve => {
    setTimeout(resolve, time * 1000)
})

export const formatEther = (amount: BigNumber, decimals: number, toFixed: number): number => {
    let temp:BigNumber=amount.mul(BigNumber.from(10).pow(toFixed))
    temp=temp.div(BigNumber.from(10).pow(decimals))

    return (temp.toNumber())/(10**toFixed)
}

export const parseEther = (n: number, decimals: number): BigNumber => {    
    return utils.parseUnits(n.toString(), decimals)
}

export const getChainIdFromName = (name: string): number => {
    let chainId = 1
    switch(name.toLowerCase()){
        case 'eth':
            if (process.env.network==='mainnet') chainId = 1; //ethereum mainnet
            else if (process.env.network==='testnet') chainId = 4; //ethereum rinkeby
            break;
        case 'bsc':
            if (process.env.network==='mainnet') chainId = 56; //bsc mainnet
            else if (process.env.network==='testnet') chainId = 97; //bsc testnet            
            break;  
        default:
            if (process.env.network==='mainnet') chainId = 56; //bsc mainnet
            else if (process.env.network==='testnet') chainId = 97; //bsc testnet            
    }    
    return chainId
}