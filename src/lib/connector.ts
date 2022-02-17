import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 56],
});

export const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    56: "https://bsc-dataseed1.binance.org",
    1: "https://mainnet.infura.io/v3/64b1a32f80f249aa9fffbe3f89820148",
  },
  supportedChainIds: [1, 56],
  qrcode: true,
  infuraId: "64b1a32f80f249aa9fffbe3f89820148",
});