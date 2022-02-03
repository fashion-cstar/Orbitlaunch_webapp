import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  BITQUERY_GRAPHQL_URL,
  BITQUERY_HEADERS,
  CORS,
} from "@app/shared/AppConstant";
import { queryWalletBalances } from "@app/shared/Queries";

export default async function getWalletBalances(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;
  try {
    const response = await axios.post(
      BITQUERY_GRAPHQL_URL,
      {
        query: queryWalletBalances,
        variables: {
          address,
        },
        mode: CORS,
      },
      {
        headers: BITQUERY_HEADERS,
      }
    );
    const balances = response.data.data.ethereum?.address?.[0]?.balances
      ?.filter((bal) => bal.value > 0)
      .map((bal) => ({
        ...bal,
      }));

    res.status(200).json({ balances });
  } catch (error) {
    res.status(500).json({ error });
  }
}
