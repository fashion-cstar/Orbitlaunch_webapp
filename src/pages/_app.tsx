import { CacheProvider, EmotionCache, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { BSC, BSCTestnet, Config, DAppProvider, Mainnet } from "@usedapp/core";
import Layout from "@app/components/Layout/Layout";

import createEmotionCache from "@app/lib/emotion/createEmotionCache";
import theme from "@app/lib/theme";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { BSC_RPC_URL } from "@app/shared/AppConstant";
import compose from "@app/shared/helpers/compose";
import "@app/styles/globals.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface OrbitAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// @todo: create a config for dev and prd
// const config: Config = {
//   readOnlyChainId: 97,
//   readOnlyUrls: {
//     [97]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
//   },
//   networks: [BSCTestnet, Mainnet],
//   autoConnect: false
// };

const config: Config = {
  readOnlyChainId: BSC.chainId,
  readOnlyUrls: {
    [BSC.chainId]: BSC_RPC_URL,
  },
  networks: [BSC, Mainnet],
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
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </DAppProvider>
    </CacheProvider>
  );
}

export default compose()(OrbitApp);
