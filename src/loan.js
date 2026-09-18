// Italian consumer loan (prestito personale) calculations.
// Same piano-francese math as mortgage but with shorter durations and personal-loan typical rates.

/**
 * @param {{amount:number, months:number, annualRatePercent:number}} args
 */
export function loanPayment({ amount, months, annualRatePercent }) {
  if (amount <= 0 || months <= 0 || annualRatePercent < 0) {
    throw new RangeError('amount, months and annualRatePercent must be non-negative');
  }
  const r = annualRatePercent / 100 / 12;
  let monthlyPayment;
  if (r === 0) {
    monthlyPayment = amount / months;
  } else {
    monthlyPayment = (amount * r) / (1 - Math.pow(1 + r, -months));
  }
  const totalRepaid = monthlyPayment * months;
  const totalInterest = totalRepaid - amount;
  // TAEG approximation excluding fees: equal to TAN in absence of mandatory ancillary costs.
  const taeg = annualRatePercent;
  return {
    monthlyPayment: round2(monthlyPayment),
    totalInterest: round2(totalInterest),
    totalRepaid: round2(totalRepaid),
    taeg: round2(taeg),
  };
}

function round2(x) {
  return Math.round(x * 100) / 100;
}
