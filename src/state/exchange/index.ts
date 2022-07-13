import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useEthers, ChainId } from "@usedapp/core"
import { getContract } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import { RpcProviders } from "@app/shared/PadConstant"
import { getChainIdFromName } from 'src/utils'
import useRefresh from '../useRefresh'

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

