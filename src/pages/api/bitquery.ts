import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  BITQUERY_HEADERS,
  CORS,
  BITQUERY_GRAPHQL_URL,
} from "@app/shared/AppConstant";

export default async function bitQueryAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.post(
    BITQUERY_GRAPHQL_URL,
    {
      query: req.body.query,
      variables: req.body.variables,
      mode: CORS,
    },
    {
      headers: BITQUERY_HEADERS,
    }
  );
  res.status(200).json(response.data);
}
