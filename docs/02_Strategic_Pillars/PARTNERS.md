# Partners & Affiliate Tracker

## Active Affiliate

### mgmco.nl — Dutch Phone Line Setup
- **URL:** https://mgmco.nl/jagohu
- **Placements in MVP (3 required):**
  1. BSN section card (hero placement)
  2. Essential Services card (Financial Setup section)
  3. Footer "Recommended Partners" column
- **Badge:** `.partner-badge` (amber pill with "Partner" label)
- **Status:** Live, tracking via URL params on conversion side
- **Estimated revenue share:** TBD (rev-share model)

---

## Pilot University Targets (B2B)

| University | City | Status | Contact | Notes |
|---|---|---|---|---|
| TU Eindhoven | Eindhoven | Lead | International Office | Highest growth city (+13.4%) |
| TU Delft | Delft | Lead | Housing Office | Niche but premium |
| University of Groningen | Groningen | Lead | RUG International | Lowest scam rate, large intl cohort |
| University of Amsterdam | Amsterdam | Cold | UvA Housing | Biggest market, harder to access |
| Erasmus Rotterdam | Rotterdam | Cold | Erasmus Housing | Growing, open to partnerships |
| Utrecht University | Utrecht | Cold | UU Housing | Very tight market |

### B2B Pitch (used in Pillar 3)

> Solve your international student housing complaints — for free.
>
> - White-Label Module — embed housing guide in acceptance emails with university colors
> - Reduce Kamernood Complaints — we handle pre-arrival bureaucracy
> - Zero Cost Integration — free API or iframe embed for student portals

### Conversion Funnel (planned)

```
Impression → Demo page → Inquiry form → 24h callback → 
White-label config → Pilot launch (1 cohort) → Annual contract
```

---

## Premium Accommodation Partners (Tier 2)

| Partner | Type | Cities | Status |
|---|---|---|---|
| The Social Hub | Hybrid hotel/student | Eindhoven, Groningen | Listed in UI |
| Studio Plus | Furnished studios | Utrecht | Listed in UI |
| Swapfiets | Bike subscription | All | Listed in UI |
| Holland2Stay | Student housing | Rotterdam, Delft | Listed in UI |
| Common | Coliving | Amsterdam | Listed in UI |

Each card has a "Contact via ReloNL" button → opens modal → logs inquiry to LocalStorage.

---

## Future Integrations (Not Yet Active)

- **Kamernet API** — would need partnership agreement
- **Pararius API** — public scraping possible, API on request
- **HousingAnywhere partner program** — invite-only, no traction yet
- **Revolut Business** — for receiving B2B subscription revenue
- **Trade Republic Business** — backup

---

## Compliance Notes

- **No student-facing fees.** All monetization is B2B. This is non-negotiable per the platform's positioning vs. failed competitors (Studently.nl).
- **Affiliate disclosure.** The "Partner" badge + honest placement language satisfies EU consumer disclosure rules (Unfair Commercial Practices Directive).
- **GDPR.** LocalStorage is client-side. When backend is added, Supabase is GDPR-compliant out of the box (DPA available on request).