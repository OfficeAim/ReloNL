# ReloNL — Project Constitution

## Identity
**ReloNL** is a B2B-funded student relocation portal for the Netherlands. Free for students, monetized via university and property manager subscriptions. Never charges students intermediary fees.

**Live demo:** https://relo2nl.netlify.app

## Architecture
- **Current:** Single-file `index.html` (88 KB) — Tailwind CSS CDN + Vanilla JS ES6+ + Chart.js + jsPDF + LocalStorage
- **Phase 2:** Supabase backend (PostgreSQL + Edge Functions) + Google Auth (Gems system)
- **Deployment:** Netlify Drop (zero config)

## Coding Standards
- All code in English (comments, variable names, functions)
- LocalStorage: always use namespace `relonl_` prefix via `lsGet()`/`lsSet()` helpers
- No native `alert()` — use `showModal(title, body)` exclusively
- Chart.js: always destroy instance before re-creating to avoid canvas reuse errors
- Try/catch on all LocalStorage operations

## File Structure
```
Relonl/
├── index.html                          ← Main app (minimax base)
├── index minimax.html                  ← Original minimax (do not delete)
├── .agents/
│   ├── rules/project-constitution.md  ← This file
│   └── PROJECT_JOURNAL.md             ← Session journal
├── docs/
│   ├── 01_Architecture/
│   ├── 02_Strategic_Pillars/
│   ├── 03_Procedures_Workflows/
│   ├── 04_Student_Guides/
│   ├── 05_Deployment/
│   └── .archive/
├── supabase/
│   ├── schema.sql
│   └── functions/
└── relonl-bundle/                      ← Original build artifacts
```

## Strategic Pillars (in order)
1. Pre-Arrival Solvency Dossier (students)
2. Token-Based Affiliate & Rewards (students)
3. University White-Label Integration (B2B)
4. Landlord Acquisition Portal + WWSO Calculator (B2B)

## Key Integrations
- **Affiliate link:** `https://mgmco.nl/jagohu` — must appear in exactly 3 locations with `.partner-badge`
- **SEPA QR:** Beneficiary=Rody, IBAN=NL86TRBK4422614611, Amount=€3.59
- **Google Auth (Phase 2):** GSI for Gems system
- **Supabase (Phase 2):** logs + gem_accounts + gem_transactions

## Gems System (Phase 2)
AI-powered features via OfficeAIM × Google Gemini partnership.
Each user gets 3 free Gems on registration. Usage costs 1 Gem per query.
Features: Contract Analyzer, BSN Navigator, Letter Generator (AI), Legal Coach (AI).

## Do NOT
- Add student-facing fees of any kind
- Use `alert()` anywhere
- Make direct API calls without CORS consideration
- Break the 3 affiliate link placements
- Delete `index minimax.html` (source of truth)
