import axios from "axios";
import {
  DatafeedConfiguration,
  IBasicDataFeed,
  LibrarySymbolInfo,
} from "../../../public/static/charting_library/charting_library";
import { BNB_TOKEN_ADDRESS } from "@app/shared/AppConstant";
import { getSubscriptionId, getWBNBBusdPrice } from "@app/shared/Queries";
import { configurationData } from "./bitquery";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default (
  baseCurrency: string = "BNB",
  bnbPriceInBusd: number
): IBasicDataFeed => ({
  onReady(callback) {
    setTimeout(() => callback(configurationData as DatafeedConfiguration));
  },
  async resolveSymbol(symbolName, onResolve, onError) {
    try {
      const response = await axios.get<{ data: LibrarySymbolInfo }>(
        "/api/trades",
        {
          params: {
            baseCurrency,
            tokenAddress: symbolName,
          },
        }
      );
      onResolve(response.data.data);
    } catch (error) {
      onError(error);
    }
  },
  async getBars(
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onError
  ) {
    try {
      const {
        data: { data: bars },
      } = await axios.post("/api/bars", {
        baseCurrency,
        resolution,
        symbolInfo,
        from: periodParams.from,
        to: periodParams.to,
        countBack: periodParams.countBack,
        firstDataRequest: periodParams.firstDataRequest,
      });

      const convertPriceToBUSD = (tokenPrice: number) =>
        tokenPrice * Number(bnbPriceInBusd);

      const constructedBars = bars.reduce((result, bar) => {
        const isFirstBar = result[result.length - 1] === undefined;
        const previousBar = result[result.length - 1] || bar;
        // check if current bar minus interval on previous bar does not exist
        // if it does not exist, then we need to add a new bar

        const _bar = {
          timeInDateFormat: new Date(bar.timeInterval.minute).toISOString(),
          time: new Date(bar.timeInterval.minute).getTime(), // date string in api response
          low: convertPriceToBUSD(bar.low),
          high: convertPriceToBUSD(bar.high),
          open: convertPriceToBUSD(
            !isFirstBar ? previousBar.baseClose : Number(bar.open)
          ),
          close: convertPriceToBUSD(Number(bar.close)),
          baseClose: Number(bar.close),
          volume: convertPriceToBUSD(bar.volume),
          count: bar.trades,
        };
        return result.concat(_bar);
      }, []);

      if (constructedBars.length > 0) {
        onHistoryCallback(constructedBars, { noData: false });
      } else {
        onHistoryCallback(constructedBars, { noData: true });
      }
    } catch (error) {
      onError(error);
    }
  },
  searchSymbols() {},
  async subscribeBars(symbolInfo, resolution, onRealTimeCallback) {
    const [{ data: subscription }, { data: bnbPrice }] = await Promise.all([
      axios.post("/api/bitquery", {
        query: getSubscriptionId,
        variables: {
          baseAddress: baseCurrency,
          quoteAddress: BNB_TOKEN_ADDRESS,
          from: new Date().toISOString(),
          network: "bsc",
        },
      }),
      axios.post("/api/bitquery", {
        query: getWBNBBusdPrice,
      }),
    ]);
    const subscriptionId = subscription.extensions.subId;

    const price = bnbPrice.data?.ethereum?.dexTrades?.[0]?.quotePrice;

    const convertPriceToBUSD = (wbnb: number) => wbnb * price;

    const socket = new SockJS("https://streaming.bitquery.io/stomp");
    const stompClient = Stomp.over(socket);

    const BitQuerySocketStomp = stompClient;

    BitQuerySocketStomp.connect({}, function onSuccess(frame) {
      BitQuerySocketStomp.subscribe(subscriptionId, (update) => {
        const data = JSON.parse(update.body).data.ethereum.dexTrades;
        for (let bar of data) {
          onRealTimeCallback({
            time: new Date(bar.block.timestamp.time).getTime(), // date string in api response
            low: convertPriceToBUSD(bar.low),
            high: convertPriceToBUSD(bar.high),
            open: convertPriceToBUSD(Number(bar.open)),
            close: convertPriceToBUSD(Number(bar.close)),
            volume: convertPriceToBUSD(bar.volume),
          });
        }
      });
    });
  },
  unsubscribeBars() {},
});

// Get date minus minutes from parameter
function getDateFromMinutes(seconds) {
  const now = new Date();
  const MS_PER_MINUTE = 60000;
  const date = new Date(now.getTime() - seconds * 60 * MS_PER_MINUTE);
  return Math.round(date.getTime() / 1000);
}
