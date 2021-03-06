import { BigNumberish } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcSigner } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import pancakeSwapAbi from "@app/lib/contract/abis/pancake.json";
import Web3 from "web3";
import {
  BUSD_TOKEN_ADDRESS,
  PancakeSwapContractAddress,
  BNB_TOKEN_ADDRESS,
} from "@app/shared/AppConstant";

interface GetPriceOptions {
  amount: BigNumberish;
  tokenAddress: string;
  decimals: number | string;
}

interface GetPriceResult {
  token: string;
  bnb: string;
  usdt: string;
}

export async function getTokenPrice({
  amount,
  decimals,
  tokenAddress,
}: GetPriceOptions): Promise<GetPriceResult> {
  try {
    const pancakeSwapContract = new Contract(
      PancakeSwapContractAddress,
      pancakeSwapAbi
    );

    if (tokenAddress === BNB_TOKEN_ADDRESS) {
      const amountOut = await pancakeSwapContract.getAmountsOut(amount, [
        BNB_TOKEN_ADDRESS,
        BUSD_TOKEN_ADDRESS,
      ]);
      console.log("BNB", {
        token: formatUnits(amount),
        bnb: formatUnits(amount),
        usdt: formatUnits(amountOut[1]),
      });
      return {
        token: formatUnits(amount, decimals),
        bnb: formatUnits(amount, decimals),
        usdt: formatUnits(amountOut[1]),
      };
    }
    const amountOut = await pancakeSwapContract.getAmountsOut(amount, [
      tokenAddress,
      BNB_TOKEN_ADDRESS,
    ]);

    const usdtAmountOut = await pancakeSwapContract.getAmountsOut(
      amountOut[1],
      [BNB_TOKEN_ADDRESS, BUSD_TOKEN_ADDRESS]
    );

    return {
      token: formatUnits(amount, decimals),
      bnb: formatUnits(amountOut[1]),
      usdt: formatUnits(usdtAmountOut[1]),
    };
  } catch (error) {
    console.log(error);
    return {
      token: "0",
      bnb: "0",
      usdt: "0",
    };
  }
}

export async function getBNBPrice() {
  const binanceProvider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_BINANCE_NODE
  );
  const BinanceWeb3Service = new Web3(binanceProvider);

  const pancakeSwap = new BinanceWeb3Service.eth.Contract(
    pancakeSwapAbi as any,
    PancakeSwapContractAddress
  );
  const [_, bnbPriceInBusd] = await pancakeSwap.methods
    .getAmountsOut(parseUnits("1", 18), [BNB_TOKEN_ADDRESS, BUSD_TOKEN_ADDRESS])
    .call();
  return Number(formatUnits(bnbPriceInBusd, 18));
}
