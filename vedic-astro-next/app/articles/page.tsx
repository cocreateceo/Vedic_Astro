'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

const articles = [
  {
    title: 'Understanding the 12 Houses in Vedic Astrology',
    category: 'Houses',
    desc: 'Learn about the significance of each house in your birth chart and how they influence different areas of life.',
    readTime: '8 min',
    content: `The twelve houses (Bhavas) in Vedic astrology represent different areas of life. Each house is ruled by a zodiac sign and influenced by the planets placed in it.

**1st House (Lagna)** — Self, personality, physical body, and overall life direction. The ascendant sign here sets the tone for the entire chart.

**2nd House** — Wealth, family, speech, and values. This house governs your material possessions and early family life.

**3rd House** — Courage, siblings, communication, and short travels. It represents your willpower and creative self-expression.

**4th House** — Home, mother, emotions, and comforts. This house reflects your inner peace and property matters.

**5th House** — Children, intelligence, creativity, and romance. Known as the house of Purva Punya (past life merits).

**6th House** — Enemies, diseases, debts, and daily work. It shows obstacles you must overcome and your capacity for service.

**7th House** — Marriage, partnerships, and public dealings. The descendant house governs all one-to-one relationships.

**8th House** — Transformation, longevity, occult, and sudden events. This mysterious house governs inheritance and hidden matters.

**9th House** — Dharma, fortune, guru, and higher learning. The most auspicious house, representing your spiritual path and luck.

**10th House** — Career, reputation, authority, and public life. Your professional achievements and social standing are seen here.

**11th House** — Gains, friendships, aspirations, and elder siblings. This house governs your income and social network.

**12th House** — Losses, liberation, foreign lands, and spirituality. It represents endings, isolation, and the journey toward moksha.

Understanding your houses requires analyzing the signs placed in them, the ruling planets, and any planetary aspects. A strong house with benefic influences brings positive results in that life area.`,
  },
  {
    title: 'The Nine Planets (Navagraha) and Their Effects',
    category: 'Planets',
    desc: 'Explore the nine celestial bodies in Vedic astrology and understand their impact on your destiny.',
    readTime: '10 min',
    content: `The Navagraha (nine planets) are the cornerstone of Vedic astrology. Each planet governs specific aspects of life and carries unique energies.

**Surya (Sun)** — The soul, father, authority, and vitality. A strong Sun gives leadership ability, confidence, and government favor. It rules Leo and is exalted in Aries.

**Chandra (Moon)** — The mind, mother, emotions, and mental peace. The Moon governs your emotional nature and is crucial for determining the Nakshatra. It rules Cancer and is exalted in Taurus.

**Mangal (Mars)** — Energy, courage, siblings, and property. Mars gives determination and physical strength but can cause aggression when afflicted. It rules Aries and Scorpio.

**Budha (Mercury)** — Intelligence, communication, business, and learning. Mercury governs analytical ability and is the planet of commerce. It rules Gemini and Virgo.

**Guru (Jupiter)** — Wisdom, children, spirituality, and expansion. The great benefic Jupiter brings fortune, knowledge, and divine grace. It rules Sagittarius and Pisces.

**Shukra (Venus)** — Love, luxury, art, and marriage. Venus governs beauty, relationships, and material comforts. It rules Taurus and Libra.

**Shani (Saturn)** — Discipline, karma, longevity, and hardship. Saturn teaches through restriction and delay but rewards patience and hard work. It rules Capricorn and Aquarius.

**Rahu (North Node)** — Obsession, foreign matters, unconventional paths, and material desires. Rahu amplifies whatever it touches and creates illusion.

**Ketu (South Node)** — Spirituality, detachment, past lives, and moksha. Ketu strips away material attachment and drives spiritual seeking.

The interplay between these planets through aspects, conjunctions, and house placements creates the unique blueprint of each individual's life.`,
  },
  {
    title: 'Nakshatra: The 27 Lunar Mansions',
    category: 'Nakshatras',
    desc: 'Discover the significance of the 27 Nakshatras and how your birth star shapes your personality.',
    readTime: '12 min',
    content: `The 27 Nakshatras are lunar mansions that divide the zodiac into precise segments of 13°20' each. Your birth Nakshatra (Janma Nakshatra) is determined by the Moon's position at birth and is considered even more important than the Sun sign.

**The Nakshatra System:**
Each Nakshatra has a ruling deity, a planetary lord, and a specific symbol that reveals its nature. The Nakshatras are grouped into three categories based on their qualities:

**Deva (Divine)** — Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati. These Nakshatras have a gentle, spiritual, and benevolent nature.

**Manushya (Human)** — Bharani, Rohini, Ardra, Purva Phalguni, Uttara Phalguni, Purva Ashadha, Uttara Ashadha, Purva Bhadrapada, Uttara Bhadrapada. These have balanced, practical qualities.

**Rakshasa (Demonic)** — Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Moola, Dhanishta, Shatabhisha. These Nakshatras have intense, powerful, and transformative energy.

**Key Nakshatras and Their Qualities:**
- **Ashwini** (0°-13°20' Aries) — Swift healing, new beginnings. Ruled by Ketu.
- **Rohini** (10°-23°20' Taurus) — Beauty, creativity, fertility. Ruled by Moon.
- **Pushya** (3°20'-16°40' Cancer) — The most auspicious Nakshatra for spiritual growth. Ruled by Saturn.
- **Magha** (0°-13°20' Leo) — Royal lineage, ancestral connections. Ruled by Ketu.
- **Swati** (6°40'-20° Libra) — Independence, flexibility, trade. Ruled by Rahu.
- **Moola** (0°-13°20' Sagittarius) — Deep investigation, transformation. Ruled by Ketu.

Your Nakshatra influences your personality traits, compatible partners (through Nakshatra matching), favorable activities, and the timing of life events through the Dasha system.`,
  },
  {
    title: 'Vimshottari Dasha: Timing Life Events',
    category: 'Dasha',
    desc: 'Understand the Vimshottari Dasha system and how it predicts the timing of major life events.',
    readTime: '15 min',
    content: `The Vimshottari Dasha is the most widely used planetary period system in Vedic astrology. It operates on a 120-year cycle where each planet rules for a specific number of years.

**Planetary Period Durations:**
- Ketu — 7 years
- Venus — 20 years
- Sun — 6 years
- Moon — 10 years
- Mars — 7 years
- Rahu — 18 years
- Jupiter — 16 years
- Saturn — 19 years
- Mercury — 17 years

**How It Works:**
Your Dasha sequence begins based on the Nakshatra the Moon occupies at birth. The ruling planet of that Nakshatra determines which Mahadasha (major period) you are born into.

**Levels of Dasha:**
1. **Mahadasha** — The major period (years). Sets the overall theme.
2. **Antardasha (Bhukti)** — Sub-period within the Mahadasha (months). Refines the theme.
3. **Pratyantardasha** — Sub-sub-period (weeks). Further refinement.

**Interpreting Dashas:**
The results of a Dasha depend on:
- The planet's natural significations
- The houses the planet rules in your chart
- The house the planet occupies
- Aspects and conjunctions on the planet
- The planet's strength (exaltation, debilitation, retrograde)

**Example:** If you enter Jupiter Mahadasha and Jupiter rules your 9th house (fortune) and sits in the 10th house (career), expect career growth, higher education, and spiritual development during those 16 years.

A skilled astrologer combines Dasha analysis with transit predictions to give precise timing of life events like marriage, career changes, and health matters.`,
  },
  {
    title: 'Gemstone Remedies in Vedic Astrology',
    category: 'Remedies',
    desc: 'Learn which gemstones are recommended for different planetary afflictions and how to wear them.',
    readTime: '7 min',
    content: `Gemstone therapy (Ratna Shastra) is one of the most popular remedial measures in Vedic astrology. Each planet is associated with a specific gemstone that can strengthen its positive influences.

**Planet-Gemstone Associations:**
- **Sun** — Ruby (Manik) — Strengthens confidence, authority, health
- **Moon** — Pearl (Moti) — Calms the mind, emotional balance, maternal blessings
- **Mars** — Red Coral (Moonga) — Boosts courage, energy, property matters
- **Mercury** — Emerald (Panna) — Enhances intelligence, communication, business
- **Jupiter** — Yellow Sapphire (Pukhraj) — Brings wisdom, fortune, marital bliss
- **Venus** — Diamond (Heera) — Attracts love, luxury, artistic talents
- **Saturn** — Blue Sapphire (Neelam) — Provides discipline, career stability, longevity
- **Rahu** — Hessonite Garnet (Gomed) — Reduces confusion, protects from negativity
- **Ketu** — Cat's Eye (Lehsunia) — Enhances intuition, spiritual progress

**Important Guidelines:**
1. **Consult an astrologer** before wearing any gemstone. A wrongly chosen stone can cause harm.
2. **Quality matters** — Use natural, untreated gemstones of good clarity and color.
3. **Minimum weight** — Generally 3-5 carats for effective results.
4. **Metal and finger** — Each gemstone should be set in a specific metal and worn on the correct finger.
5. **Activation ritual** — Gemstones should be energized with mantras on the ruling planet's day.
6. **Wearing day** — Start wearing on the day ruled by the corresponding planet during an auspicious Muhurta.

**Caution:** Blue Sapphire (Neelam) and Cat's Eye (Lehsunia) are extremely powerful stones. Always test them for 3 days before permanent wear by keeping them under your pillow.`,
  },
  {
    title: 'Marriage Compatibility: Ashtakoot Milan',
    category: 'Compatibility',
    desc: 'Understand the 8-fold compatibility matching system used in Vedic astrology for marriage.',
    readTime: '9 min',
    content: `Ashtakoot Milan (eight-fold compatibility matching) is the traditional Vedic system for assessing marriage compatibility. It compares the birth Nakshatras of the prospective bride and groom across eight dimensions.

**The Eight Koots and Their Points:**

1. **Varna (1 point)** — Spiritual compatibility. Compares the spiritual development level. Four Varnas: Brahmin, Kshatriya, Vaishya, Shudra.

2. **Vashya (2 points)** — Mutual attraction and dominance. Determines who has more influence in the relationship. Categories: Chatushpada, Manava, Jalachara, Vanachara, Keeta.

3. **Tara (3 points)** — Health and well-being compatibility. Calculated from the birth Nakshatras, it indicates the couple's health prospects together.

4. **Yoni (4 points)** — Sexual and physical compatibility. Each Nakshatra is assigned an animal nature (14 types), and compatibility is based on how these animals relate.

5. **Graha Maitri (5 points)** — Mental compatibility. Based on the friendship between the Moon sign lords of both charts. This determines intellectual and emotional rapport.

6. **Gana (6 points)** — Temperament matching. Three Ganas: Deva (divine/gentle), Manushya (human/practical), Rakshasa (intense/dominating).

7. **Bhakoot (7 points)** — Prosperity and family welfare. Based on the relative position of Moon signs. Certain combinations (like 6-8 or 2-12) are considered unfavorable.

8. **Nadi (8 points)** — The most important factor. Relates to genetic compatibility and health of offspring. Three Nadis: Aadi, Madhya, Antya. Same Nadi matching scores 0 and is considered a significant Dosha.

**Scoring:**
- Total possible: 36 points
- 18+ points: Acceptable match
- 24+ points: Good match
- 30+ points: Excellent match
- Below 18: Generally not recommended

**Beyond the Score:** A skilled astrologer also examines Manglik Dosha, planetary aspects between charts, and the overall strength of the 7th house in both charts before giving a final recommendation.`,
  },
];

const categories = ['All', 'Houses', 'Planets', 'Nakshatras', 'Dasha', 'Remedies', 'Compatibility'];

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit={"ज्ञान"} title="Learn Vedic Astrology" description="Articles and guides on planets, houses, nakshatras, and more" emoji="📿" />

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => { setActiveCategory(c); setExpandedArticle(null); }}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === c
                  ? 'bg-sign-primary text-cosmic-bg font-medium'
                  : 'bg-sign-primary/10 text-sign-primary hover:bg-sign-primary/20 hover-glow'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(a => {
            const isExpanded = expandedArticle === a.title;
            return (
              <div
                key={a.title}
                className={`glass-card hover-lift p-6 flex flex-col transition-all ${
                  isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                <span className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded self-start mb-3">{a.category}</span>
                <h3 className="font-heading text-lg text-text-primary mb-3">{a.title}</h3>
                <p className="text-text-muted text-sm mb-4">{a.desc}</p>
                {isExpanded && (
                  <div className="article-content text-text-muted text-sm leading-relaxed mb-4 whitespace-pre-line border-t border-sign-primary/10 pt-4">
                    {a.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h4 key={i} className="font-heading text-text-primary mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                      }
                      if (line.match(/^\*\*.+?\*\*/)) {
                        const parts = line.split(/(\*\*.*?\*\*)/);
                        return (
                          <p key={i} className="mb-1">
                            {parts.map((part, j) =>
                              part.startsWith('**') && part.endsWith('**')
                                ? <strong key={j} className="text-text-primary">{part.replace(/\*\*/g, '')}</strong>
                                : part
                            )}
                          </p>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return <p key={i} className="ml-4 mb-1">{line}</p>;
                      }
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i} className="mb-2">{line}</p>;
                    })}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-text-muted text-xs">{a.readTime} read</span>
                  <button
                    onClick={() => setExpandedArticle(isExpanded ? null : a.title)}
                    className="text-sign-primary text-sm font-medium animated-underline"
                  >
                    {isExpanded ? 'Show Less' : 'Read More \u2192'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
