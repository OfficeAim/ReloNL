# WWSO Calculator — Reference Specification (2025)

## Source
Based on the Dutch **Woningwaarderingsstelsel** (WWS) under the **Wet betaalbare huur** that took effect **January 1, 2025**.

For legal cases, always reference the official Huurcommissie tool:
https://www.huurcommissie.nl/huurcommissie-helpt/uw-huurprijs-berekenen

---

## Point Categories (Implemented in ReloNL)

| Category | Max Points | Implementation Notes |
|---|---|---|
| Surface area (m²) | up to 200 | 1 point per m² (actual WWS uses 1-2 pts/m² depending on room type — simplified here) |
| Energy label | 2-44 | A++++ (44) down to G (2) — matches 2025 official table |
| Construction year | 12-40 | Pre-1945 = 12, 1945-1974 = 16, 1975-1999 = 22, 2000-2014 = 30, 2015+ = 40 |
| WOZ value | 0-60 | 1 pt per €10,000 WOZ value (capped at 60) |
| Neighborhood | 8-18 | Urban=18, Suburban=12, Rural=8 (simplified) |
| Kitchen | 0-10 | Basic=0, Standard=6, Premium=10 |
| Bathroom | 0-10 | Basic=0, Standard=6, Premium=10 |
| Outdoor space | 0-50 | 2 pts per m², capped at 50 (25 m² effective) |
| Parking | 0-8 | None=0, Shared=4, Private=8 |

## Maximum Rent Calculation

```javascript
maxRent = 300 + (totalPoints × 7.5)
if (maxRent > 2000) maxRent = 2000  // sanity cap
```

The 2025 official table uses a graduated curve:
- First 143 points: ~€900.07 baseline
- Points 144-250: ~€7.50 per additional point
- Above 250: lower increment

**Liberalisatiegrens (liberalization threshold): 143 points.**
Below 143 → regulated social housing (cannot exceed calculated max).
Above 143 → free market (any rent allowed).

## Compliance Status

| Points | Status | Meaning |
|---|---|---|
| ≥ 143 | 🟢 Compliant | Property is at or above liberalization threshold |
| 110-142 | 🟡 Borderline | Below threshold — rent must respect max-rent cap |
| < 110 | 🔴 Below threshold | Likely indicates input error or substandard property |

---

## Known Limitations of the ReloNL Calculator

1. **Simplified WOZ formula.** Real WWS uses a percentage of WOZ relative to a national average; we use a flat 1pt/€10k.
2. **No room-type breakdown.** Real WWS differentiates kitchen, bathroom, bedroom, storage. We aggregate.
3. **No "bijzondere voorzieningen"** (special features like fireplace, lift, view).
4. **Cap on rent at €2000.** Real WWS has no cap but uses graduated curve above 250 points.

These are deliberate trade-offs to keep the calculator instant and approachable. For legal disputes, route users to Huurcommissie.

---

## Why This Matters (Marketing Copy)

> Since January 2025, landlords MUST provide a WWSO score with every new rental contract. Mistakes cost up to €100,000 in fines. Calculate yours in 60 seconds — free. Export as PDF for municipal submission.

The calculator doubles as:
- A **lead-gen tool** for landlord customers (B2B revenue)
- A **trust signal** for student tenants (they see landlords take WWSO seriously)
- A **shareable artifact** (PDF download spreads awareness)