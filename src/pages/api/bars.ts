import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  BITQUERY_GRAPHQL_URL,
  BITQUERY_HEADERS,
  BNB_TOKEN_ADDRESS,
  BUSD_TOKEN_ADDRESS,
  CORS,
  RESOLUTION_TO_INTERVAL,
} from "@app/shared/AppConstant";
import { getThirtyDaysAgo } from "@app/shared/helpers/time";
import { queryGetBars, queryGetBarsWithoutFrom } from "@app/shared/Queries";

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

    let _quoteCurrency = BNB_TOKEN_ADDRESS;

    if (baseCurrency?.toLowerCase() === BNB_TOKEN_ADDRESS) {
      _quoteCurrency = BUSD_TOKEN_ADDRESS;
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const todayISOString = today.toISOString();

    const response = await axios.post(
      BITQUERY_GRAPHQL_URL,
      {
        query:
          firstDataRequest && countBack
            ? queryGetBarsWithoutFrom
            : queryGetBars,
        variables: {
          from:
            firstDataRequest && countBack
              ? undefined
              : new Date(from * 1000)?.toISOString() ||
                getThirtyDaysAgo().toISOString(),
          to:
            firstDataRequest && countBack
              ? todayISOString
              : firstDataRequest
              ? todayISOString
              : new Date(to * 1000)?.toISOString(),
          limit: Math.round(countBack * 1.1) || 600,
          quoteCurrency: _quoteCurrency,
          baseCurrency: baseCurrency as string,
          network: "bsc",
          interval: RESOLUTION_TO_INTERVAL[resolution],
        },
        mode: CORS,
      },
      {
        headers: BITQUERY_HEADERS,
      }
    );
    // sort from oldest to newest
    const bars = response.data.data.ethereum?.dexTrades.sort(
      (a, b) =>
        new Date(a.timeInterval.minute).getTime() -
        new Date(b.timeInterval.minute).getTime()
    );

    res.status(200).json({ data: bars });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e, data: [] });
    res.end();
  }
}
