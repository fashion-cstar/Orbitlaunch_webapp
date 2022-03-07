import * as React from "react";

export const GlobalCurrencyContext = React.createContext({
  bnbPrice: 0,
});

export interface GlobalCurrencyState {
  bnbPrice: number;
}

export const GlobalCurrencyProvider: React.FC<GlobalCurrencyState> = ({
  children,
  bnbPrice = 0,
}) => {
  return (
    <GlobalCurrencyContext.Provider value={{ bnbPrice }}>
      {children}
    </GlobalCurrencyContext.Provider>
  );
};

export const useGlobalCurrency = () => React.useContext(GlobalCurrencyContext);
