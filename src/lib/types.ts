export interface NetworkInfo {
  native_token_symbol: string;
  token_prices: Record<string, number>;
  gas_prices_gwei: Record<string, number>;
  native_token_costs: Record<string, number>;
  costs: Record<string, Record<string, number>>;
  datetime: string;
}

export type NetworkData = Record<string, NetworkInfo>;
