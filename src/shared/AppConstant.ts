import { ChainId } from "@usedapp/core";
import BSCIcon from "@app/components/svgs/BSCIcon";
import ETHIcon from "@app/components/svgs/ETHIcon";
import { FC } from "react";

export const BITQUERY_HEADERS = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BITQUERY_API_KEY,
};

export const BITQUERY_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_BITQUERY_API_URL || "https://graphql.bitquery.io";

export const CORS = "cors";
export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dead";
export const NETWORK_BSC = "bsc";
export const BNB_TOKEN_ADDRESS = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
export const ETH_TOKEN_ADDRESS = "0x2170ed0880ac9a755fd29b2688956bd959f933f8";
export const BTC_TOKEN_ADDRESS = "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c";
export const BUSD_TOKEN_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";//mainet: "0xe9e7cea3dedca5984780bafc599bd69add087d56"; testnet: 0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47
export const RESOLUTION_TO_INTERVAL = {
  1: 60,
  5: 300,
  15: 900,
  30: 1800,
  60: 3600,
  "1D": 86400,
  "1W": 604800,
  "1M": 2592000,
};

export const TV_CHART_CONTAINER_ID = "tv-chart-container";

export const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
export const USDTokenAddress = "0x55d398326f99059fF775485246999027B3197955";
export const PancakeSwapContractAddress =
  "0x10ed43c718714eb63d5aa57b78b54704e256024e";
export const PancakeRouterContractAddress =
  "0x10ed43c718714eb63d5aa57b78b54704e256024e";

export const OrbitFundContractAddress = "0x88520Ddf58675EDe704027407e9177c62A0209F5"; // testnet: 0x26E17791ee9a2116DDf78620D966b8967f0F85B2
export const BusdContractAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"; // testnet MOCK BUSD: 0xCbdEB985e2189e615eAe14F5784733C0122c253c
export const OrbitStableTokenAddress = "0xc7D37e2601DEd22e28A0C37De82807cb91878A32" // testnet: 0x2a087e33c0C44A2B351B5329cBFf8A63d352C599
export const AppTokenAddress = "0xB46aCB1f8D0fF6369C2f00146897aeA1dFCf2414";//TODO: "0xb46acb1f8d0ff6369c2f00146897aea1dfcf2414"; / testnet 0x8401e6E7ba1A1EC011BDf34CD59Fb11545FaE523
export const AppLPAddress = "0x931B22A138893258c58f3e4143B17086a97862F6"//TODO: "0x931B22A138893258c58f3e4143B17086a97862F6"; / testnet 0xba5282c6e9Fe1aDC51A7Da876D7ACD88069dF865
export const AppERC20TokenAddress =
  "0x43f11c02439e2736800433b4594994bd43cd066d";
export const EthRewardsTokenAddress =
  "0xb1b6c1717a2273a907d9778cf5318aee2e4bc67e";
export const ETHDecimals = 18;
export const EtherUnit = "ether";

export const IS_CONNECTED = "IS_CONNECTED";
export const CONNECTED_PROVIDER = "CONNECTED_PROVIDER";

export const BEP20_BRIDGE_CONTRACT =
  "0x087E62C4a3D64F028dF3fc70D9d1D02578c31A12";
export const ERC20_BRIDGE_CONTRACT =
  "0xa059087DE1321517892eC73DA5f6F665C8e009db";
export const BURN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const API_GET_LAST_USER_SWAP_ON_DESTINATION_NETWORK =
  "https://as.moontography.com/user/last/swap/:network/:address/:contractAddress";

export const CHAIN_ID_MAP: { [key: ChainId | number]: string } = {
  1: "Ethereum Mainnet",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Görli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  0: "Not Connected",
};

export const CHAIN_ID_NAME_MAP: { [key: ChainId | number]: string } = {
  1: "ETH",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Görli",
  42: "Kovan",
  56: "BEP20",
  0: "Not Connected",
};

export const CHAIN_ID_ICON_MAP: { [key: ChainId | number]: FC } = {
  1: ETHIcon,
  3: ETHIcon,
  4: ETHIcon,
  5: ETHIcon,
  42: ETHIcon,
  56: BSCIcon,
};

export const HTTP_METHODS: {
  [key: string]: "GET" | "POST" | "PUT" | "DELETE";
} = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const BSC_RPC_URL = "https://bsc-dataseed1.binance.org"; //TODO: "https://bsc-dataseed1.binance.org" testnet https://data-seed-prebsc-1-s1.binance.org:8545/
