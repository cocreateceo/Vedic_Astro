/**
 * Monthly Predictions Generator
 *
 * Generates rich, personalized monthly predictions based on Vedic astrology principles.
 * Uses a composable template system to produce varied output while keeping file size manageable.
 * Content is deterministic per month + moon sign combination via seed-based selection.
 */

import {
  VedicChart,
  MonthlyPrediction,
  MonthlyPhase,
  AuspiciousDate,
  InauspiciousDate,
  MonthlyTransit,
} from '@/types';
import { rashiDetails } from '@/lib/horoscope-data';

// ---------- Seed-based utility ----------

function seededPick<T>(arr: T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------- Composable Overview System ----------

const openingPhrases: Record<string, string[]> = {
  Fire: [
    'This month ignites a powerful wave of energy in your chart, awakening ambition and drive.',
    'The cosmic fires burn bright for you this month, fueling passion and creative force.',
    'A surge of Agni tattva propels you forward, making this month ripe for bold action.',
    'Mars and the fire element rally behind you, granting courage and renewed vitality.',
    'The celestial flames illuminate your path, offering clarity and the will to act decisively.',
  ],
  Earth: [
    'This month anchors you in Prithvi tattva, bringing stability and tangible progress.',
    'The earthy energies of your chart ground your ambitions, making steady gains possible.',
    'Practical matters come into focus as the cosmic earth element strengthens your foundations.',
    'A period of consolidation begins, where patience and persistence become your greatest allies.',
    'The planets encourage a grounded approach, rewarding disciplined effort with lasting results.',
  ],
  Air: [
    'This month sends a refreshing breeze through your chart, opening channels of communication.',
    'Vayu tattva energizes your intellect, making this a month of ideas, connections, and movement.',
    'The air element carries new information and social opportunities directly to your doorstep.',
    'Mental agility reaches a peak as the cosmic winds favor learning, networking, and adaptation.',
    'Currents of change sweep through, inviting you to explore, communicate, and innovate.',
  ],
  Water: [
    'This month deepens your emotional waters, heightening intuition and inner awareness.',
    'Jala tattva flows through your chart, bringing sensitivity, creativity, and spiritual depth.',
    'The cosmic tides turn in your favor, nourishing the emotional and imaginative dimensions of life.',
    'Feelings run deeper than usual as the water element amplifies empathy and psychic receptivity.',
    'A month of emotional richness awaits, where dreams, instincts, and compassion guide your way.',
  ],
};

const middleContent: Record<string, string[]> = {
  general_Fire: [
    'Leadership opportunities surface naturally, and others look to you for direction. Channel this dynamic energy into constructive projects rather than scattered pursuits.',
    'Your competitive spirit attracts both challenges and victories. The key is choosing your battles wisely and letting minor provocations pass.',
    'Physical vitality is high, making this an ideal time for fitness goals or athletic endeavors. Your stamina supports longer working hours when needed.',
    'Pioneering ideas take shape in your mind. Act on them before the momentum fades, but secure the basics before leaping into the unknown.',
    'Relationships with authority figures improve as you demonstrate initiative. Recognition for past efforts may arrive in unexpected forms.',
  ],
  general_Earth: [
    'Financial planning and investment decisions are well-starred. Take stock of your resources and allocate them toward long-term security.',
    'Home and property matters demand attention but reward effort. Repairs, renovations, or real estate dealings move in your favor.',
    'Your reputation for reliability attracts new responsibilities. Accept them selectively to avoid overcommitment.',
    'Material comforts improve gradually. Purchases made this month tend to bring lasting satisfaction rather than fleeting pleasure.',
    'Routine and structure serve you well. Establishing or refining daily habits produces compounding benefits over time.',
  ],
  general_Air: [
    'Social calendars fill up quickly. Each interaction carries the potential for a meaningful connection or a useful piece of information.',
    'Writing, teaching, or presenting ideas to groups yields favorable outcomes. Your words carry extra persuasive power.',
    'Short trips or local explorations prove surprisingly rewarding. Keep your schedule flexible enough to seize spontaneous invitations.',
    'Technology and digital platforms become important channels for growth. Updating skills or tools pays dividends later.',
    'Intellectual curiosity leads you down fascinating paths. Follow the threads that genuinely excite you rather than spreading yourself thin.',
  ],
  general_Water: [
    'Family bonds strengthen through shared experiences and heartfelt conversations. Healing old misunderstandings becomes possible now.',
    'Creative and artistic expression flows effortlessly. Music, painting, writing, or any imaginative pursuit becomes deeply fulfilling.',
    'Spiritual practices deepen and offer genuine solace. Meditation, prayer, or temple visits bring clarity to confused situations.',
    'Dreams and subtle impressions carry valid guidance. Keep a journal to track recurring symbols and themes.',
    'Compassionate acts create ripple effects far beyond what you can see. Service to others simultaneously serves your own soul growth.',
  ],
  career_Fire: [
    'Professional momentum builds rapidly. Seize the initiative on stalled projects and demonstrate the bold leadership others expect from you.',
    'Competitive environments bring out your best performance. A rivalry or challenge at work sharpens your skills and reveals hidden strengths.',
    'Entrepreneurial energy runs high. If you have been planning a venture, the cosmic climate supports taking the first concrete steps.',
    'Presentations and public-facing roles go well. Your confidence and enthusiasm are contagious and win over skeptics.',
    'Authority figures notice your drive and reward it. Promotions, raises, or new responsibilities align with your ambitions.',
  ],
  career_Earth: [
    'Systematic effort at work produces tangible results this month. Colleagues appreciate your thoroughness and dependability.',
    'Financial negotiations and salary discussions are favored. Present your case with facts and figures for the best outcome.',
    'Long-term career strategies crystallize. This is a month for building infrastructure rather than chasing quick wins.',
    'Collaborations with practical-minded individuals prove fruitful. Joint ventures benefit from your organizational skills.',
    'Quality of work matters more than speed now. Take time to polish deliverables and the recognition will follow.',
  ],
  career_Air: [
    'Networking events and professional gatherings yield promising leads. Exchange ideas freely and follow up promptly.',
    'Communication-heavy roles thrive. Writing proposals, drafting reports, or leading meetings all go smoothly.',
    'Learning new skills or earning certifications enhances your market value. Invest time in professional development.',
    'Multiple opportunities may arrive simultaneously. Prioritize based on long-term alignment rather than immediate appeal.',
    'Team brainstorming sessions produce creative solutions. Your ability to synthesize diverse viewpoints earns respect.',
  ],
  career_Water: [
    'Intuition guides career decisions more reliably than data alone. Trust your gut feeling about people and opportunities.',
    'Roles involving counseling, healing, or caregiving flourish. Your empathic nature becomes a professional asset.',
    'Creative industries and artistic projects receive favorable cosmic support. Let inspiration guide your professional output.',
    'Behind-the-scenes work yields surprisingly powerful results. Strategic patience outperforms aggressive self-promotion.',
    'Workplace relationships deepen through genuine care. Colleagues become allies when you show authentic concern for their well-being.',
  ],
  love_Fire: [
    'Passion and excitement characterize romantic encounters. Express your feelings boldly and your partner responds with equal warmth.',
    'New attractions carry an electric quality. Singles may meet someone who matches their energy and ambition.',
    'Adventurous dates and spontaneous getaways rekindle the spark in established relationships. Break the routine together.',
    'Honest and direct communication about desires strengthens bonds. Avoid game-playing in favor of authentic expression.',
    'Physical chemistry reaches a peak. Channel this intensity into meaningful connection rather than fleeting encounters.',
  ],
  love_Earth: [
    'Stability and commitment deepen in existing partnerships. Practical gestures of love carry more weight than grand declarations.',
    'Building shared assets or planning future milestones together strengthens the relationship foundation.',
    'Sensual pleasures and shared comforts bring partners closer. Cook together, enjoy nature, or create a beautiful home space.',
    'Patience with a partner who is going through a difficult time earns lasting loyalty and deepens trust.',
    'Singles attract through reliability and groundedness. Someone who values substance over flash enters your orbit.',
  ],
  love_Air: [
    'Stimulating conversations become the gateway to deeper intimacy. Share your thoughts and listen actively to your partner.',
    'Social activities as a couple strengthen your bond. Attend events, meet friends, or explore cultural offerings together.',
    'Flirtation and playful banter keep relationships vibrant. Lightheartedness is the medicine for any recent tensions.',
    'Long-distance connections or online communication plays a positive role in your love life this month.',
    'Intellectual compatibility matters most now. Seek partners or deepen bonds with those who challenge your mind.',
  ],
  love_Water: [
    'Emotional vulnerability becomes your greatest strength in love. Opening your heart creates space for profound connection.',
    'Intuition about a partner or potential partner proves accurate. Pay attention to how people make you feel.',
    'Romantic gestures with emotional depth outshine material gifts. Write a heartfelt letter or share a meaningful memory.',
    'Healing past relationship wounds becomes possible through compassion and forgiveness, both given and received.',
    'Soulful connections transcend the ordinary. This is a month for love that touches the spirit, not just the heart.',
  ],
  health_Fire: [
    'High energy levels support ambitious fitness goals. Channel excess heat through vigorous exercise to prevent irritability.',
    'Head, face, and blood pressure need monitoring. Stay hydrated and avoid excessive spicy food this month.',
    'Competitive sports and martial arts offer therapeutic benefits. Your body craves dynamic movement and physical challenge.',
    'Inflammation-related issues may flare if you neglect rest. Balance intense activity with adequate recovery time.',
    'Morning sun salutations and pranayama regulate the fire element in your body, promoting balanced vitality.',
  ],
  health_Earth: [
    'Digestive health benefits from a regular eating schedule. Avoid eating on the run or skipping meals.',
    'Bone and joint health respond well to consistent, moderate exercise. Walking and yoga maintain structural strength.',
    'Skin and throat require extra care. Ayurvedic remedies and natural products work better than harsh chemicals.',
    'Weight management improves through disciplined routines rather than crash diets. Slow and steady wins this race.',
    'Grounding practices such as walking barefoot on earth, gardening, or forest bathing restore depleted energy reserves.',
  ],
  health_Air: [
    'Nervous system health deserves attention. Practice deep breathing and limit caffeine to maintain mental calm.',
    'Lung health improves with pranayama and outdoor exercise. Fresh air and open spaces recharge your vitality.',
    'Sleep quality may fluctuate with an overactive mind. Establish a calming bedtime routine and limit screen time.',
    'Shoulders, arms, and hands may carry tension. Regular stretching and massage prevent repetitive strain issues.',
    'Mental health thrives with social connection and intellectual stimulation, but avoid information overload.',
  ],
  health_Water: [
    'Emotional well-being directly affects physical health. Address stress and sadness promptly rather than suppressing them.',
    'Lymphatic and immune system health benefit from warm baths, gentle movement, and adequate sleep.',
    'Water intake should increase this month. Hydration supports kidney function and emotional equilibrium.',
    'Feet, ankles, and the reproductive system need mindful care. Comfortable footwear and regular check-ups help.',
    'Meditation and spiritual practice serve as powerful medicine. Inner peace radiates outward as physical wellness.',
  ],
  finance_Fire: [
    'Bold financial moves are favored, but only those backed by solid research. Impulsive spending leads to regret.',
    'Income from competitive fields, sports, or entrepreneurial ventures shows upward momentum.',
    'Investments in technology, energy, or defense-related sectors may catch your eye and reward decisive action.',
    'Avoid lending large sums on impulse. Generosity should be strategic, not reactive, this month.',
    'New revenue streams emerge through initiative and willingness to take calculated risks.',
  ],
  finance_Earth: [
    'Savings grow steadily through disciplined budgeting. Small daily economies compound into meaningful sums.',
    'Property and real estate transactions are well-starred. Due diligence ensures profitable outcomes.',
    'Fixed deposits, bonds, and conservative investments provide the security your chart favors this month.',
    'Material possessions gain value. Art, jewelry, or collectibles purchased now may appreciate over time.',
    'Financial partnerships and joint ventures benefit from your practical oversight and careful record-keeping.',
  ],
  finance_Air: [
    'Multiple income channels may open simultaneously. Evaluate each carefully before committing resources.',
    'Trading, communications, and media-related income streams show promise. Your analytical skills spot opportunities others miss.',
    'Financial advice from friends or social contacts proves surprisingly valuable. Listen with discernment.',
    'Digital assets, online businesses, or technology investments align with your charts cosmic direction.',
    'Spending on education, books, or skill-building tools is an investment that pays compounding returns.',
  ],
  finance_Water: [
    'Intuitive financial decisions outperform purely analytical ones. Trust your instincts about investments and purchases.',
    'Income from creative, healing, or spiritual work receives cosmic support. Monetize your unique gifts.',
    'Hidden financial matters come to light. Audit accounts, check for unclaimed funds, and review insurance policies.',
    'Charitable giving creates unexpected returns through karmic channels. Donate to causes that genuinely move you.',
    'Inheritance, insurance settlements, or spousal income may contribute positively to your overall financial picture.',
  ],
};

const closingPhrases: Record<string, string[]> = {
  Cardinal: [
    'Take the initiative early in the month and let momentum carry you through.',
    'Your natural ability to start things fresh serves you well. Set new intentions and act on them.',
    'Leadership energy peaks around the middle of the month. Step forward when the moment arrives.',
    'Quick decisions are favored over prolonged deliberation. Trust your instincts and move.',
    'The month rewards those who act rather than wait. Be the first mover in important matters.',
  ],
  Fixed: [
    'Consistency and perseverance are your superpowers. Stay the course even when results seem slow.',
    'Build on what you already have rather than chasing novelty. Deepening yields greater rewards than widening.',
    'Your determination sees you through any mid-month obstacles. Stubbornness becomes strength when applied wisely.',
    'Long-term commitments made this month carry lasting power. Choose carefully, then hold firm.',
    'The month rewards loyalty and staying power. Those who persist reap the richest harvests.',
  ],
  Dual: [
    'Flexibility and adaptability are your greatest assets. Embrace change as it arrives.',
    'The month asks you to balance two competing priorities. Your natural versatility handles this beautifully.',
    'Mid-month brings a shift in direction. Adjust your sails and discover a better route.',
    'Multiple paths converge toward the end of the month. Trust that variety enriches rather than scatters.',
    'Your ability to see both sides of any situation leads to wise compromises and creative solutions.',
  ],
};

// ---------- Phase Patterns and Predictions ----------

const phasePatterns: Record<string, { labels: string[]; energies: string[] }> = {
  Fire: {
    labels: ['Burst of Energy', 'Sustained Drive', 'Release and Reflect'],
    energies: ['high', 'steady', 'winding down'],
  },
  Earth: {
    labels: ['Building Foundations', 'Consolidating Gains', 'Harvesting Results'],
    energies: ['growing', 'stable', 'productive'],
  },
  Air: {
    labels: ['Exploring Possibilities', 'Making Connections', 'Synthesizing Ideas'],
    energies: ['expansive', 'dynamic', 'integrative'],
  },
  Water: {
    labels: ['Feeling the Currents', 'Flowing with Change', 'Deep Reflection'],
    energies: ['intuitive', 'fluid', 'introspective'],
  },
};

const phasePredictions: Record<string, string[][]> = {
  Fire: [
    [
      'The first ten days carry explosive potential. Channel your enthusiasm into the most important project on your plate and avoid scattering energy across too many fronts.',
      'A competitive situation early in the month tests your mettle. Rise to the occasion with confidence and you set the tone for the entire period ahead.',
      'Physical energy surges. Use the opening days for vigorous activity, gym routines, or outdoor adventures that stoke your inner fire.',
      'Initiating new ventures during this phase benefits from strong Mars-like energy. Lay the groundwork quickly while motivation is at its peak.',
      'The early days favor directness and courage. Speak your truth, make the first move, and trust that boldness attracts opportunity.',
    ],
    [
      'The middle stretch rewards sustained effort. The initial spark has caught, and now you must tend the flame with disciplined follow-through.',
      'Professional matters reach a critical juncture. Decisions made during these days shape results for the remainder of the month and beyond.',
      'Relationships require honest attention. Mid-month conversations clear the air and strengthen bonds that have been tested.',
      'Financial negotiations and investment decisions are best handled during this focused phase. Your judgment is sharp and your timing is sound.',
      'Physical stamina remains strong but needs intelligent management. Alternate intense days with lighter recovery periods.',
    ],
    [
      'The final days invite reflection on what you have ignited. Assess progress honestly and adjust plans for the next cycle.',
      'Winding down does not mean stopping. Shift from action to strategy, reviewing lessons learned and consolidating gains.',
      'Social and spiritual activities bring renewal. Spend time with friends, mentors, or in contemplative practice.',
      'Rest and recovery become essential. Pushing through fatigue now leads to burnout later. Honor your body and mind.',
      'Gratitude for the months accomplishments opens the door to even greater abundance in the cycle ahead.',
    ],
  ],
  Earth: [
    [
      'The opening days are ideal for laying practical foundations. Budget, plan, organize, and prepare the ground for what you intend to build.',
      'Material concerns demand attention early on. Address financial obligations, repair what is broken, and invest in quality over quantity.',
      'Routine establishment during these first days sets the rhythm for the entire month. Structure is your friend, not your cage.',
      'Property, land, or home-related matters benefit from early action. Inspect, negotiate, and secure deals while conditions favor you.',
      'Health-related discipline instituted now produces visible results by month end. Start the new regimen without delay.',
    ],
    [
      'Mid-month is your power zone. The groundwork is laid and you are building momentum. Double down on what is working.',
      'Collaborative projects benefit from your steady hand. Partners and colleagues rely on your organizational clarity.',
      'Financial returns begin to materialize. Investments and efforts from earlier in the month show promising early signs.',
      'Professional reputation strengthens through consistent delivery. Let your track record speak louder than any self-promotion.',
      'Emotional stability anchors you through any mid-month turbulence. Your calm presence reassures those around you.',
    ],
    [
      'The closing days bring the harvest. Review what you have planted and nurtured, and enjoy the tangible results of your effort.',
      'Financial auditing and planning for the next month are well-suited to this phase. Know exactly where you stand.',
      'Share your achievements with loved ones. Celebration and acknowledgment reinforce the positive patterns you have built.',
      'Rest is productive, not lazy. Allow yourself to recharge so the next cycle begins from a position of strength.',
      'Gratitude for material blessings aligns you with the cosmic principle of abundance. Count your blessings literally.',
    ],
  ],
  Air: [
    [
      'The opening days bring a flurry of ideas and invitations. Sort through them quickly and commit to the most promising.',
      'Communication channels buzz with activity. Emails, calls, and messages carry opportunities hidden in casual conversation.',
      'Short trips or local explorations during the first phase yield surprisingly valuable connections and insights.',
      'Learning something new early in the month provides tools and perspectives that serve you throughout the remaining weeks.',
      'Social energy is abundant. Use the first phase for networking, reconnecting with old contacts, and making fresh introductions.',
    ],
    [
      'The middle phase asks you to deepen the connections made earlier. Move from surface-level interaction to meaningful collaboration.',
      'Intellectual projects reach a productive stride. Writing, studying, or problem-solving flows with unusual ease.',
      'Travel plans crystallize. Whether for business or pleasure, mid-month journeys carry extra significance.',
      'Negotiations and deal-making benefit from your enhanced communication skills. Present your case with clarity and charm.',
      'Information gathered during this phase proves crucial for decisions you will face later. Pay attention and take notes.',
    ],
    [
      'The final days call for synthesis. Gather the threads of conversation, learning, and experience into a coherent understanding.',
      'Share what you have learned with others. Teaching reinforces your own knowledge and builds community.',
      'Reflect on which connections truly served your growth and which merely consumed time. Quality over quantity prevails.',
      'Journaling, mind-mapping, or creative writing during the closing phase captures insights that might otherwise slip away.',
      'Mental rest is as important as physical rest. Quiet the mind before the new cycle begins to ensure fresh clarity.',
    ],
  ],
  Water: [
    [
      'The opening days bring heightened emotional awareness. Honor your feelings as valid data points, not obstacles to logic.',
      'Family and home life demand gentle attention early in the month. Small acts of care create disproportionately large effects.',
      'Creative inspiration surges during the first phase. Capture ideas in whatever medium calls to you before the rational mind edits them.',
      'Spiritual sensitivity peaks. Meditation, prayer, or temple visits in the opening days set a sacred tone for the entire month.',
      'Intuitive impressions about people and situations prove remarkably accurate. Trust your inner knowing even when it defies external evidence.',
    ],
    [
      'The middle phase brings emotional depth to relationships. Conversations about feelings, needs, and dreams create lasting intimacy.',
      'Creative projects enter a productive flow state. Surrender to the process and let the art create itself through you.',
      'Financial intuition guides sound decisions. That nagging feeling about an investment or expense deserves your respect.',
      'Healing of old emotional wounds becomes possible during this phase. What you face now loses its power to haunt you later.',
      'Dreams carry messages. Pay special attention to recurring symbols, unusual visitors, and vivid scenarios during mid-month nights.',
    ],
    [
      'The closing days invite deep introspection. Retreat from the noise of the world and listen to the wisdom within.',
      'Compassionate acts during this phase carry profound karmic weight. Give generously of your time, attention, and resources.',
      'Spiritual practice deepens naturally. The veil between the material and the divine grows thin as the month concludes.',
      'Emotional cleansing occurs through tears, laughter, or creative expression. Let whatever wants to move through you flow freely.',
      'Forgiveness, both given and received, lightens the soul and prepares you for a fresh emotional beginning.',
    ],
  ],
};

// ---------- Transit Templates ----------

const transitTemplates: MonthlyTransit[][] = [
  [
    { planet: 'Jupiter', event: 'Jupiter continues through your prosperity sector', date: 'All month', impact: 'Financial growth and spiritual wisdom are amplified throughout the period', isPositive: true },
    { planet: 'Saturn', event: 'Saturn steadies your discipline house', date: 'All month', impact: 'Long-term commitments solidify and karmic lessons become clearer', isPositive: true },
    { planet: 'Rahu', event: 'Rahu intensifies desires in your ambition axis', date: 'All month', impact: 'Worldly ambitions surge but require ethical grounding to yield lasting results', isPositive: false },
  ],
  [
    { planet: 'Venus', event: 'Venus transits your relationship sector', date: '1st-15th', impact: 'Romantic harmony and social grace enhance all partnerships', isPositive: true },
    { planet: 'Mars', event: 'Mars energizes your action house', date: '10th-30th', impact: 'Drive and courage increase, but watch for impulsive conflicts', isPositive: true },
    { planet: 'Mercury', event: 'Mercury sharpens your communication axis', date: '5th-25th', impact: 'Business negotiations, writing, and learning are strongly favored', isPositive: true },
    { planet: 'Ketu', event: 'Ketu deepens spiritual inclinations', date: 'All month', impact: 'Detachment from material excess opens doors to inner peace', isPositive: true },
  ],
  [
    { planet: 'Saturn', event: 'Saturn aspects your career house from its current position', date: 'All month', impact: 'Professional responsibilities increase but build lasting reputation', isPositive: true },
    { planet: 'Jupiter', event: 'Jupiter blesses your ninth house of fortune', date: 'All month', impact: 'Higher learning, travel, and guru blessings bring expansion', isPositive: true },
    { planet: 'Rahu', event: 'Rahu creates restless energy in your emotional axis', date: 'All month', impact: 'Unusual desires or obsessions need conscious management', isPositive: false },
    { planet: 'Mars', event: 'Mars activates your wealth house mid-month', date: '12th-28th', impact: 'Income potential rises through bold action and competitive drive', isPositive: true },
  ],
  [
    { planet: 'Mercury', event: 'Mercury enters your skill and learning sector', date: '1st-20th', impact: 'Analytical thinking peaks, ideal for study, exams, and documentation', isPositive: true },
    { planet: 'Venus', event: 'Venus graces your home and happiness sector', date: '8th-30th', impact: 'Domestic harmony, property gains, and artistic home improvements are favored', isPositive: true },
    { planet: 'Saturn', event: 'Saturn continues its slow transit through your effort house', date: 'All month', impact: 'Hard work is unavoidable but builds character and long-term security', isPositive: true },
  ],
  [
    { planet: 'Jupiter', event: 'Jupiter expands your social and gains sector', date: 'All month', impact: 'Friendships, community involvement, and income from networks all grow', isPositive: true },
    { planet: 'Rahu', event: 'Rahu amplifies ambition in your tenth house', date: 'All month', impact: 'Career breakthroughs are possible but ethical shortcuts must be avoided', isPositive: false },
    { planet: 'Venus', event: 'Venus brings charm to your public image', date: '5th-22nd', impact: 'Social reputation and personal attractiveness receive a pleasant boost', isPositive: true },
    { planet: 'Mars', event: 'Mars tests patience in your relationship axis', date: '15th-30th', impact: 'Partnerships require extra diplomacy as assertive energy runs high', isPositive: false },
  ],
];

// ---------- Monthly Remedies per Sign ----------

const monthlyRemedies: Record<number, string[]> = {
  0: [
    'Observe a fast on Tuesdays throughout the month and donate red lentils to strengthen Mars',
    'Recite Hanuman Chalisa daily for the entire month to receive protection and courage from Mangal',
    'Offer water mixed with red sandalwood paste to the Sun every morning at sunrise',
    'Donate jaggery and wheat to the needy on Sundays for vitality and health throughout the month',
    'Light a ghee lamp at a Hanuman temple every Tuesday evening for obstacle removal',
  ],
  1: [
    'Offer white flowers and rice to Goddess Lakshmi every Friday for material blessings this month',
    'Recite Sri Sukta daily to attract prosperity and harmonious relationships throughout the period',
    'Wear a white or cream outfit on Fridays and donate white sweets to young women',
    'Apply sandalwood tilak each morning and chant Venus beej mantra 16 times for inner peace',
    'Observe a fast on Ekadashi days this month for spiritual purification and material stability',
  ],
  2: [
    'Recite Vishnu Sahasranama every Wednesday morning to sharpen intellect and calm the mind',
    'Donate green vegetables and books to students on Wednesdays for Buddhas blessings',
    'Keep a Tulsi plant near your study or workspace and water it daily with reverence',
    'Practice Pranayama for at least fifteen minutes each morning to stabilize scattered mental energy',
    'Wear green on Wednesdays and offer Durva grass to Lord Ganesha for wisdom and focus',
  ],
  3: [
    'Observe a fast on Mondays and offer milk to a Shiva Lingam for emotional balance',
    'Recite Chandra beej mantra 108 times on Monday evenings under moonlight when possible',
    'Donate white rice, milk, or silver items to those in need on Mondays for Chandras grace',
    'Keep a bowl of clean water with white flowers on your altar to strengthen the Moon in your chart',
    'Honor your mother or a maternal figure with special attention and care throughout this month',
  ],
  4: [
    'Offer water to the rising Sun every morning while chanting Surya beej mantra seven times',
    'Perform twelve rounds of Surya Namaskar daily to maintain vitality and confidence',
    'Donate wheat, jaggery, or copper items on Sundays to strengthen the Sun in your chart',
    'Light a ghee lamp before a picture of Lord Shiva every evening for protection and sovereignty',
    'Recite Aditya Hridayam on Sundays for overall spiritual and material empowerment this month',
  ],
  5: [
    'Recite Budha beej mantra nine times every morning after bathing for analytical clarity',
    'Donate to health-related charities or volunteer at a medical facility during this month',
    'Keep your living and working spaces meticulously clean and organized for Mercurys blessings',
    'Observe a partial fast on Wednesdays, eating only sattvic vegetarian food for purification',
    'Offer green moong dal and fruit to Lord Vishnu on Wednesdays for physical and mental health',
  ],
  6: [
    'Offer white flowers, camphor, and sweets to Goddess Lakshmi every Friday for harmony',
    'Recite Shukra beej mantra 16 times each morning to attract balanced relationships and beauty',
    'Donate white clothing or sugar to those in need on Fridays for Venus-related blessings',
    'Practice forgiveness meditation each evening, consciously releasing any grudges or resentments',
    'Wear diamond or opal on the ring finger of your right hand set in silver for Venusian strength',
  ],
  7: [
    'Recite Mangal beej mantra eleven times daily and offer red flowers at a Hanuman temple on Tuesdays',
    'Practice deep meditation or Yoga Nidra daily to channel intense Scorpionic energy constructively',
    'Donate blood if medically eligible, or donate to blood banks, as service to Mars this month',
    'Observe a fast on Tuesdays and consume only fruits and milk for transformative spiritual power',
    'Light a mustard oil lamp at a Shani temple on Saturdays for protection against hidden enemies',
  ],
  8: [
    'Recite Guru beej mantra nineteen times every Thursday morning for expansion and wisdom',
    'Donate yellow items such as turmeric, bananas, or yellow cloth to Brahmins on Thursdays',
    'Study a sacred text or philosophical work for at least thirty minutes daily this month',
    'Feed sweet rice or yellow laddoos to the poor on Thursdays to strengthen Jupiters blessings',
    'Visit a place of higher learning or spiritual significance during this month for cosmic alignment',
  ],
  9: [
    'Recite Shani beej mantra 23 times every Saturday morning for discipline and karmic protection',
    'Donate sesame seeds, iron items, or dark blue clothing to the needy on Saturdays',
    'Serve elderly people or those with disabilities as sacred service to Lord Shani this month',
    'Light a sesame oil lamp under a Peepal tree on Saturday evenings for Saturns blessings',
    'Observe a fast on Saturdays consuming only one meal of simple food for inner strength',
  ],
  10: [
    'Recite Shani beej mantra 23 times on Saturday mornings and donate to humanitarian causes',
    'Serve the underprivileged or volunteer at a community organization every week this month',
    'Meditate on universal brotherhood and compassion for fifteen minutes each morning',
    'Donate dark blue or violet clothing and iron utensils on Saturdays for Saturns grace',
    'Practice detachment through mindful observation of your desires without acting impulsively',
  ],
  11: [
    'Recite Guru beej mantra nineteen times daily and offer yellow flowers at a Vishnu temple on Thursdays',
    'Practice meditation or spiritual sadhana for at least thirty minutes daily throughout this month',
    'Donate to animal shelters or feed stray animals as compassionate service to Jupiter',
    'Offer prayers at a water body such as a river, lake, or ocean for spiritual cleansing on Mondays',
    'Observe Ekadashi fasts this month and spend the day in contemplation, reading, or chanting',
  ],
};

// ---------- Mantra per Sign ----------

const signMantras: Record<number, string> = {
  0: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
  1: 'Om Draam Dreem Draum Sah Shukraya Namah',
  2: 'Om Braam Breem Braum Sah Budhaya Namah',
  3: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
  4: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
  5: 'Om Braam Breem Braum Sah Budhaya Namah',
  6: 'Om Draam Dreem Draum Sah Shukraya Namah',
  7: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
  8: 'Om Graam Greem Graum Sah Gurave Namah',
  9: 'Om Praam Preem Praum Sah Shanaischaraya Namah',
  10: 'Om Praam Preem Praum Sah Shanaischaraya Namah',
  11: 'Om Graam Greem Graum Sah Gurave Namah',
};

// ---------- Activity pools for auspicious dates ----------

const auspiciousActivities: string[][] = [
  ['starting a new business', 'signing contracts', 'launching projects'],
  ['travel and pilgrimage', 'purchasing vehicles', 'long-distance journeys'],
  ['marriage discussions', 'engagement ceremonies', 'romantic proposals'],
  ['property transactions', 'home purchases', 'laying foundations'],
  ['job interviews', 'career changes', 'salary negotiations'],
  ['medical treatments', 'health initiatives', 'wellness programs'],
  ['educational pursuits', 'exam registration', 'joining courses'],
  ['financial investments', 'opening bank accounts', 'gold purchases'],
  ['spiritual initiations', 'temple visits', 'beginning sadhana'],
  ['naming ceremonies', 'housewarming events', 'celebrations'],
];

const inauspiciousActivities: string[][] = [
  ['starting new ventures', 'signing important documents', 'major purchases'],
  ['long-distance travel', 'moving homes', 'vehicle purchases'],
  ['marriage-related activities', 'engagement talks', 'romantic commitments'],
  ['financial investments', 'lending money', 'risky transactions'],
  ['surgical procedures', 'elective medical treatments', 'dental work'],
];

// ---------- Day name helper ----------

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getDayOfWeek(year: number, month: number, day: number): string {
  return DAY_NAMES[new Date(year, month, day).getDay()];
}

// ---------- Element and Quality extraction ----------

function extractElement(elementStr: string): string {
  const match = elementStr.match(/^(\w+)/);
  return match ? match[1] : 'Fire';
}

function extractQuality(qualityStr: string): string {
  const match = qualityStr.match(/^(\w+)/);
  return match ? match[1] : 'Cardinal';
}

// ---------- Auspicious Date Calculator ----------

function calculateAuspiciousDates(
  moonSignIndex: number,
  year: number,
  month: number,
  seed: number,
): AuspiciousDate[] {
  const rashi = rashiDetails[moonSignIndex];
  const daysInMonth = getDaysInMonth(year, month);
  const results: AuspiciousDate[] = [];
  const usedDates = new Set<number>();

  // Lucky numbers mapped to calendar dates
  for (const num of rashi.luckyNumbers) {
    let day = num;
    // If lucky number > days in month, wrap around
    while (day > daysInMonth) {
      day -= daysInMonth;
    }
    if (day >= 1 && !usedDates.has(day)) {
      usedDates.add(day);
      const dayOfWeek = getDayOfWeek(year, month, day);
      const activities = seededPick(auspiciousActivities, seed + day);
      results.push({
        date: `${MONTH_NAMES[month]} ${day}`,
        dayOfWeek,
        goodFor: activities.slice(0, 2 + (seed % 2)),
        reason: `Lucky number ${num} resonates with your Moon sign ${rashi.name}, amplifying positive outcomes`,
      });
    }
  }

  // Lucky days mapped to specific weekday occurrences in the month
  for (const luckyDay of rashi.luckyDays) {
    const dayIndex = DAY_NAMES.indexOf(luckyDay);
    if (dayIndex === -1) continue;

    // Find the second occurrence of this day in the month (more specific than first)
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (new Date(year, month, d).getDay() === dayIndex) {
        count++;
        if (count === 2 && !usedDates.has(d)) {
          usedDates.add(d);
          const activities = seededPick(auspiciousActivities, seed + d + moonSignIndex);
          results.push({
            date: `${MONTH_NAMES[month]} ${d}`,
            dayOfWeek: luckyDay,
            goodFor: activities.slice(0, 2 + ((seed + d) % 2)),
            reason: `${luckyDay} is ruled by ${rashi.ruler.split(' ')[0]}, your signs lord, creating auspicious alignment`,
          });
          break;
        }
      }
    }
  }

  // Sort by date number
  results.sort((a, b) => {
    const dayA = parseInt(a.date.split(' ')[1]);
    const dayB = parseInt(b.date.split(' ')[1]);
    return dayA - dayB;
  });

  return results;
}

// ---------- Inauspicious Date Calculator ----------

function calculateInauspiciousDates(
  moonSignIndex: number,
  year: number,
  month: number,
  seed: number,
): InauspiciousDate[] {
  const results: InauspiciousDate[] = [];
  const daysInMonth = getDaysInMonth(year, month);

  // Approximate Amavasya (new moon) date
  // Simple formula: new moon cycle is ~29.53 days
  // Reference: Jan 1 2024 was roughly a new moon (Jan 11 2024 actually)
  const refDate = new Date(2024, 0, 11);
  const targetMonthStart = new Date(year, month, 1);
  const daysDiff = Math.floor((targetMonthStart.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  const cyclePosition = daysDiff % 29.53;
  let amavasyaDay = Math.round(29.53 - cyclePosition);
  if (amavasyaDay > daysInMonth) amavasyaDay -= 29;
  if (amavasyaDay < 1) amavasyaDay += 29;
  if (amavasyaDay >= 1 && amavasyaDay <= daysInMonth) {
    const dayOfWeek = getDayOfWeek(year, month, amavasyaDay);
    const avoidActivities = seededPick(inauspiciousActivities, seed);
    results.push({
      date: `${MONTH_NAMES[month]} ${amavasyaDay}`,
      dayOfWeek,
      avoidFor: avoidActivities,
      reason: 'Amavasya (New Moon) day carries low lunar energy, unfavorable for new beginnings',
    });
  }

  // Additional inauspicious dates based on sign challenges
  const challengeDay1 = ((seed * 3 + moonSignIndex * 5) % (daysInMonth - 4)) + 3;
  const challengeDay2 = ((seed * 7 + moonSignIndex * 11) % (daysInMonth - 6)) + 5;

  // Ensure no overlap with amavasya
  const usedDays = new Set<number>([amavasyaDay]);

  if (!usedDays.has(challengeDay1) && challengeDay1 >= 1 && challengeDay1 <= daysInMonth) {
    usedDays.add(challengeDay1);
    const dayOfWeek = getDayOfWeek(year, month, challengeDay1);
    const avoidActivities = seededPick(inauspiciousActivities, seed + challengeDay1);
    results.push({
      date: `${MONTH_NAMES[month]} ${challengeDay1}`,
      dayOfWeek,
      avoidFor: avoidActivities.slice(0, 2),
      reason: 'Planetary alignment creates challenging aspects for your Moon sign during this period',
    });
  }

  if (!usedDays.has(challengeDay2) && challengeDay2 >= 1 && challengeDay2 <= daysInMonth) {
    const dayOfWeek = getDayOfWeek(year, month, challengeDay2);
    const avoidActivities = seededPick(inauspiciousActivities, seed + challengeDay2 + 3);
    results.push({
      date: `${MONTH_NAMES[month]} ${challengeDay2}`,
      dayOfWeek,
      avoidFor: avoidActivities.slice(0, 2),
      reason: 'Malefic transit influence heightens caution for significant undertakings on this date',
    });
  }

  // Sort by date number
  results.sort((a, b) => {
    const dayA = parseInt(a.date.split(' ')[1]);
    const dayB = parseInt(b.date.split(' ')[1]);
    return dayA - dayB;
  });

  return results;
}

// ---------- Transit Generator ----------

function generateTransits(seed: number): MonthlyTransit[] {
  const templateSet = seededPick(transitTemplates, seed);
  // Return 2-4 transits based on seed
  const count = 2 + (seed % 3);
  return templateSet.slice(0, Math.min(count, templateSet.length));
}

// ---------- Overview Composer ----------

function composeOverview(
  category: string,
  element: string,
  quality: string,
  seed: number,
): string {
  const opening = seededPick(openingPhrases[element] || openingPhrases.Fire, seed);
  const contentKey = `${category}_${element}`;
  const middle = seededPick(middleContent[contentKey] || middleContent[`general_${element}`], seed + 7);
  const qualityKey = quality === 'Dual' ? 'Dual' : quality === 'Fixed' ? 'Fixed' : 'Cardinal';
  const closing = seededPick(closingPhrases[qualityKey], seed + 13);

  return `${opening} ${middle} ${closing}`;
}

// ---------- Phase Generator ----------

function generatePhases(
  element: string,
  year: number,
  month: number,
  seed: number,
): MonthlyPhase[] {
  const pattern = phasePatterns[element] || phasePatterns.Fire;
  const predictions = phasePredictions[element] || phasePredictions.Fire;
  const daysInMonth = getDaysInMonth(year, month);
  const monthName = MONTH_NAMES[month];

  const phases: MonthlyPhase[] = [
    {
      label: pattern.labels[0],
      period: `${monthName} 1 - ${monthName} 10`,
      prediction: seededPick(predictions[0], seed),
      energy: pattern.energies[0],
    },
    {
      label: pattern.labels[1],
      period: `${monthName} 11 - ${monthName} 20`,
      prediction: seededPick(predictions[1], seed + 3),
      energy: pattern.energies[1],
    },
    {
      label: pattern.labels[2],
      period: `${monthName} 21 - ${monthName} ${daysInMonth}`,
      prediction: seededPick(predictions[2], seed + 5),
      energy: pattern.energies[2],
    },
  ];

  return phases;
}

// ---------- Rating Generator ----------

function generateRatings(seed: number): Record<string, number> {
  // Stable range 55-80
  const range = 25;
  const base = 55;
  return {
    overall: base + ((seed * 3) % (range + 1)),
    career: base + ((seed * 5 + 7) % (range + 1)),
    love: base + ((seed * 7 + 3) % (range + 1)),
    health: base + ((seed * 11 + 5) % (range + 1)),
    finance: base + ((seed * 13 + 9) % (range + 1)),
  };
}

// ---------- Main Export ----------

export function generateMonthlyPrediction(
  vedicChart: VedicChart,
  date: Date,
): MonthlyPrediction {
  const month = date.getMonth();
  const year = date.getFullYear();
  const moonSignIndex = vedicChart.moonSign.index;
  const monthName = MONTH_NAMES[month];
  const monthLabel = `${monthName} ${year}`;

  const seed = month + moonSignIndex * 17 + year;

  const rashi = rashiDetails[moonSignIndex];
  const element = extractElement(rashi.element);
  const quality = extractQuality(rashi.quality);

  // Compose overview paragraphs for all five categories
  const overview = {
    general: composeOverview('general', element, quality, seed),
    career: composeOverview('career', element, quality, seed + 1),
    love: composeOverview('love', element, quality, seed + 2),
    health: composeOverview('health', element, quality, seed + 3),
    finance: composeOverview('finance', element, quality, seed + 4),
  };

  // Generate ratings
  const ratings = generateRatings(seed);

  // Generate three phases
  const phases = generatePhases(element, year, month, seed);

  // Calculate auspicious dates
  const auspiciousDates = calculateAuspiciousDates(moonSignIndex, year, month, seed);

  // Calculate inauspicious dates
  const inauspiciousDates = calculateInauspiciousDates(moonSignIndex, year, month, seed);

  // Select transit events
  const keyTransits = generateTransits(seed);

  // Select three remedies
  const signRemedies = monthlyRemedies[moonSignIndex] || monthlyRemedies[0];
  const shuffledRemedies = seededShuffle(signRemedies, seed);
  const remedies = shuffledRemedies.slice(0, 3);

  // Mantra
  const mantra = signMantras[moonSignIndex] || signMantras[0];

  return {
    month: monthLabel,
    overview,
    ratings,
    phases,
    auspiciousDates,
    inauspiciousDates,
    keyTransits,
    remedies,
    mantra,
  };
}
