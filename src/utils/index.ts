import { JsonRpcSigner, Web3Provider, JsonRpcProvider } from '@ethersproject/providers'

import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { getAddress } from '@ethersproject/address'
import { utils } from 'ethers'
import { ChainId } from "@usedapp/core";

export enum PROJECT_STATUS {
  Unknown,
  PresaleOpeningSoon,
  PresaleOpen,
  PresaleClosed,
  PublicPresaleOpen,
  PublicPresaleClosed,
  ProjectLaunched,
  VestingStarted,
  VestingClosed,
  PresaleFilled  
}

enum NETWORK_NAME {
  Ethereum = 'ethereum',
  BSC = 'bsc',
  Polygon = 'polygon'
}

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

export const CHAIN_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: 'Ethereum',
  [ChainId.Rinkeby]: 'Rinkeby',
  [ChainId.BSC]: 'Smart Chain',
  [ChainId.BSCTestnet]: 'Smart Chain Testnet',
  [ChainId.Polygon]: 'Polygon',
  [ChainId.Mumbai]: 'Mumbai',
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
  if (decimals<5) return 0
  try{
    let temp: BigNumber = amount.mul(BigNumber.from(10).pow(toFixed))
    temp = temp.div(BigNumber.from(10).pow(decimals))
    return (temp.toNumber()) / (10 ** toFixed)
  }catch (error) {}
  return 0
}

export const parseEther = (n: number, decimals: number): BigNumber => {
  return utils.parseUnits(n.toString(), decimals)
}

export const getChainIdFromName = (name: string): number => {
  let chainId = 1
  switch (name.toLowerCase()) {
    case NETWORK_NAME.Ethereum:
      if (process.env.network === 'mainnet') chainId = 1; //ethereum mainnet
      else if (process.env.network === 'testnet') chainId = 4; //ethereum rinkeby
      break;
    case NETWORK_NAME.BSC:
      if (process.env.network === 'mainnet') chainId = 56; //bsc mainnet
      else if (process.env.network === 'testnet') chainId = 97; //bsc testnet            
      break;
    case NETWORK_NAME.Polygon:
      if (process.env.network === 'mainnet') chainId = 137; //polygon mainnet
      else if (process.env.network === 'testnet') chainId = 80001; //mumbai testnet            
      break;
    default:
      if (process.env.network === 'mainnet') chainId = 56; //bsc mainnet
      else if (process.env.network === 'testnet') chainId = 97; //bsc testnet            
  }
  return chainId
}

export const getNativeSymbol = (name: string): string => {
  let symbol = 'BNB'
  switch (name.toLowerCase()) {
    case NETWORK_NAME.Ethereum:
      symbol="ETH"
      break;
    case NETWORK_NAME.BSC:
      symbol="BNB"
      break;
    case NETWORK_NAME.Polygon:
      symbol="MATIC"
      break;
    default:      
  }
  return symbol
}

export const getProjectStatusText = (ps: number): string => {
  switch (ps) {
    case PROJECT_STATUS.Unknown:
      return ''
    case PROJECT_STATUS.PresaleOpeningSoon:
      return 'presale opening soon'
    case PROJECT_STATUS.PresaleOpen:
      return 'presale open'
    case PROJECT_STATUS.PresaleClosed:
      return 'presale closed'
    case PROJECT_STATUS.PublicPresaleOpen:
      return 'public presale open'
    case PROJECT_STATUS.PublicPresaleClosed:
      return 'public presale closed'
    case PROJECT_STATUS.ProjectLaunched:
      return 'project launched'
    case PROJECT_STATUS.VestingStarted:
      return 'vesting started'
    case PROJECT_STATUS.VestingClosed:
      return 'vesting closed'
    case PROJECT_STATUS.PresaleFilled:
      return 'Presale Filled'   
    default:
      return ''   
  }
}

export const getJoinPresaleButtonText = (ps: number): string => {  
  switch (ps) {
    case PROJECT_STATUS.Unknown: 
    case PROJECT_STATUS.PresaleOpeningSoon: 
    case PROJECT_STATUS.PresaleOpen: 
    case PROJECT_STATUS.PublicPresaleOpen:
      return 'Join Presale Now'
    case PROJECT_STATUS.PresaleClosed:
    case PROJECT_STATUS.PublicPresaleClosed:
    default:
      return 'Your Presale Tokens'
  }
}

export const getJoinPresaleButtonActive = (ps: number): boolean => {
  if (ps >= PROJECT_STATUS.PresaleOpen && ps <= PROJECT_STATUS.PublicPresaleClosed 
    || ps === PROJECT_STATUS.PresaleFilled) return true
  return false
}

export const FOURTEEN_DAYS = 14