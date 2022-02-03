import { useEffect, useRef, PureComponent } from "react";
import styles from './index.module.css';
import { widget } from '../../../public/static/charting_library';
import config from './config';
import { getTimeZone } from '@app/shared/helpers/time';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
/**
 * Importing using this method for client side rendering
 * 
	import dynamic from "next/dynamic";

	const TVChartContainer = dynamic(
		() =>
			import("components/TVChartContainer/TVChartContainer").then(
				(mod) => mod.TVChartContainer
			),
		{ ssr: false }
	);
 */
export class TVChartContainer extends PureComponent {
	static defaultProps = {
		symbol: 'M31/BNB',
		interval: '15',
		containerId: 'tv_chart_container',
		datafeedUrl: 'https://demo-feed-data.tradingview.com',
		libraryPath: '/static/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.2',
		clientId: 'tradingview.com',
		fullscreen: false,
		studiesOverrides: {},
	};

	tvWidget = null;

	componentDidMount() {
		const widgetOptions = {
			symbol: "M31/BNB",
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: config("0xb46acb1f8d0ff6369c2f00146897aea1dfcf2414"),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			theme: 'Dark',
			locale: getLanguageFromURL() || 'en',
			disabled_features: ["symbol_search_hot_key", "header_symbol_search", "display_market_status", "header_compare", "header_saveload"],
			enabled_features: ["hide_left_toolbar_by_default"],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			timezone: getTimeZone(),
			drawing_access: {},
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		// tvWidget.onChartReady(() => {
		// 	tvWidget.headerReady().then(() => {
		// 		const button = tvWidget.createButton();
		// 		button.setAttribute('title', 'Click to show a notification popup');
		// 		button.classList.add('apply-common-tooltip');
		// 		button.addEventListener('click', () => tvWidget.showNoticeDialog({
		// 			title: 'Notification',
		// 			body: 'TradingView Charting Library API works correctly',
		// 			callback: () => {
		// 				console.log('Noticed!');
		// 			},
		// 		}));

		// 		button.innerHTML = 'Reset';
		// 	});
		// });
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div className="flex-1">
				<div
					id={this.props.containerId}
					className={"h-full w-full block"}
				/>
			</div>
		);
	}
}
