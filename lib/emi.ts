export function calculateEmi(
  principal: number,
  annualRate: number,
  tenureMonths: number,
) {
  if (annualRate === 0) {
    return Math.round(principal / tenureMonths);
  }

  const monthlyRate = annualRate / 12 / 100;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}