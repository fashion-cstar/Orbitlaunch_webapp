export const formatToUSD = (value: string) => {
  const dollarUs = Intl.NumberFormat("en-US");
  return dollarUs.format(Number(value));
};

export function getPercentageChange(newPrice: number, oldPrice: number) {
  var decreaseValue = newPrice - oldPrice;

  return (decreaseValue / newPrice) * 100;
}
