import { BNB_TOKEN_ADDRESS } from "./../../shared/AppConstant";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  BITQUERY_GRAPHQL_URL,
  BITQUERY_HEADERS,
  CORS,
} from "@app/shared/AppConstant";
import { getTwentyFourHoursAgo } from "@app/shared/helpers/time";
import {
  queryGetBNBPriceOf,
  queryGetBUSDPriceOf,
  queryPriceInBNB,
  queryPriceInBUSD,
} from "@app/shared/Queries";

export default async function getPriceBetween(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { baseCurrency } = req.query;
  try {
    const response = await axios.post(
      BITQUERY_GRAPHQL_URL,
      {
        query: queryGetBNBPriceOf,
        variables: {
          from: getTwentyFourHoursAgo().toISOString(),
          baseCurrency,
        },
        mode: CORS,
      },
      {
        headers: BITQUERY_HEADERS,
      }
    );
    const priceResponse = await axios.post(
      BITQUERY_GRAPHQL_URL,
      {
        query: queryPriceInBNB,
        variables: {
          from: new Date().toISOString(),
          baseCurrency,
        },
        mode: CORS,
      },
      {
        headers: BITQUERY_HEADERS,
      }
    );
    const bnbPriceResponse = await axios.post(
      BITQUERY_GRAPHQL_URL,
      {
        query: queryPriceInBUSD,
        variables: {
          from: new Date().toISOString(),
          baseCurrency: BNB_TOKEN_ADDRESS,
        },
        mode: CORS,
      },
      {
        headers: BITQUERY_HEADERS,
      }
    );
    const price = priceResponse.data.data.ethereum?.dexTrades?.[0]?.value;
    const quotes = response.data.data?.ethereum?.dexTrades;
    const bnbPrice = bnbPriceResponse.data.data.ethereum?.dexTrades?.[0]?.value;
    const firstQuote = quotes?.[0];
    const transformedQuote = quotes.map((quote) => ({
      time: Math.floor(new Date(quote.timeInterval.minute).getTime() / 1000),
      value: quote.value * bnbPrice,
    }));

    res.status(200).json({
      baseCurrency: firstQuote.baseCurrency?.symbol,
      data: transformedQuote,
      price: price * bnbPrice,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
