import axios from "axios";
import { configurationData } from "@app/components/Chart/bitquery";
import { NextApiRequest, NextApiResponse } from "next";
import { queryGetSymbols } from "@app/shared/Queries";
import {
  BITQUERY_HEADERS,
  BNB_TOKEN_ADDRESS,
  BUSD_TOKEN_ADDRESS,
  CORS,
  NETWORK_BSC,
} from "@app/shared/AppConstant";
import { getTimeZone } from "@app/shared/helpers/time";

export default async function apiGetDexTrades(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }
  try {
    const { baseCurrency, tokenAddress } = req.query;

    let _quoteCurrency = BNB_TOKEN_ADDRESS;

    if ((tokenAddress as string)?.toLowerCase() === BNB_TOKEN_ADDRESS) {
      _quoteCurrency = BUSD_TOKEN_ADDRESS;
    }

    const response = await axios.post(
      process.env.NEXT_PUBLIC_BITQUERY_API_URL || "https://graphql.bitquery.io",
      {
        query: queryGetSymbols(
          baseCurrency as string,
          NETWORK_BSC,
          _quoteCurrency
        ),
        mode: CORS,
      },
      {
        headers: BITQUERY_HEADERS,
      }
    );

    const coin = response.data.data.ethereum?.dexTrades[0].baseCurrency;
    if (!coin) {
      res.status(500).json({ error: "Coin not found" });
      res.end();
    } else {
      const symbol = {
        ticker: tokenAddress,
        name: `${coin.symbol}/BNB`,
        session: "24x7",
        timezone: getTimeZone(),
        minmov: 1,
        pricescale: 10000000,
        has_intraday: true,
        intraday_multipliers: ["1", "5", "15", "30", "60"],
        has_empty_bars: false,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        data_status: "streaming",
      };
      res.status(200).json({ data: symbol });
    }
  } catch (e) {
    res.status(500).json({ error: "Coin not found" });
    res.end();
  }
}
