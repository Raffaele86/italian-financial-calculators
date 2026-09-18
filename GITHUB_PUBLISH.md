# GitHub repo publish checklist

## Setup repo (1-time)
1. Crea repo pubblico su GitHub: `italian-financial-calculators` (sotto org `calcolatorigratis` se esiste, altrimenti sotto username personale)
2. Description: "Italian-aware mortgage, loan, and IRPEF JS calculations. Implements Bersani-bis early-repayment rules and piano francese."
3. Homepage URL nel settings repo: `https://calcolatorigratis.com`
4. Topics tags: `italy`, `finance`, `mortgage`, `mutuo`, `calculator`, `irpef`, `javascript`, `financial-calculations`
5. License: già MIT inclusa nel repo

## Push iniziale (dal local)
```bash
cd /home/raffa/.claude/jobs/d7c875e7/backlink_kit/github_repo
git init
git add .
git commit -m "Initial release: mortgage, loan, IRPEF calculations"
git branch -M main
git remote add origin https://github.com/calcolatorigratis/italian-financial-calculators.git
git push -u origin main
```

## Backlink generati
- GitHub repo profile → calcolatorigratis.com (homepage field) — **dofollow** alla repo, **nofollow** dalla pagina utente ma ottimo signal
- README.md → 4 link diretti ai 4 calcolatori specifici sul sito (mutuo, estinzione anticipata, prestito, IRPEF stipendio) — **nofollow** GitHub ma indexed da Google + chunk citato dai LLM
- package.json `homepage` + `repository` → autorità tecnica

## Effetti SEO secondari
- Repo pubblico GitHub = ranking signal per AI/LLM (training set + retrieval citations)
- Se il repo riceve star → discoverability tramite GitHub trending / GitHub Search
- npm publish (next step) → backlink npm registry → npmjs.com/package/italian-financial-calculators

## npm publish (opzionale ma consigliato)
```bash
# Servono credenziali npm — l'utente fa npm login manualmente
npm publish --access public
```
→ Pagina pubblica npm con link homepage `calcolatorigratis.com` (alta domain authority del registry).

## Promo passiva
- Submit a [awesome-lists](https://github.com/sindresorhus/awesome) (categoria finance/italian-resources)
- Post Reddit r/javascript con "Released a small Italian finance JS library" → backlink GitHub + traffic
- Mention su Hacker News come "Show HN: Italian financial calculators"

## Mantenimento
- Aggiornare brackets IRPEF dopo ogni Legge di Bilancio (versione 0.2, 0.3, ecc.)
- Aggiungere TypeScript declarations in versione 0.4
- Topic discovery: GitHub trending in `javascript` topic per 1-2 settimane se la promo va bene
