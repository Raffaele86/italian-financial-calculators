// Italian IRPEF brackets — 2026 (art. 11 TUIR as amended by Legge di Bilancio 2026, L. 30/12/2025 n. 199:
// second bracket cut from 35% to 33%). The 33% rate is capped: taxpayers with total income above
// 200,000 EUR do not benefit from it. Verify against the latest Legge di Bilancio before production use.
// Brackets are simplified: no fringe benefits, no detrazioni for family members, no addizionali regionali.

export const irpefBrackets2026 = [
  { upTo: 28000, rate: 0.23 },
  { upTo: 50000, rate: 0.33 },
  { upTo: Infinity, rate: 0.43 },
];

// INPS contribution for standard employee (lavoratore dipendente) — ~9.19% portion borne by employee.
const INPS_EMPLOYEE_RATE = 0.0919;

// Default addizionali aliquota — average. For exact regional+municipal lookup use the web version.
const ADDIZIONALI_AVERAGE = 0.020; // ~2% combined

/**
 * Gross → Net monthly salary, simplified.
 * @param {{grossAnnual:number}} args
 */
export function grossToNetMonthly({ grossAnnual }) {
  if (grossAnnual <= 0) {
    throw new RangeError('grossAnnual must be positive');
  }
  const inps = grossAnnual * INPS_EMPLOYEE_RATE;
  const taxableIncome = grossAnnual - inps;
  const irpef = irpefOnIncome(taxableIncome);
  const addizionali = taxableIncome * ADDIZIONALI_AVERAGE;
  const netAnnual = grossAnnual - inps - irpef - addizionali;
  return {
    netAnnual: round2(netAnnual),
    netMonthly: round2(netAnnual / 13), // tredicesima included
    irpef: round2(irpef),
    inps: round2(inps),
    addizionali_aliquota_default: ADDIZIONALI_AVERAGE,
  };
}

/**
 * Returns IRPEF on a given taxable income, using progressive brackets.
 */
export function irpefOnIncome(taxableIncome) {
  let tax = 0;
  let last = 0;
  for (const b of irpefBrackets2026) {
    if (taxableIncome <= b.upTo) {
      tax += (taxableIncome - last) * b.rate;
      return round2(tax);
    } else {
      tax += (b.upTo - last) * b.rate;
      last = b.upTo;
    }
  }
  return round2(tax);
}

function round2(x) {
  return Math.round(x * 100) / 100;
}
