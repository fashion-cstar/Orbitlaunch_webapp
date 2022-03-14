export const configurationData = {
  supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
};

export const BITQUERY_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_BITQUERY_API_URL || "https://graphql.bitquery.io";
