# Italian Financial Calculators

A small, dependency-free, MIT-licensed JavaScript library implementing the most common Italian financial calculations: **mortgage amortization (piano francese)**, **personal loan**, and a simplified **IRPEF / net salary** computation.

> Maintained by the team behind [calcolatorigratis.com](https://calcolatorigratis.com), an Italian portal of free online calculators. The full-featured web versions of these calculators (with charts, edge cases, scenario comparison and locale-aware output) are available on the site.

## Why this exists

Italian financial regulation — particularly around mortgages — has a few quirks that off-the-shelf JS finance libraries (typically US-centric) handle either incorrectly or not at all:

- Mortgages use the **piano di ammortamento alla francese** with monthly compounding by convention.
- **Estinzione anticipata** ("early repayment") is regulated by Law 40/2007 (Bersani-bis): for first-home mortgages signed or refinanced after 2 February 2007, no early-repayment penalty can be charged.
- **IRPEF** uses a progressive bracket system that is updated frequently by the annual Legge di Bilancio.

This library implements those rules explicitly, with the source of each hard-coded figure stated in the code. It is intentionally minimal: 3 files, no dependencies, ~250 lines of JavaScript total. The IRPEF module is a simplified model: it does not implement detrazioni for dependants, fringe benefits, the cuneo fiscale cut or per-municipality addizionali — use the web version for those.

## Install

```bash
npm install italian-financial-calculators
```

Or just copy the `src/*.js` files into your project — they are plain ES modules with no build step.

## Usage

### Mortgage (rata mutuo)

```js
import { mortgagePayment, mortgageAmortizationSchedule } from 'italian-financial-calculators/mortgage';

const r = mortgagePayment({
  principal: 150_000,
  years: 25,
  annualRatePercent: 3.5,
});
// {
//   monthlyPayment: 750.94,
//   totalInterest: 75280.61,
//   totalRepaid: 225280.61,
// }

const schedule = mortgageAmortizationSchedule({
  principal: 150_000,
  years: 25,
  annualRatePercent: 3.5,
});
// Array of 300 rows: { month, payment, principal, interest, balance }
```

### Personal loan (prestito)

```js
import { loanPayment } from 'italian-financial-calculators/loan';

const r = loanPayment({ amount: 10_000, months: 60, annualRatePercent: 8.5 });
// { monthlyPayment: 205.17, totalInterest: 2309.92, totalRepaid: 12309.92, taeg: 8.5 }
// NB: `taeg` equals the nominal annual rate — the library models no fees or ancillary costs.
```

### IRPEF / net salary (semplificato 2026)

```js
import { irpefBrackets2026, grossToNetMonthly } from 'italian-financial-calculators/irpef';

// 2026 brackets (L. 30/12/2025 n. 199): 23% up to 28,000 € — 33% from 28,000 to 50,000 € — 43% above.

const r = grossToNetMonthly({ grossAnnual: 35000 });
// { netAnnual: 23459.27, netMonthly: 1804.56, irpef: 7688.56, inps: 3216.5, addizionali_aliquota_default: 0.02 }
// NB: addizionali regionali/comunali sono medie, vedi web app per il calcolo per comune.
```

## Full-featured web version

For each of these calculators we also publish a **complete web version** on calcolatorigratis.com with extra features that don't belong in a JS micro-library:

| Calcolatore JS                       | Versione web completa                                                                                |
|---|---|
| `mortgage.js`                        | [Calcolatore Rata Mutuo](https://calcolatorigratis.com/calcolatore-rata-mutuo/)                       |
| `mortgage.js` (early repayment)      | [Calcolatore Estinzione Anticipata Mutuo](https://calcolatorigratis.com/calcolatore-estinzione-anticipata-mutuo-prestito/) |
| `loan.js`                            | [Calcolatore Prestito Personale](https://calcolatorigratis.com/calcolatore-prestito-personale/)       |
| `irpef.js`                           | [Calcolatore Stipendio Netto 2026](https://calcolatorigratis.com/calcolatore-stipendio-netto-2026/)   |

The web versions add: amortization charts, regional/municipal IRPEF additional rates lookup, scenario comparison side-by-side, PDF export, Italian-locale number formatting.

## License

[MIT](./LICENSE) — use this freely in commercial and non-commercial projects.

## Contributing

PRs welcome, especially:
- Bracket / aliquota updates after each Legge di Bilancio
- Edge cases in the amortization math (negative-amortization corner cases, balloon payments)
- TypeScript declarations

## Sources / references

- [Law 40/2007 art. 7 (Bersani-bis)](https://www.gazzettaufficiale.it/eli/id/2007/04/02/007G0058/sg) — abolition of early-repayment penalty on first-home mortgages
- [Banca d'Italia, BSI statistics on bank interest rates](https://www.bancaditalia.it/statistiche/tematiche/moneta-intermediari-finanziari/banche-istituzioni-finanziarie-monetarie/tassi-interesse-bancari/)
- [Agenzia delle Entrate — IRPEF brackets reference](https://www.agenziaentrate.gov.it/portale/web/guest/schede/regimifiscali/irpef-imposta-sul-reddito-delle-persone-fisiche)
- [Directive 2014/17/EU — Mortgage Credit Directive (MCD)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32014L0017)
