import { RESOLUTION_TO_INTERVAL } from "@app/shared/AppConstant";
import axios from "axios";
import {
  DatafeedConfiguration,
  IBasicDataFeed,
  LibrarySymbolInfo,
} from "../../../public/static/charting_library/charting_library";
import { configurationData } from "./bitquery";

export default (baseCurrency: string = "BNB"): IBasicDataFeed => ({
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
  async getBars(symbolInfo, resolution, periodParams, onResult, onError) {
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

      if (bars.length) {
        onResult(bars, { noData: false });
      } else {
        onResult(bars, { noData: true });
      }
    } catch (error) {
      onError(error);
    }
  },
  searchSymbols() {},
  async subscribeBars(
    symbolInfo,
    resolution,
    onRealTimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) {
    try {
      const {
        data: { data: bars },
      } = await axios.post("/api/bars", {
        baseCurrency,
        resolution,
        symbolInfo,
        from: Math.round(
          new Date().setMinutes(
            new Date().getMinutes() - RESOLUTION_TO_INTERVAL[resolution] / 60
          ) / 1000
        ),
        to: Math.round(new Date().getTime() / 1000),
        countBack: 1,
        firstDataRequest: false,
      });

      const bar = bars?.[0];
      if (bars.length) {
        onRealTimeCallback(bar);
      }
    } catch (error) {
      onResetCacheNeededCallback();
    }
  },
  unsubscribeBars() {},
});
