import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getHolders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { baseCurrency } = req.query;
    const { data:blockheight } = await axios.get(
      `https://api.covalenthq.com/v1/56/block_v2/latest/?key=ckey_4fea227d938b4927a6793aac90f`
    );
    const latestheight = blockheight?.data?.items[0]?.height || ''
    const { data } = await axios.get(
      `https://api.covalenthq.com/v1/56/tokens/${baseCurrency}/token_holders_changes/?quote-currency=USD&format=JSON&starting-block=12500100&ending-block=${latestheight}&key=ckey_4fea227d938b4927a6793aac90f`
    );
    const holders = data?.data?.pagination?.total_count || 0;
    res.status(200).json({
      holders,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
