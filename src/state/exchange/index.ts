import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useEthers, ChainId } from "@usedapp/core"
import { calculateGasMargin, getContract, parseEther } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import { RpcProviders } from "@app/shared/PadConstant"
import { getChainIdFromName } from 'src/utils'
import useRefresh from '../useRefresh'
import SWAP_ABI from 'src/lib/contract/abis/orbitswap.json'
import { BNB_TOKEN_ADDRESS, PancakeRouterContractAddress } from '@app/shared/AppConstant'
import { TransactionResponse } from '@ethersproject/providers'

const DRIVE_TRADING_IDS = ['binancecoin', 'solana', 'maker', 'terra-luna', 'basic-attention-token']
export function useDriveTradingTokens(): any[] {
    const [tokensList, setList] = useState<any[]>([])
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchDriveTradingTokens = async () => {
            let list: any[] = []
            await Promise.all(DRIVE_TRADING_IDS.map(async (item, index) => {
                try {
                    await fetch(`https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
                        .then((res: any) => res.json())
                        .then((data) => {
                            list.push({
                                index: index, name: data.name, symbol: data.symbol, address: data.contract_address, logo: data.image?.small,
                                price: Math.round(data.market_data?.current_price?.usd * 10000) / 10000, H24: Math.round(data.market_data?.price_change_percentage_24h * 100) / 100
                            })
                        })
                        .catch(error => {
                            console.error("get driveTradingTokens error:" + error)
                        })
                } catch (e) {
                    console.error('get driveTradingTokens error:', e);
                }
            }))
            setList(list.sort((a, b) => a.index > b.index ? 0 : -1))
        }
        fetchDriveTradingTokens()
    }, [slowRefresh])

    return tokensList
}

const PROMOTED_TRENDING_IDS = ['binancecoin', 'solana', 'maker', 'terra-luna', 'basic-attention-token']
export function usePromotedTrendingTokens(): any[] {
    const [tokensList, setList] = useState<any[]>([])
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchDriveTradingTokens = async () => {
            let list: any[] = []
            await Promise.all(PROMOTED_TRENDING_IDS.map(async (item, index) => {
                try {
                    await fetch(`https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
                        .then((res: any) => res.json())
                        .then((data) => {
                            list.push({
                                index: index, name: data.name, symbol: data.symbol, address: data.contract_address, logo: data.image?.small,
                                price: Math.round(data.market_data?.current_price?.usd * 10000) / 10000, H24: Math.round(data.market_data?.price_change_percentage_24h * 100) / 100
                            })
                        })
                        .catch(error => {
                            console.error("get driveTradingTokens error:" + error)
                        })
                } catch (e) {
                    console.error('get driveTradingTokens error:', e);
                }
            }))
            setList(list.sort((a, b) => a.index > b.index ? 0 : -1))
        }
        fetchDriveTradingTokens()
    }, [slowRefresh])

    return tokensList
}

export function useSwapCallback(): {
    swapExactETHForTokens: (swapContractAddress: string, outTokenAddress: string, amount: BigNumber, to: string, blockchain: string) => Promise<string>, 
    swapTokensForETH: (swapContractAddress: string, inTokenAddress: string, amount: BigNumber, to: string, blockchain: string) => Promise<string>, 
    swapTokensForTokens: (swapContractAddress: string, inTokenAddress: string, outTokenAddress: string, amount: BigNumber, to: string, blockchain: string) => Promise<string>
} {
    // get claim data for this account
    const { account, library, chainId } = useEthers()

    const swapExactETHForTokens = async function (swapContractAddress: string, outTokenAddress: string, amount: BigNumber, to: string, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const swapContract: Contract = getContract(swapContractAddress, SWAP_ABI, library, account ? account : undefined)

        if (!account || !library || !swapContract) return
        var deadline = Math.floor(Date.now() / 1000) + 900;
        return swapContract.estimateGas.swapExactETHForTokens(BigNumber.from(0), [BNB_TOKEN_ADDRESS, outTokenAddress], to, deadline, PancakeRouterContractAddress, {
            value: amount
        }).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return swapContract.swapExactETHForTokens(BigNumber.from(0), [BNB_TOKEN_ADDRESS, outTokenAddress], to, deadline, PancakeRouterContractAddress, {
                gasLimit: calculateGasMargin(gas), value: amount
            }).then((response: TransactionResponse) => {
                return response.hash
            })
        })
    }

    const swapTokensForETH = async function (swapContractAddress: string, inTokenAddress: string, amount: BigNumber, to: string, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const swapContract: Contract = getContract(swapContractAddress, SWAP_ABI, library, account ? account : undefined)
        // const tokenContract: Contract = getContract(inTokenAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
        // let decimals = await tokenContract.decimals()
        if (!account || !library || !swapContract) return
        var deadline = Math.floor(Date.now() / 1000) + 900;
        return swapContract.estimateGas.swapTokensForETH(amount, BigNumber.from(0), [inTokenAddress, BNB_TOKEN_ADDRESS], to, deadline, PancakeRouterContractAddress)
        .then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return swapContract.swapTokensForETH(amount, BigNumber.from(0), [inTokenAddress, BNB_TOKEN_ADDRESS], to, deadline, PancakeRouterContractAddress, {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.hash
            })
        })
    }

    const swapTokensForTokens = async function (swapContractAddress: string, inTokenAddress: string, outTokenAddress: string, amount: BigNumber, to: string, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const swapContract: Contract = getContract(swapContractAddress, SWAP_ABI, library, account ? account : undefined)
        // const tokenContract: Contract = getContract(inTokenAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
        // let decimals = await tokenContract.decimals()
        if (!account || !library || !swapContract) return
        var deadline = Math.floor(Date.now() / 1000) + 900;
        return swapContract.estimateGas.swapTokensForTokens(amount, BigNumber.from(0), [inTokenAddress, BNB_TOKEN_ADDRESS, outTokenAddress], to, deadline, PancakeRouterContractAddress)
        .then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return swapContract.swapTokensForTokens(amount, BigNumber.from(0), [inTokenAddress, BNB_TOKEN_ADDRESS, outTokenAddress], to, deadline, PancakeRouterContractAddress, {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.hash
            })
        })
    }

    return { swapExactETHForTokens, swapTokensForETH, swapTokensForTokens }
}

