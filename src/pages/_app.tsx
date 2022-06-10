import { CacheProvider, EmotionCache, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { BSC, Config, DAppProvider, Mainnet, BSCTestnet } from "@usedapp/core";
import Layout from "@app/components/Layout/Layout";

import createEmotionCache from "@app/lib/emotion/createEmotionCache";
import theme from "@app/lib/theme";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { BSC_RPC_URL } from "@app/shared/AppConstant";
import compose from "@app/shared/helpers/compose";
import "@app/styles/globals.css";
import { SnackbarContextProvider } from "@app/lib/hooks/useSnackbar";
import { LockActionsProvider, RefreshContextProvider, FundStatsProvider } from "@app/contexts";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface OrbitAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// @todo: below needs to be in .env file and create dedicated command in package.json

// testnet
// const config: Config = {
//   readOnlyChainId: BSCTestnet.chainId, //TODO: BSC.chainId,
//   readOnlyUrls: {
//     [BSCTestnet.chainId]: BSC_RPC_URL, //TODO: [BSC.chainId]: BSC_RPC_URL,
//   },
//   networks: [BSC, Mainnet, BSCTestnet],
//   autoConnect: false
// };

// mainet
const config: Config = {
  readOnlyChainId: BSC.chainId,
  readOnlyUrls: {
    [BSC.chainId]: BSC_RPC_URL,
  },
  networks: [BSC, Mainnet, BSCTestnet],
  autoConnect: false
};

function OrbitApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: OrbitAppProps) {
  const router = useRouter();

  return (
    <CacheProvider value={emotionCache}>
      <DAppProvider config={config}>
        <ThemeProvider theme={theme}>
          <RefreshContextProvider>
            <LockActionsProvider>
              <FundStatsProvider>
                <SnackbarContextProvider>
                  <CssBaseline />
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </SnackbarContextProvider>
              </FundStatsProvider>
            </LockActionsProvider>
          </RefreshContextProvider>
        </ThemeProvider>
      </DAppProvider>
    </CacheProvider>
  );
}

export default compose()(OrbitApp);
