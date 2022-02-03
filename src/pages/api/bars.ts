import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  BITQUERY_GRAPHQL_URL,
  BITQUERY_HEADERS,
  CORS,
  NETWORK_BSC,
  RESOLUTION_TO_INTERVAL,
  BNB_TOKEN_ADDRESS,
} from "@app/shared/AppConstant";
import { getThirtyDaysAgo } from "@app/shared/helpers/time";
import { queryGetBars } from "@app/shared/Queries";

export default async function apiGetDexTrades(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }
  try {
    const {
      baseCurrency,
      resolution,
      symbolInfo: { ticker },
      from,
      to,
      countBack,
      firstDataRequest,
    } = req.body as any;

    const response = await axios.post(
      BITQUERY_GRAPHQL_URL,
      {
        query: queryGetBars,
        variables: {
          from:
            new Date(from * 1000)?.toISOString() ||
            getThirtyDaysAgo().toISOString(),
          to: firstDataRequest
            ? new Date().toISOString()
            : new Date(to * 1000)?.toISOString(),
          limit: countBack || 600,
          quoteCurrency: BNB_TOKEN_ADDRESS,
          baseCurrency: baseCurrency as string,
          network: "bsc",
          interval: RESOLUTION_TO_INTERVAL[resolution] / 60,
        },
        mode: CORS,
      },
      {
        headers: BITQUERY_HEADERS,
      }
    );

    const constructedBars = response.data.data.ethereum?.dexTrades.reduce(
      (result, bar) => {
        const isSell = bar.low < bar.high;
        const isBuy = bar.low > bar.high;
        const previousBar = result[result.length - 1] || bar;
        const _bar = {
          time: new Date(bar.timeInterval.minute).getTime(), // date string in api response
          low: bar.low,
          high: bar.high,
          open: Number(previousBar.close),
          close: Number(bar.close),
          volume: bar.volume,
        };
        return result.concat(_bar);
      },
      []
    );

    // const bars = response.data.data.ethereum?.dexTrades.map((el) => ({
    //   time: new Date(el.timeInterval.minute).getTime(), // date string in api response
    //   low: el.low,
    //   high: el.high,
    //   open: Number(el.open),
    //   close: Number(el.close),
    //   volume: el.volume,
    // }));
    res.status(200).json({ data: constructedBars });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
    res.end();
  }
}
