# Vedic Astrology Application Development Guide

A comprehensive technical reference for building Vedic astrology applications, covering classical texts, open-source libraries, architecture patterns, and commercial considerations.

*Compiled: January 2026*

---

## Executive Summary

Building a comprehensive Vedic astrology chart reading application requires three core pillars:

1. **Authoritative Classical Texts** - For interpretation logic
2. **Swiss Ephemeris Calculation Engine** - For astronomical precision
3. **Cross-Platform Architecture** - Built around rule-based interpretation systems

### Market Opportunity
- Global astrology app market: **$4 billion** (current)
- Projected by 2033: **$30 billion**
- Example: Astrotalk achieved ₹659 crore revenue in FY24 (132% YoY growth)

### Key Technical Requirements
| Component | Cost | Notes |
|-----------|------|-------|
| Swiss Ephemeris License | CHF 750 (~$850 USD) | For closed-source commercial apps |
| Primary Libraries | Free | PyJHora (Python) or sweph (Node.js) |
| Recommended Framework | Free | Flutter for cross-platform mobile/desktop |

---

## Understanding Vedic Astrology Fundamentals

Vedic astrology, or **Jyotish** (translates to "science of light"), views celestial bodies as influencers of human destiny. Core elements include:

- **12 Houses (Bhavas)** - Life areas
- **9 Planets (Navagrahas)** - Celestial influences
- **27 Lunar Mansions (Nakshatras)** - Moon positions
- **Timing Systems** - Vimshottari Dasha and others

Chart reading involves analyzing the **Lagna (ascendant)**, planetary placements, aspects (drishti), and combinations (yogas) to predict life events in career, relationships, health, and spirituality.

**Important Note:** Interpretations can vary by school (e.g., Parashari vs. Jaimini), so cross-referencing sources is key. For app building, this knowledge informs features like automated yoga detection or personalized reports.

---

## Part 1: Classical Vedic Astrology Texts

The classical texts form the foundation for all interpretation logic. These Sanskrit treatises provide systematic rules that translate to programmable conditions.

### 1.1 Primary Source: Brihat Parashara Hora Shastra (BPHS)

The foundational source for virtually all Parashari Vedic astrology, containing 97 chapters of systematic rules for yogas, dashas, and divisional charts.

**Recommended Translations:**
- **R. Santhanam's Two-Volume Edition** (Ranjan Publications, 1984) - Most comprehensive, essential for programming
- **Girish Chand Sharma Translation** (Sagar Publications, 1994) - Superior philosophical rendering

*Recommendation: Acquire both translations for cross-referencing interpretation ambiguities.*

### 1.2 Essential Classical Library

| Text | Author/Translator | Publisher | Programming Value |
|------|-------------------|-----------|-------------------|
| **Brihat Parashara Hora Shastra** | R. Santhanam | Ranjan Publications | Primary source for dashas, yogas, divisional charts |
| **Phaladeepika** | S.S. Sareen | Sagar Publications | Exceptionally clear on transits and yogas |
| **Brihat Jataka** | B. Suryanarain Rao | Motilal Banarsidass (ISBN: 8120813952) | Core planetary significations |
| **Jataka Parijata** | V. Subramanya Sastri | Ranjan (ISBN: 8189230642) | 3 volumes on yogas, dashas, ashtakavarga |
| **Saravali** | R. Santhanam | Ranjan (ISBN: 9788188230457) | Strong on planetary conjunctions and Raja Yogas |
| **Jaimini Sutras** | Sanjay Rath | Sagar (ISBN: 8170822491) | Chara Karakas and Arudha systems |
| **Uttara Kalamrita** | P.S. Sastri | Ranjan (ISBN: 8188230405) | 85+ example charts, practical focus |

### Texts to Avoid
- **G.S. Kapoor's Phaladeepika** - Known for errors and mistranslations
- **Usha/Shashi Brihat Jataka** - Pirated repackaging with quality issues

---

## Part 2: Modern Interpretive Authors

Modern authors provide practical interpretation frameworks that translate more directly to code.

### 2.1 Most Programmable Reference

**Three Hundred Important Combinations** by B.V. Raman (Motilal Banarsidass, ISBN: 8120808509)

The single most programmable yoga reference available. Each of 300+ combinations includes:
- Clear definition conditions (planets, houses, aspects)
- Result descriptions
- Practical application notes

**Example Rule Structure:**
```
Yoga: Gaja Kesari
Condition: Jupiter in kendra from Moon
Result: Fame, leadership, long-lasting reputation

Code Translation:
if jupiter_in_kendra_from_moon():
    apply_yoga('gaja_kesari')
```

### 2.2 By Application Area

#### For Yoga Detection Algorithms
| Book | Author | Programming Application |
|------|--------|------------------------|
| Three Hundred Important Combinations | B.V. Raman | Direct rule definitions for 300+ yogas |
| Yogas in Astrology | Dr. K.S. Charak | Methodology templates (ISBN: 9788190100847) |

#### For Dasha Interpretation Engines
| Book | Author | Programming Application |
|------|--------|------------------------|
| Vedic Astrology: An Integrated Approach | P.V.R. Narasimha Rao | 10 dasha systems by JHora creator |
| Laghu Parashari | Dr. K.S. Charak | Classical Vimshottari rules in modern format |
| Narayana Dasa | Sanjay Rath | Complete rashi dasha system (ISBN: 9788170822462) |
| Predicting through Jaimini's Chara Dasha | K.N. Rao | Alternative timing system |

#### For House-by-House Interpretation
| Book | Author | Programming Application |
|------|--------|------------------------|
| How to Judge a Horoscope (Vols 1 & 2) | B.V. Raman | Systematic house analysis framework |
| Light on Life | Hart de Fouw & Robert Svoboda | Comprehensive signification tables |

### 2.3 K.N. Rao's PACDARES Methodology

A structured analysis approach ideal for programming:

| Letter | Meaning | Description |
|--------|---------|-------------|
| **P** | Position | House placement |
| **A** | Aspects | Planetary influences |
| **C** | Conjunctions | Planetary combinations |
| **D** | Dasha | Timing periods |
| **A** | Ashtakavarga | Strength analysis |
| **R** | Raja Yogas | Success combinations |
| **E** | Exchange | Parivartana yogas |
| **S** | Strength | Shadbala, dignity |

### 2.4 Structured Reading Path (Beginner to Advanced)

To master chart reading, curate a library spanning classics and modern interpretations. Read in sequence: beginners for basics, intermediates for techniques, and advanced for nuances.

#### Beginner Level
| Title | Author | Key Focus | Why Recommended |
|-------|--------|-----------|-----------------|
| **Astrology for Beginners** | B.V. Raman | Planets, signs, houses, basic horoscope analysis | Clear, foundational explanations; builds confidence in reading simple charts |
| **The Essentials of Vedic Astrology** | Komilla Sutton | Birth chart interpretation, planetary significations | Beginner-friendly with practical examples; ideal for Lagna and Nakshatras |
| **Light on Life** | Hart de Fouw & Robert Svoboda | Planetary energies, aspects, real-life chart examples | Blends storytelling with teachings; accessible for transitioning from theory to practice |
| **Learn Astrology Step by Step** | Dr. K.S. Charak | Structured chart basics, daily applications | Step-by-step guidance with diagrams |

#### Intermediate Level
| Title | Author | Key Focus | Why Recommended |
|-------|--------|-----------|-----------------|
| **Predictive Astrology of the Hindus** | Pandit Gopesh Kumar Ojha | Timing events, planetary transits, yogas | Focuses on forecasting; valuable for event prediction features |
| **Practical Vedic Astrology** | G.S. Agarwal | Planetary behaviors, karma patterns, divisional charts | Practical tools for analyzing complex charts |
| **Nakshatra Exploration** | P.V.R. Narasimha Rao | Lunar mansions in personality and patterns | Deepens insights into subtle chart elements |
| **Beneath a Vedic Sky** | William Levacy | Intuitive chart interpretation | Good for transitional learning |

#### Advanced Level
| Title | Author | Key Focus | Why Recommended |
|-------|--------|-----------|-----------------|
| **Brihat Parashara Hora Shastra** | Maharishi Parashara | Karmic patterns, dashas, life predictions | Foundational text; essential for authentic calculations and yogas |
| **Brihat Jataka** | Varahamihira | Planetary results, combinations | Details influences for comprehensive analysis |
| **Phaladeepika** | Mantreswara | Planetary combinations, results | Practical interpretations; aids in coding rule-based predictions |
| **Jaimini Sutras** | Maharishi Jaimini (B.V. Raman commentary) | Advanced yogas, chart anomalies | Professional-level techniques |
| **Astrology of the Seers** | David Frawley | Spiritual and philosophical aspects | Explores consciousness-celestial links |
| **Elements of Vedic Astrology** (2 vols) | Dr. K.S. Charak | Detailed yogas | Comprehensive yoga reference |
| **The Nakshatras: The Stars Beyond the Zodiac** | Komilla Sutton | Lunar mansion influences | Deep dive into Nakshatra effects |
| **A Thousand Suns** | Linda Johnsen | Vedic roots and spirituality | Explores cultural and spiritual context |

**Where to Find:** Amazon, Exotic India Art, Archive.org (some PDFs), Sagar Publications

---

## Part 3: Technical Resources & Libraries

### 3.1 Swiss Ephemeris - The Core Engine

**Website:** astro.com/swisseph

The industry-standard astronomical calculation engine based on NASA JPL DE431 data.

**Key Features:**
- 40+ ayanamsas supported (Lahiri, Krishnamurti, Raman, True Chitrapaksha, etc.)
- 0.001 degree precision (sub-arcsecond)
- Date range: 13,000 BCE to 17,000 CE
- C library with bindings for Python, JavaScript, Java

#### Licensing (Critical for Commercial Applications)

| License Type | Cost | Requirements |
|--------------|------|--------------|
| AGPL (Free) | $0 | Must release entire application as open source |
| Professional | CHF 750 (~$850) | Closed-source commercial software, 99-year perpetual |
| Unlimited | CHF 1,550 | Multiple products, same terms as professional |

### 3.2 Python Libraries (Recommended for Backend)

| Library | GitHub URL | License | Key Features |
|---------|------------|---------|--------------|
| **pyswisseph** | github.com/astrorigin/pyswisseph | AGPL-3.0 | Official Swiss Ephemeris Python binding |
| **PyJHora** | github.com/naturalstupid/PyJHora | Open Source | Most comprehensive: 6,300+ tests, 40+ dasha types |
| **jyotishganit** | github.com/northtara/jyotishganit | MIT | D1-D60 vargas, Shadbala, Panchanga |
| **VedAstro.Python** | github.com/VedAstro/VedAstro.Python | MIT | Cross-platform with C# core |
| **VedicAstro** | github.com/diliprk/VedicAstro | Open Source | Krishnamurti Paddhati (KP) focus |
| **jyotishyamitra** | PyPI | Open Source | Indian Vedic computations |

#### PyJHora Deep Dive

Reference implementation mirroring P.V.R. Narasimha Rao's JHora software:

```
panchanga/drik.py     — Panchanga calculations
horoscope/chart/      — Chart computations
horoscope/dhasa/      — 40+ dasha systems
ui/                   — UI widgets and visualization
```

### 3.3 C# / .NET Libraries

| Library | GitHub URL | License | Key Features |
|---------|------------|---------|--------------|
| **VedAstro** | github.com/VedAstro/VedAstro | Open Source (Non-profit) | Complete horoscope generation, event prediction, dashas. Includes Azure-based API for backend integration. 15,000+ DOB test datasets. Desktop/web support. |

VedAstro is particularly notable as a **non-profit, open-source project** making Vedic astrology accessible. Its `Calculate` module handles core math, and it's ideal for apps without licensing costs.

### 3.4 JavaScript/Node.js Libraries (For Web/Mobile)

| Library | GitHub URL | License | Key Features |
|---------|------------|---------|--------------|
| **sweph** | github.com/timotejroiko/sweph | AGPL | Definitive Node.js bindings, TypeScript support |
| **sweph-wasm** | github.com/ptprashanttripathi/sweph-wasm | MIT | WebAssembly for browser calculations |

### 3.5 Vedic Astrology APIs (Commercial & Free)

For rapid development, these APIs provide pre-built Vedic astrology features:

| API | Features | Pricing | Notes |
|-----|----------|---------|-------|
| **AstrologyAPI** | North/South/East Kundli styles, divisional charts, Vimshottari/Char/Yogini Dashas, Ashtakvarga, interpretations, remedies | Tiered | Most comprehensive Vedic features |
| **VedicAstroAPI** | Multi-lingual predictions (21 languages), horoscopes, PDF reports | Varies | Good for international apps |
| **Prokerala API** | Charts, horoscope reports, Kundli matching | Freemium | Easy integration |
| **FreeAstrologyAPI** | JSON data for planets, houses | Free | Basic calculations only |
| **VedAstro API** | Azure-based, full horoscope generation | Free (non-profit) | Open source backend |

### 3.6 Ayanamsa Options

Ayanamsa selection affects all sidereal positions. Difference between ayanamsas is typically 1-3 degrees.

| Ayanamsa | Swiss Ephemeris Flag | Notes |
|----------|---------------------|-------|
| **Lahiri (Chitrapaksha)** | SIDM_LAHIRI | Indian government standard since 1955. **Recommended default.** |
| Krishnamurti (KP) | SIDM_KRISHNAMURTI | Used by KP system practitioners |
| Raman | SIDM_RAMAN | B.V. Raman's system |
| True Chitrapaksha | SIDM_TRUE_CHITRA | Fixes Lahiri drift; increasingly popular |

---

## Part 4: Application Architecture

### 4.1 Recommended Technology Stack

| Component | Recommendation |
|-----------|----------------|
| **Frontend** | Flutter (single codebase for iOS, Android, web, desktop) |
| **Calculation Backend** | Python with pyswisseph or PyJHora |
| **Interpretation Engine** | Separate microservice with rule engine + NLG templates |
| **Database** | PostgreSQL for charts, Redis for caching |
| **Ephemeris Data** | Swiss Ephemeris data files (bundled with app) |

### 4.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (Flutter)                       │
│    Chart visualization, input forms, reading display     │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────┐
│                       API GATEWAY                        │
└───────────────────────────┬─────────────────────────────┘
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌─────────────────┐ ┌──────────────┐ ┌────────────────┐
│   Calculation   │ │Interpretation│ │  User Service  │
│     Service     │ │   Service    │ │                │
│ ─────────────── │ │ ──────────── │ │ Auth, charts,  │
│ Swiss Ephemeris │ │ Rule engine +│ │ subscriptions  │
│ via pyswisseph  │ │ NLG/templates│ │                │
└────────┬────────┘ └──────┬───────┘ └───────┬────────┘
         └─────────────────┼─────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│     PostgreSQL  │  Redis (cache)  │  Ephemeris files    │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Database Schema

Store raw birth data separately from calculated positions to allow recalculation when algorithms improve:

```sql
-- Birth data (immutable)
ChartData {
    id,
    name,
    birth_datetime,
    latitude,
    longitude,
    timezone_offset,
    ayanamsa_mode,
    created_at
}

-- Calculated positions (regeneratable cache)
PlanetaryPositions {
    chart_id,
    planet_id,
    longitude,
    speed,
    retrograde,
    rasi (0-11),
    nakshatra (0-26),
    pada (1-4),
    house (1-12)
}

-- Interpretation rules (expandable)
InterpretationRules {
    id,
    rule_type,
    condition_json,
    priority,
    template_id
}
```

### 4.4 Interpretation Engine Design

Three-layer architecture:
1. **Calculation Layer** - Produces positions
2. **Rule Engine** - Matches conditions against database
3. **Natural Language Generation** - Produces readable text

**Text Template Approach (Recommended for Initial Development):**

```
Template: "With {planet} in the {house_number}th house in {sign},
you tend toward {characteristic}. This influence becomes most
prominent during {dasha_period}."
```

**Handling Contradictory Indications:**
- Assign priority weights
- Dasha lord indications typically override natal chart factors
- Exact aspects override wider orb aspects
- House lords override natural karakas
- Synthesize when conflicts arise rather than simply showing both

---

## Part 5: Critical Technical Challenges

### 5.1 Timezone Handling

**This is the most common source of calculation errors.**

Pre-1970 historical timezones are poorly documented.

**Known Problem Areas:**
- US DST before 1967 varied by county
- India had brief DST periods in 1942
- JHora has known issues with historical dates like France 1949

**Solutions:**
- Use IANA TZ Database for post-1970 dates
- Thomas Shanks' "International Atlas" for earlier periods
- Always allow manual timezone override
- Display calculated Ascendant so users can verify accuracy

### 5.2 Performance Optimization

Complex calculations can create bottlenecks:
- 16+ divisional charts per natal chart
- Nested dasha calculations
- Ashtakavarga computations

**Optimization Strategies:**
- Implement lazy loading for divisional charts (calculate on demand)
- Cache calculated positions in Redis with chart_id key
- Consider WebAssembly compilation for browser-based calculations
- Pre-compute common yogas and store results

---

## Part 6: Legal & Commercial Considerations

### 6.1 Licensing Requirements

| Component | Requirement |
|-----------|-------------|
| Swiss Ephemeris | CHF 750 professional license for closed-source commercial software |
| Classical Texts | Original Sanskrit is public domain, but all English translations are copyrighted |
| Interpretations | Write original interpretations based on principles, or translate from Sanskrit |

### 6.2 App Store Considerations

**Apple App Store:**
- Apple considers astrology a "saturated category"
- Rejects many apps under Guideline 4.3(b) for duplicating existing functionality
- Differentiate through unique features: AI-enhanced interpretations, live consultation marketplace, novel visualizations

**Google Play:**
- Typically more lenient with automated initial screening

### 6.3 Required Legal Elements

1. Entertainment purpose disclaimer ("not a substitute for professional advice")
2. Privacy policy (birth data is personally identifying under GDPR)
3. Data security for birth information (encryption, right to deletion)
4. Terms of service with liability limitations
5. Age requirement (typically 18+)

### 6.4 Monetization Models

**Recommended Progression:**
1. **Launch** - Free daily horoscopes and basic birth charts
2. **Add subscription tier** - Detailed reports, compatibility analysis, ad-free
3. **Consultation marketplace** - Highest margin, 30-40% platform fee
4. **E-commerce** - Gemstones, remedial products

---

## Part 7: Development Steps

A practical guide for building your Vedic astrology application:

### Step 1: Study Calculations
- Use books like BPHS for formulas
- Implement via libraries (Swiss Ephemeris wrappers in VedAstro, pyswisseph)
- Understand Lahiri Ayanamsa adjustments

### Step 2: Set Up Calculation Backend
```
Input: Birth data (date, time, location)
↓
Process: Compute planetary positions using ephemeris
↓
Output: Chart data (houses, planets, nakshatras)
```

### Step 3: Implement Core Features

| Feature | Implementation | Priority |
|---------|----------------|----------|
| **Chart Generation** | Visual Kundli (North/South/East Indian styles) | High |
| **Dasha Calculations** | Vimshottari, Char, Yogini systems | High |
| **Transit Analysis** | Current planetary positions vs natal | Medium |
| **Interpretations** | Rule-based engine or AI-enhanced | High |
| **Yoga Detection** | Match conditions from B.V. Raman's rules | Medium |

### Step 4: Build User Interface
- Mimic successful apps (AstroSeek, Astrosage patterns)
- Include clear user inputs (date/time pickers with timezone)
- Visual chart rendering (SVG recommended)
- Add ethical disclaimers

### Step 5: Testing & Validation
- Validate with real charts
- Cross-check against Jagannatha Hora (free reference)
- Test with VedAstro's 15,000+ DOB datasets
- Consider privacy (GDPR compliance for birth data)

### Step 6: Potential Enhancements
- AI integration for personalized readings (ground in traditional texts)
- Kundli matching / compatibility
- Panchang (daily calendar)
- Multi-language support
- Push notifications for daily horoscopes

---

## Appendix A: Complete Book Reference List

### Classical Texts
1. Brihat Parashara Hora Shastra — R. Santhanam (Ranjan Publications, 2 vols)
2. Brihat Parashara Hora Shastra — G.C. Sharma (Sagar Publications, 1994)
3. Phaladeepika — S.S. Sareen (Sagar Publications)
4. Brihat Jataka — B. Suryanarain Rao (Motilal Banarsidass, ISBN: 8120813952)
5. Jataka Parijata — V. Subramanya Sastri (Ranjan, ISBN: 8189230642, 3 vols)
6. Saravali — R. Santhanam (Ranjan, ISBN: 9788188230457)
7. Jaimini Sutras — Sanjay Rath (Sagar, ISBN: 8170822491)
8. Uttara Kalamrita — P.S. Sastri (Ranjan, ISBN: 8188230405)

### Modern References
1. Three Hundred Important Combinations — B.V. Raman (Motilal Banarsidass, ISBN: 8120808509)
2. Yogas in Astrology — Dr. K.S. Charak (ISBN: 9788190100847)
3. Vedic Astrology: An Integrated Approach — P.V.R. Narasimha Rao (Sagar)
4. Laghu Parashari — Dr. K.S. Charak
5. Narayana Dasa — Sanjay Rath (ISBN: 9788170822462)
6. How to Judge a Horoscope (Vols 1 & 2) — B.V. Raman
7. Light on Life — Hart de Fouw & Robert Svoboda
8. Predicting through Jaimini's Chara Dasha — K.N. Rao

### Beginner-Friendly
1. Astrology for Beginners — B.V. Raman
2. The Essentials of Vedic Astrology — Komilla Sutton
3. Learn Astrology Step by Step — Dr. K.S. Charak
4. Beneath a Vedic Sky — William Levacy

### Intermediate
1. Predictive Astrology of the Hindus — Pandit Gopesh Kumar Ojha
2. Practical Vedic Astrology — G.S. Agarwal
3. Nakshatra Exploration — P.V.R. Narasimha Rao

### Advanced/Specialized
1. Elements of Vedic Astrology (2 vols) — Dr. K.S. Charak
2. The Nakshatras: The Stars Beyond the Zodiac — Komilla Sutton
3. Astrology of the Seers — David Frawley
4. A Thousand Suns — Linda Johnsen (spiritual/cultural context)

---

## Appendix B: GitHub Repository Links

### Python Libraries
- **pyswisseph:** github.com/astrorigin/pyswisseph
- **PyJHora:** github.com/naturalstupid/PyJHora
- **jyotishganit:** github.com/northtara/jyotishganit
- **VedAstro.Python:** github.com/VedAstro/VedAstro.Python
- **VedicAstro (KP):** github.com/diliprk/VedicAstro

### C# / .NET Libraries
- **VedAstro:** github.com/VedAstro/VedAstro (includes Azure API)

### JavaScript Libraries
- **sweph (Node.js):** github.com/timotejroiko/sweph
- **sweph-wasm (Browser):** github.com/ptprashanttripathi/sweph-wasm

### PyPI Packages
- **jyotishyamitra:** pypi.org/project/jyotishyamitra
- **jyotishganit:** pypi.org/project/jyotishganit

### Official Documentation
- **Swiss Ephemeris Documentation:** astro.com/swisseph/swisseph.htm
- **Swiss Ephemeris Licensing:** astro.com/swisseph/swephinfo_e.htm

---

## Appendix C: Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Study PyJHora codebase as reference implementation
- [ ] Set up Python backend with pyswisseph and Lahiri ayanamsa
- [ ] Implement basic birth chart calculation (D1)
- [ ] Validate all calculations against Jagannatha Hora (free reference)

### Phase 2: Core Features (Weeks 5-12)
- [ ] Add Vimshottari dasha calculations
- [ ] Implement divisional charts (D9, D10 minimum)
- [ ] Build yoga detection engine using B.V. Raman's rules
- [ ] Create interpretation template system

### Phase 3: UI & Polish (Weeks 13-20)
- [ ] Build Flutter frontend for mobile/desktop
- [ ] Implement chart visualization
- [ ] Add remaining divisional charts and dasha systems
- [ ] Acquire Swiss Ephemeris commercial license (CHF 750)

### Phase 4: Commercial Launch (Weeks 21+)
- [ ] Implement user authentication and chart storage
- [ ] Add subscription/payment system
- [ ] Submit to app stores
- [ ] Launch with freemium model

---

## Appendix D: Citations & References

### Books & Reading Lists
- Best Astrology Books to Read in 2025 (Beginner to Advanced Guide) – VAMA
- The Top 6 Best Books for Learning Vedic Astrology | Astrotalk
- A Reading List in Vedic Astrology

### Open Source Projects
- [VedAstro/VedAstro](https://github.com/VedAstro/VedAstro) - Non-profit open source Vedic astrology project
- [diliprk/VedicAstro](https://github.com/diliprk/VedicAstro) - Python package for Krishnamurti Paddhati
- [naturalstupid/PyJHora](https://github.com/naturalstupid/PyJHora) - Comprehensive Python library

### APIs & Services
- AstrologyAPI - Astrology and Horoscopes API for Your App and Website
- VedicAstroAPI - Multi-lingual Vedic Astrology API (21 Languages)
- Prokerala Astrology API
- FreeAstrologyAPI - Free Astrology API Services

### Python Packages (PyPI)
- jyotishyamitra
- jyotishganit 0.1.2

### Community Resources
- r/vedicastrology - Reddit community
- r/Jyotishya - Reddit community for practitioners

### Official Documentation
- Swiss Ephemeris: astro.com/swisseph/swisseph.htm
- Swiss Ephemeris Licensing: astro.com/swisseph/swephinfo_e.htm

---

*Document compiled from: Vedic_Astrology_Application_Development_Guide.docx and additional research*
*Last updated: January 2026*
