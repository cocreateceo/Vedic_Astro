// 35-Year Dasha/Antardasha Prediction Summary
// Maps to ClickAstro Chapter 6: "35 Years Prediction Summary"

import type { DashaWithAntardasha } from '@/types';

export interface DashaPredictionEntry {
  mahadasha: string;
  antardasha: string;
  startYear: number;
  endYear: number;
  startMonth: string;
  endMonth: string;
  prediction: string;
  rating: string;
  isCurrent: boolean;
}

// Detailed prediction templates per Mahadasha lord
// Sources: BPHS Ch. 47-54, Horasara Ch. 9-18, Phaladeepika Ch. 20
const MAHA_CONTEXT: Record<string, { theme: string; focus: string[]; classical: string }> = {
  Sun: { theme: 'authority, government, and self-expression', focus: ['career recognition', 'health vitality', 'paternal relationships', 'leadership roles'], classical: 'Classical texts state:Sun Mahadasha (6 years) activates the soul\'s purpose. The native gains through government, authority, and father. Health of the heart and eyes requires attention.' },
  Moon: { theme: 'emotions, public life, and nurturing', focus: ['mental peace', 'maternal bonds', 'creative endeavors', 'travel and public dealings'], classical: 'Classical texts state:Moon Mahadasha (10 years) governs the mind and public life. The native gains through mother, travel, liquid assets, and nurturing professions.' },
  Mars: { theme: 'courage, property, and physical energy', focus: ['land and property', 'sibling relations', 'competitive success', 'physical health'], classical: 'Classical texts state:Mars Mahadasha (7 years) activates courage and property matters. The native gains through land, engineering, surgery, and competitive endeavors.' },
  Mercury: { theme: 'intellect, commerce, and communication', focus: ['business ventures', 'education', 'writing and speech', 'analytical work'], classical: 'Classical texts state:Mercury Mahadasha (17 years) governs intellect and commerce. The native gains through trade, education, writing, and all forms of communication.' },
  Jupiter: { theme: 'wisdom, fortune, and spiritual growth', focus: ['wealth accumulation', 'children', 'teaching and learning', 'dharmic pursuits'], classical: 'Classical texts state:Jupiter Mahadasha (16 years) is the period of wisdom and fortune. The native gains through righteousness, children, teaching, and spiritual growth.' },
  Venus: { theme: 'love, luxury, and artistic expression', focus: ['marriage harmony', 'financial comfort', 'creative arts', 'social pleasures'], classical: 'Classical texts state:Venus Mahadasha (20 years) governs love, luxury, and the arts. The native gains through marriage, entertainment, beauty, and material comfort.' },
  Saturn: { theme: 'discipline, karma, and endurance', focus: ['career building', 'chronic health', 'service to others', 'long-term investments'], classical: 'Classical texts state:Saturn Mahadasha (19 years) tests endurance and rewards discipline. The native gains through persistent effort, service, and democratic institutions.' },
  Rahu: { theme: 'ambition, foreign connections, and transformation', focus: ['unconventional gains', 'technology', 'foreign travel', 'sudden changes'], classical: 'Classical texts state:Rahu Mahadasha (18 years) brings worldly ambition and transformation. The native gains through foreign connections, technology, and unconventional means.' },
  Ketu: { theme: 'spirituality, detachment, and past karma', focus: ['spiritual insight', 'letting go', 'healing', 'mystical experiences'], classical: 'Classical texts state:Ketu Mahadasha (7 years) activates spiritual liberation. The native gains through renunciation, healing, esoteric knowledge, and past-life merit.' },
};

// Antardasha lord effects within each Mahadasha
const ANTAR_EFFECTS: Record<string, Record<string, string>> = {
  Sun: {
    Sun: 'During this period, your confidence and authority reach a peak. Government-related matters proceed favorably. You may receive recognition from superiors and achieve career milestones. Health remains strong, particularly regarding heart and eyesight. Father or paternal figures play a supportive role.',
    Moon: 'Emotional sensitivity increases during this sub-period. Your public image improves, and connections with women or maternal figures strengthen. Creative activities flourish. Travel, especially over water, brings positive results. Mental peace requires conscious cultivation.',
    Mars: 'This period brings a surge of energy and determination. Property matters may come to the forefront. Relations with siblings need careful handling. Avoid impulsive decisions, especially regarding legal matters. Physical exercise and competitive activities are favored.',
    Mercury: 'Intellectual pursuits shine during this phase. Business communications and negotiations succeed. Education-related goals make progress. Writing, speaking, and analytical work produce excellent results. Be careful with contracts and documentation.',
    Jupiter: 'Fortune smiles during this blessed sub-period. Wisdom guides your decisions effectively. Financial gains through righteous means are indicated. Children bring joy. Spiritual understanding deepens. Teachers and mentors appear when needed most.',
    Venus: 'Relationships and creative expression take center stage. Marital harmony improves. Luxury and material comforts increase. Artistic talents gain recognition. Financial gains through beauty, arts, or entertainment are likely. Social life becomes more active.',
    Saturn: 'Patience and discipline are tested during this phase. Career responsibilities increase but rewards come through perseverance. Health needs attention, particularly bones and joints. Long-term planning bears fruit. Service-oriented activities bring karmic rewards.',
    Rahu: 'Unexpected developments mark this period. Foreign connections or unconventional approaches bring mixed results. Technology and innovation offer opportunities. Guard against deception and verify all important matters. Sudden gains are possible but not guaranteed.',
    Ketu: 'Spiritual inclinations strengthen during this period. Detachment from material pursuits may occur naturally. Past-life patterns surface for resolution. Health needs attention for unexplained ailments. Meditation and spiritual practices bring great benefit.',
  },
  Moon: {
    Sun: 'Authority and emotional balance combine positively. Government dealings proceed favorably. Father provides support. Self-confidence grows. Health vitality improves. Leadership opportunities emerge in your professional sphere.',
    Moon: 'Emotional depth and intuitive abilities peak. Public popularity increases. Creative ventures flourish. Mother provides comfort and guidance. Travel brings joy. Water-related activities are auspicious. Inner peace deepens through reflection.',
    Mars: 'Energy and emotions create a dynamic period. Property opportunities arise but require caution. Physical vitality increases. Sibling relationships may see both support and tension. Channel excess energy into constructive activities.',
    Mercury: 'Mental agility combines with emotional intelligence. Business and communication skills are enhanced. Educational pursuits succeed. Quick thinking and adaptability serve you well. Writing and analytical work produce good results.',
    Jupiter: 'This is a highly auspicious sub-period. Emotional wisdom and spiritual growth align beautifully. Financial prosperity increases. Children bring happiness. Learning and teaching opportunities multiply. Fortune favors your endeavors.',
    Venus: 'Love, beauty, and emotional fulfillment characterize this period. Marriage harmony prevails. Creative and artistic abilities blossom. Financial comfort increases through partnerships. Social gatherings bring joy and networking opportunities.',
    Saturn: 'Emotional discipline is required during this phase. Responsibilities towards mother or home increase. Career demands patience but builds solid foundations. Health needs monitoring, especially for water-related or stomach issues.',
    Rahu: 'Emotional turbulence may arise from unexpected sources. Foreign connections bring opportunities but also confusion. Stay grounded and trust your intuition. Technology offers solutions. Avoid obsessive emotional patterns.',
    Ketu: 'Spiritual emotions and inner transformation define this period. Past emotional patterns surface for healing. Detachment from unhealthy relationships may occur naturally. Meditation and spiritual practices provide deep comfort.',
  },
  Mars: {
    Sun: 'Courage and authority combine powerfully. Career advancement through bold action is favored. Property and real estate dealings proceed well. Father supports your ambitions. Physical health and vitality are excellent.',
    Moon: 'Emotional courage strengthens your resolve. Mother and family provide support for your ventures. Property investments show promise. Physical energy needs channeling into productive activities. Guard against emotional impulsiveness.',
    Mars: 'Maximum energy and drive characterize this intense period. Property gains are likely. Competitive endeavors succeed. Sibling relationships strengthen through shared activities. Guard against accidents and unnecessary conflicts.',
    Mercury: 'Strategic thinking combines with courage. Business ventures benefit from bold analytical approaches. Communication skills become more assertive. Education in technical subjects progresses well. Property documentation needs attention.',
    Jupiter: 'Fortune and courage create excellent opportunities. Property acquisition is highly favored. Legal matters resolve positively. Children of siblings bring joy. Physical vitality combines with wisdom for optimal decisions.',
    Venus: 'Passion and creativity blend beautifully. Marriage may benefit from renewed energy. Property related to luxury or beauty succeeds. Artistic ventures gain momentum. Financial gains through real estate partnerships.',
    Saturn: 'Discipline and determination are tested. Property matters face delays but ultimately resolve. Career requires patient effort. Physical health needs monitoring, especially for bones and muscles. Long-term investments in land prove worthwhile.',
    Rahu: 'Bold unconventional moves may yield surprising results. Foreign property connections arise. Technology applications in real estate succeed. Guard against hasty decisions and verify all property documents carefully.',
    Ketu: 'Spiritual warrior energy emerges. Past property matters may resurface for resolution. Physical health needs attention for unexplained issues. Spiritual retreats and practices bring deep transformation.',
  },
  Mercury: {
    Sun: 'Intellectual authority strengthens. Government communications proceed favorably. Career recognition for analytical abilities. Educational achievements are recognized. Father supports intellectual pursuits.',
    Moon: 'Emotional intelligence enhances communication. Business intuition sharpens. Creative writing and artistic communication flourish. Connections with women bring business opportunities.',
    Mars: 'Quick thinking and decisive action combine effectively. Technical education progresses. Business ventures requiring courage succeed. Property documentation and legal communications need attention.',
    Mercury: 'Peak intellectual performance characterizes this period. All forms of communication excel. Business acumen reaches its height. Education and research produce outstanding results. Writing and publishing are highly favored.',
    Jupiter: 'Wisdom enhances intellect beautifully. Educational pursuits reach fruition. Business expansion succeeds through wise strategies. Financial gains through knowledge-based ventures. Teaching and mentoring opportunities multiply.',
    Venus: 'Artistic communication and business creativity flourish. Partnerships in business succeed. Financial gains through arts, media, or entertainment. Social networking enhances business prospects.',
    Saturn: 'Discipline in intellectual pursuits bears fruit. Business faces challenges requiring careful planning. Communication must be more measured and precise. Long-term educational goals require patience and persistence.',
    Rahu: 'Innovative thinking brings unexpected breakthroughs. Technology and digital communication offer great opportunities. Foreign business connections prove valuable. Guard against miscommunication and verify important information.',
    Ketu: 'Intuitive knowledge and spiritual communication deepen. Past intellectual patterns need reevaluation. Research into spiritual or occult subjects brings insight. Detachment from purely materialistic thinking opens new perspectives.',
  },
  Jupiter: {
    Sun: 'Fortune and authority create an auspicious period. Government recognition and career elevation are likely. Classical texts state:"The native obtains royal favor, gold, and conveyances." Father provides wise counsel. Health and vitality improve. Spiritual confidence grows. This is a favorable time for leadership roles and public service.',
    Moon: 'Emotional wisdom and good fortune align beautifully. Public reputation soars to new heights. Classical texts state:"The native gains cattle, lands, and comforts of women." Mother provides blessings. Creative ventures succeed. Children bring immense joy. Travel to sacred places and pilgrimages are indicated. Charitable activities bring deep satisfaction.',
    Mars: 'Fortune favors the brave during this period. Classical texts state:"The native acquires land, house, and wealth through courage." Property acquisitions succeed. Legal victories are possible. Children show courage and initiative. Physical vitality combines with good luck. Success in engineering, military, or competitive fields is indicated.',
    Mercury: 'Wisdom and intellect create powerful combinations. Classical texts state:"The native gains through learning, trade, and skilled speech." Business expansion through knowledge succeeds. Educational milestones are achieved. Financial gains through consultancy, advisory roles, or publishing. Communication carries authority and persuasion. An excellent period for examinations and academic honors.',
    Jupiter: 'The most auspicious sub-period in Jupiter Mahadasha. Classical texts state:"The native attains the highest fortune, wisdom, wealth, and spiritual merit." Maximum fortune, wisdom, and spiritual blessings manifest. Wealth accumulation is strong and steady. Children prosper and bring honor. Teaching, philosophy, and dharmic activities reach their peak. Divine grace is felt tangibly. Birth of children, promotion, or spiritual initiation is possible.',
    Venus: 'Love, luxury, and good fortune combine beautifully. Classical texts state:"The native obtains fine clothes, ornaments, jewels, and the company of beautiful women." Marriage receives blessings and harmony deepens. Financial abundance flows through multiple sources. Artistic and creative ventures succeed spectacularly. Social status elevates. Purchase of vehicles, jewelry, and luxury items is favorable.',
    Saturn: 'Patience required despite good underlying fortune. Classical texts state:"Results are delayed but come eventually through righteous effort." Delayed but significant rewards arrive. Career growth through steady, persistent effort. Health needs attention, especially digestive and liver issues. Charitable activities bring karmic merit and satisfaction. Service to the elderly and poor is highly recommended.',
    Rahu: 'Expansion through unconventional paths. Per classical texts: "The native may face confusion from false advisors but gains through foreign connections." Foreign connections bring fortune. Technology investments may yield returns. Guard against over-expansion and false gurus. Wisdom must guide ambition. International travel or business with overseas entities is likely.',
    Ketu: 'Spiritual fortune and past-life blessings activate. Classical texts state:"The native develops detachment and gains through spiritual merit." Deep philosophical understanding emerges naturally. Material detachment paradoxically brings unexpected gains. Meditation and spiritual practices become profoundly meaningful. Interest in ancient scriptures, astrology, and moksha-related subjects intensifies.',
  },
  Venus: {
    Sun: 'Creative authority and romantic leadership emerge. Classical texts state:"The native gains fame, royal favor, and association with cultured persons." Career in arts or entertainment is favored. Marriage receives positive attention. Financial comfort through prestigious sources. Social standing improves considerably.',
    Moon: 'Emotional beauty and creative nurturing define this period. Classical texts state:"The native acquires white garments, gems, and the company of loving women." Romantic relationships deepen. Artistic expression reaches emotional depths. Financial gains through women, public-facing ventures, or the hospitality industry.',
    Mars: 'Passionate creativity and relationship intensity increase. Classical texts state:"The native acquires landed property and conveyances but may face quarrels." Property related to luxury succeeds. Artistic ventures require bold initiative. Marriage may experience both passion and occasional friction. Physical energy enhances creative output.',
    Mercury: 'Artistic intellect and business creativity flourish brilliantly. Classical texts state:"The native gains through trade in luxury goods, fine arts, and skilled communication." Financial gains through creative communication. Fashion, design, and media ventures succeed. Social networking brings business opportunities. Learning music or fine arts is highly favorable.',
    Jupiter: 'Love, wisdom, and abundance create a supremely blessed period. Classical texts state:"The native obtains wealth, children, and fulfillment of all desires through righteous means." Marriage harmony reaches its peak. Financial prosperity flows abundantly. Children bring joy and pride. Creative ventures achieve lasting recognition. Spiritual practices become devotional and beautiful.',
    Venus: 'Maximum relationship harmony and luxury during this peak period. Classical texts state:"The native enjoys the finest comforts, vehicles, ornaments, and romantic fulfillment." Peak creative expression and artistic achievement. Financial abundance through beauty, arts, and pleasure industries. Social life flourishes magnificently. Marriage celebrations, anniversaries, and romantic milestones are indicated.',
    Saturn: 'Relationships require patience and commitment. Per classical texts: "Delays in love matters but lasting bonds form." Creative disciplines bear fruit over time. Financial investments in art or property need careful planning. Vehicle-related matters need attention. Older or mature romantic connections may form.',
    Rahu: 'Unconventional romantic experiences arise. Classical texts state:"The native may face confusion in love but gains through foreign artistic connections." Foreign connections in arts and beauty sectors. Technology in creative fields offers opportunities. Guard against excessive indulgence and material obsession. International fashion or entertainment connections may develop.',
    Ketu: 'Spiritual beauty and inner creativity emerge. Classical texts state:"The native develops detachment from sensual pleasures and finds deeper meaning." Detachment from superficial relationships brings peace. Artistic expression becomes more spiritual and meaningful. Past relationship patterns resolve. Interest in devotional music, sacred art, or spiritual aesthetics grows.',
  },
  Saturn: {
    Sun: 'Authority tested through discipline and hardship. Career advancement requires extreme patience. Government matters face delays. Father may face health challenges. Maintain faith through difficulties.',
    Moon: 'Emotional resilience is tested. Mental peace requires conscious effort. Mother may need support. Career responsibilities feel heavy. Practice meditation and emotional self-care diligently.',
    Mars: 'Obstacles require courage and determination. Property matters face challenges. Physical health needs monitoring. Conflicts with authority or siblings may arise. Channel frustration into productive work.',
    Mercury: 'Intellectual discipline bears fruit despite challenges. Business faces obstacles requiring careful navigation. Communication must be precise and cautious. Long-term educational goals require persistence.',
    Jupiter: 'Wisdom helps navigate difficulties. Fortune gradually improves through the period. Career growth through service and dedication. Spiritual practices bring solace. Charitable activities create positive karma.',
    Venus: 'Relationships face tests of commitment. Financial challenges require disciplined management. Creative work may face blocks but perseverance pays off. Vehicle and luxury items need careful maintenance.',
    Saturn: 'The most disciplined and testing period. Career demands reach their peak. Health, especially chronic conditions, needs close attention. Patience and perseverance are absolutely essential. Long-term investments pay off.',
    Rahu: 'Unexpected obstacles create confusion. Foreign connections bring mixed results. Technology offers solutions to practical problems. Guard against depression and isolation. Seek support from trusted advisors.',
    Ketu: 'Spiritual discipline and karmic lessons intensify. Past life debts come due for resolution. Health requires alternative approaches. Detachment from material struggles brings unexpected peace and liberation.',
  },
  Rahu: {
    Sun: 'Ambition meets authority in challenging ways. Government matters require diplomacy. Unconventional career paths may open. Guard against ego conflicts. Health needs monitoring for sudden issues.',
    Moon: 'Emotional confusion from unexpected sources. Foreign travel or connections affect personal life. Mother may need attention. Practice grounding techniques and emotional awareness diligently.',
    Mars: 'Bold unconventional actions bring mixed results. Property through unusual channels possible. Guard against accidents and legal issues. Channel aggressive energy into innovative ventures.',
    Mercury: 'Innovative thinking and technology excel. Business through unconventional methods succeeds. Foreign communications bring opportunities. Guard against misinformation. Research and investigation produce breakthroughs.',
    Jupiter: 'Expansion through unconventional wisdom. Foreign educational opportunities arise. Wealth through innovation and technology. Guard against false spiritual paths. Charitable technology ventures succeed.',
    Venus: 'Unusual romantic experiences and creative ventures. Foreign connections in arts and luxury. Technology in creative fields offers great opportunities. Guard against relationship confusion and material obsession.',
    Saturn: 'Unexpected delays and obstacles test patience. Foreign work connections may bring hardship before reward. Technology solutions for long-term problems. Practice discipline amid chaos and uncertainty.',
    Rahu: 'Maximum intensity of transformation and change. Foreign connections dominate. Technology and innovation are key themes. Guard against obsession, addiction, and deception. Maintain strong ethical foundations.',
    Ketu: 'Spiritual transformation through unexpected means. Past-life connections surface powerfully. Health requires holistic approaches. Meditation brings profound insights. Let go of material attachments gracefully.',
  },
  Ketu: {
    Sun: 'Spiritual authority emerges. Detachment from worldly status brings inner peace. Father may face challenges. Health needs attention for mysterious ailments. Past-life leadership patterns resolve.',
    Moon: 'Emotional detachment and spiritual sensitivity increase. Mother provides spiritual support. Intuitive abilities heighten. Mental peace comes through letting go. Water and moon-related practices help.',
    Mars: 'Spiritual courage and warrior energy combine. Property matters may face unexpected resolutions. Physical health requires attention. Past-life aggression patterns resolve through conscious effort.',
    Mercury: 'Intuitive intelligence and spiritual communication develop. Research into mystical subjects succeeds. Business may face confusion but spiritual insights bring unexpected solutions.',
    Jupiter: 'Spiritual wisdom reaches profound depths. Past-life blessings manifest. Financial detachment brings unexpected abundance. Teaching spiritual subjects is highly favored. Divine grace is strongly felt.',
    Venus: 'Spiritual love and creative transcendence emerge. Relationships transform on deeper levels. Artistic expression becomes more spiritual. Material comforts may decrease but inner beauty increases.',
    Saturn: 'Karmic discipline and spiritual endurance are tested. Chronic issues may surface for final resolution. Career may face setbacks but spiritual growth accelerates. Practice patience and acceptance.',
    Rahu: 'Intense spiritual transformation through crisis. Past and future karmic threads interweave. Health requires holistic attention. Meditation and spiritual practices are essential for navigating this period.',
    Ketu: 'Maximum spiritual intensity and liberation potential. Past-life patterns fully surface for resolution. Material world recedes in importance. Meditation produces extraordinary experiences. Complete spiritual renewal is possible.',
  },
};

/**
 * Generate 35-year dasha prediction summary from enhanced dasha data
 */
export function generateDashaPredictions(enhancedDashas: DashaWithAntardasha[]): DashaPredictionEntry[] {
  const results: DashaPredictionEntry[] = [];

  for (const maha of enhancedDashas) {
    if (!maha.antardashas || maha.antardashas.length === 0) continue;

    for (const antar of maha.antardashas) {
      const prediction = ANTAR_EFFECTS[maha.planet]?.[antar.planet] ||
        `During the ${maha.planet}/${antar.planet} period, the combined influence of ${MAHA_CONTEXT[maha.planet]?.theme || 'planetary energies'} and ${MAHA_CONTEXT[antar.planet]?.theme || 'sub-period influences'} shapes your experiences. Focus on ${MAHA_CONTEXT[antar.planet]?.focus?.[0] || 'balanced living'} and ${MAHA_CONTEXT[antar.planet]?.focus?.[1] || 'personal growth'} during this time.`;

      results.push({
        mahadasha: maha.planet,
        antardasha: antar.planet,
        startYear: antar.startYear,
        endYear: antar.endYear,
        startMonth: String(antar.startMonth || 'Jan'),
        endMonth: String(antar.endMonth || 'Dec'),
        prediction,
        rating: maha.rating,
        isCurrent: antar.isCurrent,
      });
    }
  }

  return results;
}
