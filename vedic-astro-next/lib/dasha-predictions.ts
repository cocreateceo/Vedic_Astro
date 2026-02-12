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
const MAHA_CONTEXT: Record<string, { theme: string; focus: string[] }> = {
  Sun: { theme: 'authority, government, and self-expression', focus: ['career recognition', 'health vitality', 'paternal relationships', 'leadership roles'] },
  Moon: { theme: 'emotions, public life, and nurturing', focus: ['mental peace', 'maternal bonds', 'creative endeavors', 'travel and public dealings'] },
  Mars: { theme: 'courage, property, and physical energy', focus: ['land and property', 'sibling relations', 'competitive success', 'physical health'] },
  Mercury: { theme: 'intellect, commerce, and communication', focus: ['business ventures', 'education', 'writing and speech', 'analytical work'] },
  Jupiter: { theme: 'wisdom, fortune, and spiritual growth', focus: ['wealth accumulation', 'children', 'teaching and learning', 'dharmic pursuits'] },
  Venus: { theme: 'love, luxury, and artistic expression', focus: ['marriage harmony', 'financial comfort', 'creative arts', 'social pleasures'] },
  Saturn: { theme: 'discipline, karma, and endurance', focus: ['career building', 'chronic health', 'service to others', 'long-term investments'] },
  Rahu: { theme: 'ambition, foreign connections, and transformation', focus: ['unconventional gains', 'technology', 'foreign travel', 'sudden changes'] },
  Ketu: { theme: 'spirituality, detachment, and past karma', focus: ['spiritual insight', 'letting go', 'healing', 'mystical experiences'] },
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
    Sun: 'Fortune and authority create an auspicious period. Government recognition and career elevation are likely. Father provides wise counsel. Health and vitality improve. Spiritual confidence grows.',
    Moon: 'Emotional wisdom and good fortune align. Public reputation soars. Mother provides blessings. Creative ventures succeed. Children bring immense joy. Travel to sacred places is indicated.',
    Mars: 'Fortune favors the brave during this period. Property acquisitions succeed. Legal victories are possible. Children show courage and initiative. Physical vitality combines with good luck.',
    Mercury: 'Wisdom and intellect create powerful combinations. Business expansion through knowledge succeeds. Educational milestones achieved. Financial gains through consultancy or advisory roles. Communication carries authority.',
    Jupiter: 'The most auspicious sub-period. Maximum fortune, wisdom, and spiritual blessings. Wealth accumulation is strong. Children prosper. Teaching, philosophy, and dharmic activities reach their peak. Divine grace is felt.',
    Venus: 'Love, luxury, and good fortune combine beautifully. Marriage receives blessings. Financial abundance through multiple sources. Artistic and creative ventures succeed spectacularly. Social status elevates.',
    Saturn: 'Patience required despite good underlying fortune. Delayed but significant rewards arrive. Career growth through steady effort. Health needs attention. Charitable activities bring karmic merit and satisfaction.',
    Rahu: 'Expansion through unconventional paths. Foreign connections bring fortune. Technology investments may yield returns. Guard against over-expansion and false gurus. Wisdom must guide ambition.',
    Ketu: 'Spiritual fortune and past-life blessings activate. Deep philosophical understanding emerges. Material detachment brings unexpected gains. Meditation and spiritual practices become profoundly meaningful.',
  },
  Venus: {
    Sun: 'Creative authority and romantic leadership emerge. Career in arts or entertainment is favored. Marriage receives positive attention. Financial comfort through prestigious sources. Social standing improves.',
    Moon: 'Emotional beauty and creative nurturing define this period. Romantic relationships deepen. Artistic expression reaches emotional depths. Financial gains through women or public-facing ventures.',
    Mars: 'Passionate creativity and relationship intensity increase. Property related to luxury succeeds. Artistic ventures require bold initiative. Marriage may experience both passion and occasional friction.',
    Mercury: 'Artistic intellect and business creativity flourish. Financial gains through creative communication. Fashion, design, and media ventures succeed. Social networking brings business opportunities.',
    Jupiter: 'Love, wisdom, and abundance create a blessed period. Marriage harmony reaches its peak. Financial prosperity through righteous means. Children bring joy and pride. Creative ventures achieve recognition.',
    Venus: 'Maximum relationship harmony and luxury. Peak creative expression and artistic achievement. Financial abundance through beauty, arts, and pleasure industries. Social life flourishes magnificently.',
    Saturn: 'Relationships require patience and commitment. Creative disciplines bear fruit over time. Financial investments in art or property need careful planning. Vehicle-related matters need attention.',
    Rahu: 'Unconventional romantic experiences arise. Foreign connections in arts and beauty sectors. Technology in creative fields offers opportunities. Guard against excessive indulgence and material obsession.',
    Ketu: 'Spiritual beauty and inner creativity emerge. Detachment from superficial relationships brings peace. Artistic expression becomes more spiritual and meaningful. Past relationship patterns resolve.',
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
