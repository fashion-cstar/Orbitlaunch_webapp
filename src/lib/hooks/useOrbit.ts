import { formatUnits } from "@ethersproject/units";
import { useToken, useTokenBalance } from "@usedapp/core";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  AppTokenAddress,
  DEAD_ADDRESS,
  AppLPAddress,
} from "@app/shared/AppConstant";
import useSWR from "swr";
import { formatToUSD } from "@app/shared/helpers/currencyHelper";

export default function useOrbit() {
  const orbitToken = useToken(AppTokenAddress);
  const lpBalance = useTokenBalance(AppTokenAddress, AppLPAddress);
  const burnBalance = useTokenBalance(AppTokenAddress, DEAD_ADDRESS);

  const { data: holdersData } = useSWR(
    `/api/holders?baseCurrency=${AppTokenAddress}`,
    () =>
      axios
        .get(`/api/holders?baseCurrency=${AppTokenAddress}`)
        .then(({ data }) => data),
    {
      // 15 minutes
      refreshInterval: 1000 * 60 * 15,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      // 30 seconds
      errorRetryInterval: 1000 * 30,
    }
  );

  const { data } = useSWR(
    `/api/tokenPrice?baseCurrency=${AppTokenAddress}`,
    () =>
      axios
        .get(`/api/tokenPrice?baseCurrency=${AppTokenAddress}`)
        .then(({ data }) => data),
    {
      // 15 minutes
      refreshInterval: 1000 * 60 * 15,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      // 30 seconds
      errorRetryInterval: 1000 * 30,
    }
  );

  const [{ liquidityPool, price, totalSupply, marketCap }, setInfo] = useState({
    liquidityPool: "0",
    price: "0",
    totalSupply: "0",
    marketCap: "0",
    bnbPrice: "0"
  });

  // @todo: update format to use for amounts in $ and amount of holders
  useEffect(() => {
    if (orbitToken?.decimals && lpBalance && data && burnBalance) {
      const _liquidity = Number(formatUnits(lpBalance, orbitToken.decimals));
      const _totalSupply =
        Number(formatUnits(orbitToken.totalSupply, orbitToken.decimals)) -
        Number(formatUnits(burnBalance, orbitToken.decimals));
      setInfo({
        liquidityPool: formatToUSD(((_liquidity * data.price) / data.bnbPrice).toFixed(0)),
        price: data.price?.toFixed(4),
        totalSupply: formatToUSD(_totalSupply.toFixed(0)),
        marketCap: formatToUSD((_totalSupply * data.price).toFixed(0)),
        bnbPrice: data.bnbPrice
      });
    }
  }, [orbitToken?.decimals, lpBalance, data, burnBalance]);

  const orbitInfo = useMemo(
    () => ({
      liquidityPool,
      price,
      totalSupply,
      marketCap,
      holders: (!!holdersData) ? formatToUSD(holdersData.holders.toString()) : 0,
      bnbPrice: data?.bnbPrice?.toFixed(4)
    }),
    [liquidityPool, price, totalSupply, holdersData]
  );

  return orbitInfo;
}
