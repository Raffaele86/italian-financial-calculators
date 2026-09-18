// Italian mortgage calculations — piano francese (French amortization).
// All amounts in EUR, all rates as percentage points (e.g. 3.5 = 3.5% annual).

/**
 * Monthly mortgage payment using the standard piano francese formula.
 * @param {{principal:number, years:number, annualRatePercent:number}} args
 * @returns {{monthlyPayment:number, totalInterest:number, totalRepaid:number}}
 */
export function mortgagePayment({ principal, years, annualRatePercent }) {
  if (principal <= 0 || years <= 0 || annualRatePercent < 0) {
    throw new RangeError('principal, years and annualRatePercent must be non-negative');
  }
  const n = years * 12;
  const r = annualRatePercent / 100 / 12;
  let monthlyPayment;
  if (r === 0) {
    monthlyPayment = principal / n;
  } else {
    monthlyPayment = (principal * r) / (1 - Math.pow(1 + r, -n));
  }
  const totalRepaid = monthlyPayment * n;
  return {
    monthlyPayment: round2(monthlyPayment),
    totalInterest: round2(totalRepaid - principal),
    totalRepaid: round2(totalRepaid),
  };
}

/**
 * Full month-by-month amortization schedule.
 */
export function mortgageAmortizationSchedule({ principal, years, annualRatePercent }) {
  const { monthlyPayment } = mortgagePayment({ principal, years, annualRatePercent });
  const r = annualRatePercent / 100 / 12;
  const n = years * 12;
  const rows = [];
  let balance = principal;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    const principalPaid = monthlyPayment - interest;
    balance -= principalPaid;
    rows.push({
      month: m,
      payment: round2(monthlyPayment),
      principal: round2(principalPaid),
      interest: round2(interest),
      balance: round2(Math.max(0, balance)),
    });
  }
  return rows;
}

/**
 * Early repayment savings (riduzione durata strategy, more efficient than riduzione rata).
 * Returns interest savings vs. continuing the original plan unchanged.
 */
export function earlyRepaymentSavings({ principal, years, annualRatePercent, extraPaymentAt, extraPaymentAmount }) {
  const base = mortgageAmortizationSchedule({ principal, years, annualRatePercent });
  const baseTotalInterest = base.reduce((s, row) => s + row.interest, 0);
  // Recompute with extra payment at month `extraPaymentAt`
  const r = annualRatePercent / 100 / 12;
  const n = years * 12;
  const monthlyPayment = base[0].payment;
  let balance = principal;
  let totalInterest = 0;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    totalInterest += interest;
    let principalPaid = monthlyPayment - interest;
    balance -= principalPaid;
    if (m === extraPaymentAt) {
      balance = Math.max(0, balance - extraPaymentAmount);
    }
    if (balance <= 0) {
      break;
    }
  }
  return {
    baseTotalInterest: round2(baseTotalInterest),
    newTotalInterest: round2(totalInterest),
    savings: round2(baseTotalInterest - totalInterest),
  };
}

function round2(x) {
  return Math.round(x * 100) / 100;
}
