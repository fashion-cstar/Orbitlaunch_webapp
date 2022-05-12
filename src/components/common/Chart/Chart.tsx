import useMedia from "@app/lib/hooks/useMedia";
import { useEffect, useRef } from "react";
import { getTimeZone } from "@app/shared/helpers/time";
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  Timezone,
  widget,
} from "../../../../public/static/charting_library/charting_library";
import config from "./config";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * Import using this method for client side rendering
 * 
	import dynamic from "next/dynamic";

	const TVChartContainer = dynamic(
		() =>
			import("components/TVChartContainer/TVChartContainer"),
		{ ssr: false }
	);
 */

export default function Chart(props) {
  const tvWidget = useRef<IChartingLibraryWidget>();

  const { address, symbol, bnbPrice } = props;
  const { matchesDesktop } = useMedia();

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: `${symbol}/BNB`,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: config(address, bnbPrice),
      interval: props.interval,
      container_id: props.containerId,
      library_path: props.libraryPath,
      theme: "Dark",
      custom_css_url: "/static/styles/charting.css",
      loading_screen: { backgroundColor: "#001926" },
      locale: (getLanguageFromURL() || "en") as LanguageCode,
      disabled_features: [
        "symbol_search_hot_key",
        "header_symbol_search",
        "display_market_status",
        "header_compare",
        "header_saveload",
      ],
      enabled_features: ["hide_left_toolbar_by_default"],
      charts_storage_url: props.chartsStorageUrl,
      charts_storage_api_version: props.chartsStorageApiVersion,
      client_id: props.clientId,
      user_id: props.userId,
      fullscreen: false,
      autosize: true,
      studies_overrides: props.studiesOverrides,
      timezone: getTimeZone() as Timezone,
      height: 520,
      container: "tv_chart_container",
    };

    const _tvWidget = new widget(
      widgetOptions as unknown as ChartingLibraryWidgetOptions
    );

    _tvWidget.onChartReady(() => {
      _tvWidget.applyOverrides({
        "paneProperties.backgroundGradientStartColor": "#001926",
        "paneProperties.backgroundGradientEndColor": "#001926",
      });
    });
    tvWidget.current = _tvWidget;
    return () => {
      if (tvWidget.current) {
        tvWidget.current?.remove();
        tvWidget.current = null;
      }
    };
  }, [address, symbol, bnbPrice]);

  return <div className="h-[520px] overflow-hidden" id={props.containerId} />;
}

Chart.defaultProps = {
  symbol: "Orbit/BUSD",
  interval: "15",
  containerId: "tv_chart_container",
  datafeedUrl: "https://demo-feed-data.tradingview.com",
  libraryPath: "/static/charting_library/",
  chartsStorageUrl: "https://saveload.tradingview.com",
  chartsStorageApiVersion: "1.2",
  clientId: "tradingview.com",
  fullscreen: true,
  studiesOverrides: {},
  address: "0x102b901c69581bafe7d9a959bc5b9777c7a037c3",
};
