# Vedic Astro — Project Guidelines

## LOCKED FILES — DO NOT MODIFY WITHOUT EXPLICIT USER APPROVAL

The following files contain the **validated astronomy engine** — pure-math implementations of
Meeus algorithms, cross-checked against the Swiss Ephemeris to < 1 degree accuracy.

**These files are READ-ONLY and MUST NOT be edited, rewritten, or deleted** unless the user
explicitly says something like "unlock the engine" or "I want to change the astronomy code."

If any task or refactoring would touch these files, **STOP and ask the user first**:
> "This would modify a locked astronomy engine file (`<filename>`). These files have been
> validated against the Swiss Ephemeris. Do you want me to proceed?"

### Locked files (10 files):
```
vedic-astro-next/lib/astro/julian.ts        — Julian Day conversion (Meeus Ch. 7)
vedic-astro-next/lib/astro/solar.ts         — Sun longitude (Meeus Ch. 25)
vedic-astro-next/lib/astro/lunar.ts         — Moon longitude (Meeus Ch. 47, 60 terms)
vedic-astro-next/lib/astro/planets.ts       — Mercury–Saturn (Kepler + perturbations)
vedic-astro-next/lib/astro/nodes.ts         — Mean Rahu/Ketu
vedic-astro-next/lib/astro/ayanamsa.ts      — Lahiri ayanamsa
vedic-astro-next/lib/astro/sidereal-time.ts — Greenwich/Local sidereal time
vedic-astro-next/lib/astro/ascendant.ts     — Lagna from sidereal time + latitude
vedic-astro-next/lib/astro/engine.ts        — computeChart() orchestrator
vedic-astro-next/lib/astro/index.ts         — barrel export
```

### Also locked:
```
js/astro-engine.js  — bundled IIFE of the above (regenerate with esbuild, don't hand-edit)
```

### Validation reference:
- **Chart**: Lakshmi Jagannathan, Jul 30 1979, 19:30 IST, Bangalore
- **Test**: `vedic-astro-next/lib/astro/__tests__/validate.ts` (10/10 sign match)
- **Cross-check**: `vedic-astro-next/lib/astro/__tests__/compare-sweph.ts` (max delta 0.95°)
- **Swiss Eph spike**: `spike/test-chart.mjs` (10/10 match)

### How to unlock (if needed):
```bash
# Windows
attrib -R vedic-astro-next\lib\astro\*.ts

# After editing, re-validate:
npx tsx vedic-astro-next/lib/astro/__tests__/validate.ts

# Re-bundle for legacy site:
npx esbuild vedic-astro-next/lib/astro/index.ts --bundle --outfile=js/astro-engine.js --format=iife --global-name=AstroEngine

# Re-lock:
attrib +R vedic-astro-next\lib\astro\*.ts
```

---

## Project Structure

- `vedic-astro-next/` — Next.js app (main app)
- `js/`, `*.html`, `css/` — Legacy vanilla JS site
- `spike/` — Swiss Ephemeris test harness (reference only)
- `vedic-astro-next/lib/astro/` — **LOCKED** astronomy engine (see above)
- `vedic-astro-next/lib/kundli-calc.ts` — Calculation API (calls engine, safe to edit)
- `vedic-astro-next/lib/auth.ts` — User auth + chart generation (calls engine, safe to edit)
- `vedic-astro-next/lib/city-timings.ts` — City database + timezone lookup (safe to edit)
