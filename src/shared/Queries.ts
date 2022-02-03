import { BNB_TOKEN_ADDRESS, NETWORK_BSC } from "./AppConstant";

export const queryGetSymbols = (baseCurrency: string, network?: string) => `
{
  ethereum(network: ${network || NETWORK_BSC}) {
    dexTrades(
      options: {desc: ["block.height", "transaction.index"], limit: 1}
      exchangeName: {in: ["Pancake", "Pancake v2", "Uniswap"]}
      baseCurrency: {is: "${baseCurrency}"}
      quoteCurrency: {is: "${BNB_TOKEN_ADDRESS}"}
    ) 
    {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S") 
        }
      }
      transaction {
        index
      }
      baseCurrency {
        name
        symbol
        decimals
      }
      quotePrice
    }
  }
}
`;

export const queryGetBars = `
query getBars(
	$from: ISO8601DateTime!
	$to: ISO8601DateTime!
	$limit: Int!
	$quoteCurrency: String!
	$baseCurrency: String!
  $network: EthereumNetwork!
	$interval: Int!
) {
  ethereum(network: $network) {
    dexTrades(
      options: {limit: $limit, asc: "timeInterval.minute"}
      date: {since: $from, till: $to}
			exchangeName: { in: ["Pancake", "Pancake v2", "Uniswap"] }
      baseCurrency: {is: $baseCurrency}
      quoteCurrency: {is: $quoteCurrency}
    ) {
      timeInterval {
        minute(count: $interval, format: "%Y-%m-%dT%H:%M:%SZ")
      }
      baseCurrency {
        symbol
        address
      }
      baseAmount
      quoteCurrency {
        symbol
        address
      }
      volume: quoteAmount
      trades: count
      quotePrice
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price)
    }
  }
}

`;

export const queryGetBUSDPriceOf = `
  query BUSDPriceOf($baseCurrency: String!, $from: ISO8601DateTime) {
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 24, asc: "timeInterval.minute"}
        date: {since: $from}
        exchangeName: {in: ["Pancake", "Pancake v2", "Uniswap"]}
        baseCurrency: {is: $baseCurrency}
        quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
      ) {
        timeInterval {
          minute(count: 60)
        }
        time: date {
          date
        }
        quoteCurrency {
          symbol
        }
        baseCurrency {
          symbol
        }
        value: quotePrice
      }
    }
  }
`;

export const queryGetBNBPriceOf = `
  query BNBPriceOf($baseCurrency: String!, $from: ISO8601DateTime) {
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 48, asc: "timeInterval.minute"}
        date: {since: $from}
        exchangeName: {in: ["Pancake", "Pancake v2", "Uniswap"]}
        baseCurrency: {is: $baseCurrency}
        quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
      ) {
        timeInterval {
          minute(count: 60)
        }
        time: date {
          date
        }
        quoteCurrency {
          symbol
        }
        baseCurrency {
          symbol
        }
        value: quotePrice
      }
    }
  }
`;

export const queryPriceInBNB = `
  query getPriceInBNB($baseCurrency: String!, $from: ISO8601DateTime) {
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 1, desc: "timeInterval.minute"}
        date: {since: $from}
        exchangeName: {in: ["Pancake", "Pancake v2", "Uniswap"]}
        baseCurrency: {is: $baseCurrency}
        quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
      ) {
        timeInterval {
          minute(count: 60)
        }
        value: quotePrice
      }
    }
  }
`;

export const queryPriceInBUSD = `
  query getPriceInBUSD($baseCurrency: String!, $from: ISO8601DateTime) {
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 1, desc: "timeInterval.minute"}
        date: {since: $from}
        exchangeName: {in: ["Pancake", "Pancake v2", "Uniswap"]}
        baseCurrency: {is: $baseCurrency}
        quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
      ) {
        timeInterval {
          minute(count: 60)
        }
        value: quotePrice
      }
    }
  }
`;

export const queryWalletBalances = `
query getBalancesByAddress($address: String!) {
  ethereum(network: bsc) {
    address(address: {is: $address}) {
      balances {
        currency {
          symbol
          name
          address
          decimals
        }
        value
      }
    }
  }
}
`;
