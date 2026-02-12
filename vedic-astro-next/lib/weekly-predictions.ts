/**
 * Weekly Predictions Generator
 *
 * Generates rich weekly predictions distinct from daily horoscopes,
 * including overview paragraphs, day-by-day highlights, activity
 * recommendations, remedies, and smoothed ratings.
 */

import { VedicChart, WeeklyPrediction, DayHighlight, ActivityRecommendation } from '@/types';
import { rashiDetails, generateDailyContent } from '@/lib/horoscope-data';

// ---------- Weekly Overview Templates ----------

const weeklyOverviews: Record<number, string[]> = {
  0: [ // Aries
    'This week ignites your pioneering spirit as Mars channels fresh drive into your ambitions. Bold initiatives started now carry extra momentum, and colleagues are drawn to your decisive energy. Use the first half of the week to lay foundations, then push forward with confidence after midweek. Guard against overcommitting; pace yourself and victories will come naturally.',
    'The cosmic alignment this week encourages you to reclaim personal power and set boundaries where they have grown soft. Fiery Mars energy fuels your resolve, making this an ideal stretch for confronting lingering disagreements head-on. Channel any restlessness into physical exercise or outdoor adventure. By Sunday you will feel lighter and more clear-headed than you have in weeks.',
    'This week\'s energy supports courageous conversations and fearless decision-making for Aries natives. Whether you are negotiating a salary, pitching an idea, or simply speaking your truth in a relationship, the stars amplify your voice. Midweek brings a pleasant surprise involving finances or recognition. Stay grounded and avoid impulsive purchases despite the tempting surge of abundance.',
    'A week of dynamic transformation awaits as planetary currents stir both your career zone and inner world. Expect a project or idea that has been brewing quietly to demand your full attention. Partnerships may require compromise, but your natural leadership will guide the outcome. Set aside time for reflection on Thursday or Friday to integrate the lessons emerging.',
    'Mars-driven momentum intensifies this week, giving Aries natives the stamina to tackle ambitious goals. Early-week energy favors action plans and competitive situations, while the weekend softens the pace for self-care. An unexpected message or meeting around Wednesday could redirect your focus in a rewarding way. Trust your instincts, but verify the details before committing.',
  ],
  1: [ // Taurus
    'This week invites you to slow down and savor the beauty around you, Taurus. Venus casts a gentle glow over your domestic sphere, making home improvements and family gatherings especially fulfilling. Financial matters stabilize by midweek, rewarding your patient approach. Allow yourself a small luxury; you have earned it through sustained effort.',
    'The cosmic alignment this week encourages steady progress rather than dramatic leaps. Your natural persistence is your greatest asset now, so keep tending to ongoing projects with quiet determination. A creative idea surfaces around Wednesday that could add lasting value to your work. Let comfort and routine anchor you while subtle shifts build toward something significant.',
    'This week\'s energy supports Taurus natives in deepening commitments, whether in love, business, or personal growth. Venus enhances your charm and negotiating power, making partnership discussions productive and warm. A financial opportunity that seemed uncertain may finally show its true promise. Practice gratitude daily this week and watch abundance multiply.',
    'Practical magic is the theme this week as earthy energies align with your meticulous nature. Tasks requiring attention to detail, budgeting, or long-range planning flow smoothly. Social invitations increase after midweek, and one in particular could open a valuable professional door. Balance productivity with leisure to avoid the stubbornness that comes from overwork.',
    'Venus bestows harmony on your week, smoothing over rough patches in relationships and inspiring artistic expression. Material security improves through a contract, raise, or unexpected gift that reflects your hard work. Midweek may bring a nostalgic moment connected to family heritage. Embrace your sensual side: fine food, music, and nature walks replenish your spirit.',
  ],
  2: [ // Gemini
    'This week buzzes with intellectual stimulation as Mercury sharpens your already quick mind. Conversations, emails, and brainstorming sessions are where you shine brightest now. A short trip or virtual event around midweek sparks a genuinely exciting idea. Keep a notebook close; your best insights may arrive in fleeting moments between tasks.',
    'The cosmic alignment this week encourages you to diversify your interests without scattering your focus. Mercury supports multitasking but rewards follow-through even more. A sibling, neighbor, or classmate may play a surprising role in your week\'s most memorable event. Speak clearly and listen generously; communication is both your superpower and your lesson.',
    'This week\'s energy supports Gemini natives in learning, teaching, and sharing knowledge. Whether through a workshop, podcast, or heartfelt letter, your words carry unusual weight right now. Financial curiosity pays off if you research before acting. The weekend favors playful social gatherings where laughter heals more than any serious conversation could.',
    'Restless winds of change blow through your week, Gemini, bringing fresh contacts and novel perspectives. Embrace the variety but anchor at least one project with a clear deadline. Midweek communication with a mentor or authority figure could shift your trajectory in a positive direction. Evening hours are ideal for journaling and processing the day\'s influx of ideas.',
    'Mercury accelerates your social calendar and mental agility this week. Networking events, study groups, and casual meetups all hold hidden gems of opportunity. A piece of information you stumble upon Tuesday or Wednesday may solve a long-standing puzzle. Balance the mental buzz with grounding activities like cooking or gardening to prevent nervous exhaustion.',
  ],
  3: [ // Cancer
    'This week wraps you in a nurturing cocoon as the Moon highlights your emotional intelligence. Family matters take center stage, and a heartfelt conversation with a loved one brings clarity and closeness. Financial intuition runs high; trust that gut feeling about an investment or purchase. Protect your energy by limiting exposure to draining social obligations.',
    'The cosmic alignment this week encourages you to create a sanctuary, both literally and emotionally. Home improvement projects, decluttering, or rearranging your space can reset your mood profoundly. A water-related activity, whether a bath, a swim, or simply sitting by a river, recharges you midweek. By Sunday you feel emotionally refreshed and ready for what lies ahead.',
    'This week\'s energy supports Cancer natives in strengthening bonds and expressing vulnerability with courage. The lunar cycle amplifies your empathy, making you a magnet for others seeking comfort and advice. Be mindful not to absorb others\' stress as your own. A creative project nurtured this week could blossom into something personally meaningful by month\'s end.',
    'Tides of emotion run deeper than usual this week, offering Cancer natives a chance to heal old wounds. Midweek brings an insight about a family pattern or childhood memory that, once acknowledged, loses its grip. Financial security improves through careful planning rather than risk-taking. Cook a nourishing meal for someone you love; the act itself is medicine.',
    'Lunar energy this week heightens your intuition and psychic sensitivity to remarkable levels. Dreams may contain guidance worth recording, especially around Tuesday and Wednesday nights. A real estate or housing matter moves forward after a period of stagnation. Let your imagination roam freely this weekend; it is preparing you for a breakthrough in the weeks to come.',
  ],
  4: [ // Leo
    'This week places you firmly in the spotlight, Leo, as the Sun energizes your natural charisma. Leadership opportunities emerge at work, and your creative output impresses those who matter. Romance heats up midweek with a grand gesture or heartfelt declaration. Remember to share the stage graciously; generosity amplifies the applause you receive.',
    'The cosmic alignment this week encourages you to take bold, creative risks. Solar energy fuels your confidence, making presentations, performances, and public appearances remarkably successful. A child or younger person may inspire a fresh perspective on an old challenge. Let your heart lead this week; logic has had its turn and now passion must speak.',
    'This week\'s energy supports Leo natives in reclaiming joy and playfulness in everyday life. The universe reminds you that dignity and delight are not mutually exclusive. A social invitation around Thursday could connect you with influential people who appreciate your warmth. Channel any competitive energy into creative projects rather than power struggles.',
    'Royal energy infuses your week, making you magnetic in both professional and personal settings. A recognition, award, or compliment arrives that validates months of effort. Financial generosity returns to you threefold when offered sincerely. The weekend is ideal for theatrical self-expression, whether through fashion, art, or simply telling a fantastic story at dinner.',
    'The Sun amplifies your vitality and ambition this week, propelling you toward center stage. Creative collaborations flourish, especially those involving performance, design, or entertainment. Midweek may test your patience with a subordinate or family member; respond with warmth rather than authority. Sunday brings a moment of private triumph that reminds you why persistence matters.',
  ],
  5: [ // Virgo
    'This week rewards your analytical mind with clarity and precision, Virgo. Mercury enhances your ability to spot patterns others miss, making research, editing, and strategic planning particularly fruitful. A health routine adjustment begun now will yield noticeable benefits within days. Be gentle with yourself; perfectionism is a tool, not a taskmaster.',
    'The cosmic alignment this week encourages you to organize, optimize, and refine. Whether it is a workspace, a diet, or a daily schedule, small improvements compound into major life upgrades. A colleague or service provider goes above and beyond midweek, restoring your faith in professionalism. Take Friday evening to relax; your mind needs structured downtime.',
    'This week\'s energy supports Virgo natives in turning worry into constructive action. Instead of ruminating on what might go wrong, channel that mental energy into contingency planning and skill-building. A financial detail you catch around Wednesday saves significant resources. Nature walks and herbal teas are your best allies for managing stress this week.',
    'Meticulous energy pervades your week, making it ideal for audits, inventory, and detailed project work. Mercury sharpens your communication, so important emails and proposals written now land with maximum impact. A health discovery or wellness tip changes your daily routine for the better. Practice gratitude to counterbalance the critical inner voice that grows louder under stress.',
    'Mercury blesses your week with exceptional organizational clarity and problem-solving ability. Tasks that seemed overwhelming last week suddenly reveal their logical structure. A service you provide earns heartfelt appreciation that motivates you deeply. The weekend invites you to explore a bookshop, museum, or educational workshop; intellectual nourishment is your form of self-care.',
  ],
  6: [ // Libra
    'This week radiates harmony as Venus aligns with your diplomatic instincts, Libra. Relationships of all kinds benefit from your natural gift for balance and fairness. A legal or contractual matter reaches a favorable resolution around midweek. Surround yourself with beauty; fresh flowers, art, or music will amplify the positive currents flowing your way.',
    'The cosmic alignment this week encourages you to seek justice and restore equilibrium where imbalance has crept in. Venus strengthens your negotiation skills, making this an excellent stretch for mediation, compromise, and partnership agreements. An artistic impulse deserves your attention even if it seems impractical. Beauty created now carries lasting resonance.',
    'This week\'s energy supports Libra natives in making decisions that have been deferred too long. The scales tip in your favor when you commit rather than waver. A social event or cultural outing around Thursday introduces you to someone whose values mirror your own. Financial partnerships look promising, but read the fine print before signing.',
    'Aesthetic pleasure and intellectual companionship define your week, Libra. Collaborative projects thrive under your graceful coordination, and a creative partnership enters an exciting new phase. Midweek brings a romantic or social highlight that restores your faith in human connection. Balance your giving nature with healthy boundaries to avoid resentment.',
    'Venus wraps your week in elegance and charm, making you irresistible in social and professional arenas. A design, fashion, or art project reaches a satisfying milestone. Legal matters favor your position, especially when approached with diplomacy rather than aggression. The weekend invites intimate conversation over candlelight; depth of connection matters more than breadth this week.',
  ],
  7: [ // Scorpio
    'This week plunges you into transformative depths, Scorpio, as Mars fuels your investigative instincts. Hidden information surfaces that reshapes your understanding of a situation at work or home. Financial matters require strategic thinking; trust your razor-sharp intuition. Emotional intensity peaks midweek, so channel passion into creative or physical outlets.',
    'The cosmic alignment this week encourages you to release what no longer serves your evolution. Mars energy supports decisive action: ending a toxic habit, closing an unproductive chapter, or confronting a difficult truth. A private conversation around Wednesday holds the key to significant healing. Solitude on the weekend restores your formidable inner power.',
    'This week\'s energy supports Scorpio natives in research, investigation, and deep psychological work. Whether you are studying finances, exploring therapy, or simply reading a riveting mystery novel, depth is your ally. An inheritance, refund, or shared resource matter improves unexpectedly. Guard your secrets wisely but share your vulnerability with one trusted soul.',
    'Intense currents run beneath the surface of an otherwise quiet week for Scorpio natives. A power dynamic at work or in a relationship shifts in your favor when you demonstrate restraint rather than force. Midweek financial insights could lead to a profitable decision. Spend time near water this weekend; it cleanses your aura and sharpens your already formidable instincts.',
    'Mars drives your determination to unprecedented heights this week, making obstacles feel like invitations rather than barriers. A research project or investigation yields breakthrough results around Thursday. Emotional bonds deepen through honest, even uncomfortable, conversations. The weekend is ideal for regenerative practices like meditation, massage, or a long, cathartic journal session.',
  ],
  8: [ // Sagittarius
    'This week ignites your adventurous spirit as Jupiter expands your horizons in every direction, Sagittarius. Travel plans, educational pursuits, and philosophical discussions all carry the sparkle of genuine discovery. A mentor or teacher figure offers wisdom that reframes a challenge into an opportunity. Stay open-minded; the best lesson arrives from the least expected source.',
    'The cosmic alignment this week encourages you to aim your arrow high and release with confidence. Jupiter blesses risk-taking, especially in education, publishing, and cross-cultural ventures. An international connection or foreign influence adds richness to your midweek experience. Optimism is your fuel, but ground it with at least one concrete action step each day.',
    'This week\'s energy supports Sagittarius natives in broadening their worldview through study, travel, or deep conversation. A book, documentary, or podcast encountered early in the week shifts your perspective in a lasting way. Financial luck improves through philosophical patience rather than aggressive pursuit. The weekend favors outdoor adventure and spontaneous exploration.',
    'Expansive Jupiter energy fills your week with opportunity and enthusiasm, Sagittarius. A legal, academic, or publishing matter advances favorably around midweek. Your natural honesty wins respect even from those who initially disagreed with you. Be mindful of overindulgence; your ruler\'s generosity extends to appetites of all kinds. Moderation enhances your enjoyment.',
    'Jupiter amplifies your quest for meaning this week, turning ordinary moments into philosophical revelations. A travel opportunity or cultural exchange enriches your understanding of the world. Thursday and Friday are especially favorable for presentations, teaching, or sharing your expertise. The weekend invites reflection on how far you have come; gratitude opens the door to the next chapter.',
  ],
  9: [ // Capricorn
    'This week demands disciplined focus, and you are perfectly equipped to deliver, Capricorn. Saturn rewards your persistence with tangible progress on a long-term goal. Authority figures take notice of your reliability, potentially opening doors to greater responsibility. Schedule moments of genuine rest; even the most productive mountain goat must pause to appreciate the view.',
    'The cosmic alignment this week encourages you to build structures that will stand the test of time. Saturn\'s patient energy supports strategic planning, financial consolidation, and career advancement. A meeting with an elder or mentor around midweek provides invaluable practical wisdom. Let ambition drive you, but let wisdom steer.',
    'This week\'s energy supports Capricorn natives in taking calculated, well-researched steps toward their aspirations. Bureaucratic or administrative tasks that others dread become satisfying conquests under your capable hands. A professional recognition or milestone arrives by Friday. Balance duty with small pleasures; discipline without joy becomes mere drudgery.',
    'Saturn steadies your week with a reassuring sense of order and purpose, Capricorn. Projects requiring patience, precision, and long-range vision align perfectly with your natural strengths. A real estate, investment, or career matter crystallizes around Thursday. The weekend invites you to mentor someone younger or less experienced; teaching deepens your own mastery.',
    'Pragmatic energy defines your week, making this an ideal time for contracts, business plans, and structural improvements. Saturn amplifies your authority, and people instinctively trust your judgment now. Midweek, a financial decision you made months ago begins to pay dividends. Sunday evening is best spent in quiet reflection, mapping the next phase of your ambitious journey.',
  ],
  10: [ // Aquarius
    'This week electrifies your innovative mind as Saturn and your visionary nature combine for breakthroughs, Aquarius. Technology projects, community involvement, and unconventional ideas all receive cosmic support. A friendship or group connection around midweek sparks a collaboration with genuine potential. Stay true to your unique perspective; the world needs your original thinking.',
    'The cosmic alignment this week encourages you to challenge conventions and champion progressive causes. Your humanitarian instincts are amplified, making this an excellent stretch for volunteer work, advocacy, or grassroots organizing. An unexpected technological solution simplifies a problem you had been overcomplicating. The weekend favors experimental creative expression.',
    'This week\'s energy supports Aquarius natives in networking, innovating, and building community. Group projects flourish under your visionary coordination, and a casual conversation turns into a powerful meeting of minds. Financial matters benefit from an unconventional approach. Protect your independence while remaining open to the synergy that collaboration offers.',
    'Unconventional currents flow through your week, Aquarius, rewarding original thinking and rebellious creativity. A scientific, technological, or social innovation you have been developing reaches a critical milestone. Midweek brings a stimulating debate or discussion that sharpens your ideas. The weekend is ideal for stargazing, both literally and metaphorically, as you envision the future.',
    'Saturn grounds your revolutionary visions in practical reality this week, Aquarius. A community project or group initiative gains traction through your persistent organizing. An elder or authority figure unexpectedly supports your unconventional approach around Thursday. Balance your need for independence with genuine emotional availability for those closest to you this weekend.',
  ],
  11: [ // Pisces
    'This week immerses you in a sea of creative inspiration and spiritual insight, Pisces. Jupiter expands your imaginative faculties, making art, music, and meditation especially rewarding. A compassionate act you perform midweek ripples outward in ways you may never fully see. Trust the invisible currents guiding you; your intuition is impeccable right now.',
    'The cosmic alignment this week encourages you to dissolve boundaries between the mundane and the mystical. Jupiter heightens your empathy and psychic sensitivity, attracting people who need your gentle wisdom. A dream or meditation around Wednesday reveals practical guidance disguised as symbolism. Protect your energy with clear boundaries even as your heart opens wide.',
    'This week\'s energy supports Pisces natives in healing, creating, and surrendering to the flow of divine timing. Artistic projects benefit from your heightened emotional depth, and a piece of music or poetry may move you to tears of recognition. Financial matters improve through faith and patience rather than aggressive action. The weekend invites sacred solitude.',
    'Oceanic energy floods your week with feeling, fantasy, and profound spiritual insight, Pisces. A therapeutic conversation or healing session around midweek addresses a wound you had forgotten you carried. Creative collaboration with a kindred spirit produces something genuinely beautiful. Be mindful of escapist tendencies; presence is the real portal to the magic you seek.',
    'Jupiter fills your week with grace, compassion, and moments of transcendent beauty. A charitable act or selfless gesture returns to you in unexpected abundance. Midweek meditation or prayer opens a channel of insight that guides your practical decisions. The weekend invites you to the water\'s edge, literally or symbolically, where answers arrive on the tide.',
  ],
};

// ---------- Weekly Themes ----------

const weeklyThemes: Record<number, string[]> = {
  0:  ['Career Momentum', 'Bold Beginnings', 'Warrior\'s Resolve', 'Passionate Pursuits', 'Trailblazing Energy'],
  1:  ['Material Growth', 'Grounded Abundance', 'Sensual Harmony', 'Steady Progress', 'Earthly Pleasures'],
  2:  ['Intellectual Spark', 'Social Connections', 'Curious Exploration', 'Mercurial Shifts', 'Words of Power'],
  3:  ['Emotional Renewal', 'Home and Heart', 'Lunar Intuition', 'Nurturing Bonds', 'Tidal Healing'],
  4:  ['Creative Spotlight', 'Royal Confidence', 'Heartfelt Expression', 'Solar Radiance', 'Stage of Life'],
  5:  ['Precise Refinement', 'Healthy Discipline', 'Analytical Edge', 'Service and Skill', 'Mindful Order'],
  6:  ['Harmonious Partnerships', 'Artistic Balance', 'Diplomatic Wins', 'Venus Blessings', 'Fair Exchange'],
  7:  ['Deep Transformation', 'Hidden Power', 'Investigative Depth', 'Rebirth Energy', 'Strategic Intensity'],
  8:  ['Expanding Horizons', 'Philosophical Quest', 'Adventurous Spirit', 'Wisdom Seeking', 'Archer\'s Aim'],
  9:  ['Structured Ambition', 'Patient Building', 'Authority Rising', 'Disciplined Focus', 'Mountain Summit'],
  10: ['Innovative Breakthroughs', 'Community Vision', 'Rebel Wisdom', 'Future Forward', 'Electric Connections'],
  11: ['Spiritual Immersion', 'Creative Tides', 'Compassionate Flow', 'Mystic Insights', 'Ocean of Dreams'],
};

// ---------- Day Mood Data ----------

const weekdayPlanetRulers: Record<number, string> = {
  0: 'Sun',
  1: 'Moon',
  2: 'Mars',
  3: 'Mercury',
  4: 'Jupiter',
  5: 'Venus',
  6: 'Saturn',
};

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const dayActivities: Record<string, string[]> = {
  excellent: [
    'Starting new ventures',
    'Important negotiations',
    'Job interviews',
    'Financial investments',
    'Marriage proposals',
    'Signing contracts',
    'Public speaking',
    'Launching projects',
  ],
  good: [
    'Networking events',
    'Creative work',
    'Travel planning',
    'Health check-ups',
    'Learning new skills',
    'Team collaboration',
    'Social gatherings',
    'Home improvements',
  ],
  mixed: [
    'Routine tasks',
    'Research and study',
    'Organizing workspace',
    'Short local errands',
    'Journaling',
    'Reviewing finances',
    'Light exercise',
    'Catching up on emails',
  ],
  challenging: [
    'Meditation and reflection',
    'Charitable acts',
    'Rest and recovery',
    'Temple or spiritual visits',
    'Decluttering',
    'Reading scriptures',
    'Gentle yoga',
    'Quiet contemplation',
  ],
};

const dayAvoidActivities: Record<string, string[]> = {
  excellent: [
    'Excessive caution',
    'Postponing decisions',
  ],
  good: [
    'Major confrontations',
    'Risky speculations',
    'Overcommitting socially',
  ],
  mixed: [
    'High-stakes decisions',
    'Starting new businesses',
    'Emotional confrontations',
    'Large purchases',
  ],
  challenging: [
    'Signing contracts',
    'Starting new ventures',
    'Important travel',
    'Financial commitments',
    'Heated arguments',
    'Major purchases',
  ],
};

const briefNoteTemplates: Record<string, string[]> = {
  excellent: [
    'An outstanding day where cosmic forces align powerfully in your favor. Seize every opportunity.',
    'Planetary energies converge to create a day of remarkable success and fulfillment.',
    'The stars bestow exceptional fortune today. Your efforts yield amplified results.',
    'A golden day charged with auspicious energy. Confidence and clarity are your companions.',
    'Celestial blessings pour in generously, making this a day to remember and celebrate.',
  ],
  good: [
    'A favorable day with steady positive currents supporting your plans and relationships.',
    'Pleasant energy flows through the day, making progress feel natural and rewarding.',
    'Good fortune smiles gently today. Incremental gains build toward something meaningful.',
    'Supportive planetary aspects create a warm, productive atmosphere for most activities.',
    'A day of quiet abundance where good things come to those who act with sincerity.',
  ],
  mixed: [
    'A day of contrasts where patience and adaptability serve you better than force.',
    'Some opportunities arrive alongside minor obstacles. Flexibility is your greatest asset.',
    'Mixed planetary signals call for discernment. Proceed with awareness and balanced judgment.',
    'Navigate shifting energies by staying centered. Small victories accumulate into meaningful progress.',
    'A day that rewards careful observation over hasty action. Timing matters more than speed.',
  ],
  challenging: [
    'A day requiring extra caution and patience. Channel difficult energy into spiritual practice.',
    'Planetary tensions create friction that is best met with calm resilience and inner strength.',
    'Obstacles may arise but carry hidden lessons. Use this day for reflection rather than action.',
    'Challenging aspects demand maturity and restraint. Postpone major decisions if possible.',
    'A testing day that builds character. Accept what comes with grace and trust the larger plan.',
  ],
};

// ---------- Activity Types and Recommendations ----------

const activityTypes = [
  'Interview',
  'Travel',
  'Romance',
  'Health Check',
  'Financial Decisions',
  'New Ventures',
  'Legal Matters',
  'Spiritual Practice',
] as const;

type ActivityType = (typeof activityTypes)[number];

const activityReasons: Record<ActivityType, Record<string, string>> = {
  Interview: {
    Sunday: 'Solar energy boosts confidence and self-presentation',
    Monday: 'Lunar sensitivity helps you read the interviewer\'s cues',
    Tuesday: 'Mars energy gives you competitive drive and assertiveness',
    Wednesday: 'Mercury sharpens communication and quick thinking',
    Thursday: 'Jupiter brings luck, expansion, and favorable outcomes',
    Friday: 'Venus adds charm, likability, and graceful articulation',
    Saturday: 'Saturn rewards preparation, seriousness, and structure',
  },
  Travel: {
    Sunday: 'Sun illuminates safe and prosperous journeys',
    Monday: 'Moon supports emotionally fulfilling and intuitive travel',
    Tuesday: 'Mars provides energy and courage for adventurous trips',
    Wednesday: 'Mercury governs transport and smooth communication en route',
    Thursday: 'Jupiter blesses long-distance and educational travel',
    Friday: 'Venus makes leisure and romantic travel enchanting',
    Saturday: 'Saturn favors disciplined pilgrimages and business travel',
  },
  Romance: {
    Sunday: 'Sun warms the heart and inspires grand romantic gestures',
    Monday: 'Moon heightens emotional connection and tender moments',
    Tuesday: 'Mars ignites passion, desire, and magnetic attraction',
    Wednesday: 'Mercury fosters playful banter and intellectual bonding',
    Thursday: 'Jupiter expands love with generosity and shared wisdom',
    Friday: 'Venus, planet of love, makes this the ideal day for romance',
    Saturday: 'Saturn deepens commitment and rewards loyal partnerships',
  },
  'Health Check': {
    Sunday: 'Sun governs vitality; check-ups reveal your true energy levels',
    Monday: 'Moon rules fluids and emotions; ideal for holistic assessments',
    Tuesday: 'Mars governs blood and surgery; favorable for medical attention',
    Wednesday: 'Mercury rules the nervous system; good for diagnostic tests',
    Thursday: 'Jupiter supports healing and positive medical outcomes',
    Friday: 'Venus governs kidneys and hormones; ideal for related check-ups',
    Saturday: 'Saturn rules bones and chronic conditions; thorough assessments favored',
  },
  'Financial Decisions': {
    Sunday: 'Sun energy supports authoritative and confident money moves',
    Monday: 'Moon enhances intuition about market sentiment and timing',
    Tuesday: 'Mars empowers bold investments and calculated financial risks',
    Wednesday: 'Mercury sharpens analytical thinking for financial strategy',
    Thursday: 'Jupiter is the planet of wealth; finances expand under its gaze',
    Friday: 'Venus attracts prosperity and favorable financial negotiations',
    Saturday: 'Saturn rewards conservative, long-term financial planning',
  },
  'New Ventures': {
    Sunday: 'Sun blesses new beginnings with authority and visibility',
    Monday: 'Moon nurtures fresh starts with public favor and intuition',
    Tuesday: 'Mars provides the courage and drive to launch boldly',
    Wednesday: 'Mercury aids in planning, marketing, and communication for new ventures',
    Thursday: 'Jupiter\'s expansive energy gives new ventures the best chance of growth',
    Friday: 'Venus lends aesthetic appeal and public charm to new endeavors',
    Saturday: 'Saturn provides a solid structural foundation for lasting ventures',
  },
  'Legal Matters': {
    Sunday: 'Sun favors dealings with authority and government bodies',
    Monday: 'Moon aids in public sympathy and emotional appeals',
    Tuesday: 'Mars gives you fighting spirit and assertiveness in legal battles',
    Wednesday: 'Mercury sharpens legal arguments and documentation',
    Thursday: 'Jupiter, the planet of justice, strongly favors legal outcomes',
    Friday: 'Venus supports mediation, settlement, and harmonious resolution',
    Saturday: 'Saturn governs law and discipline; justice is served methodically',
  },
  'Spiritual Practice': {
    Sunday: 'Sun connects you to your soul purpose and divine light',
    Monday: 'Moon deepens meditation, devotion, and inner awareness',
    Tuesday: 'Mars fuels tapas, spiritual discipline, and austerity',
    Wednesday: 'Mercury enhances mantra recitation and scriptural study',
    Thursday: 'Jupiter, the guru planet, amplifies spiritual growth and wisdom',
    Friday: 'Venus opens the heart chakra for devotion and bhakti practice',
    Saturday: 'Saturn strengthens renunciation, penance, and karmic resolution',
  },
};

// Preferred activity days per sign (based on lucky days and planetary affinities)
const signActivityPreferences: Record<number, Record<ActivityType, string>> = {
  0: { // Aries - Mars ruled, lucky: Tuesday, Saturday
    Interview: 'Tuesday', Travel: 'Thursday', Romance: 'Friday',
    'Health Check': 'Tuesday', 'Financial Decisions': 'Thursday',
    'New Ventures': 'Tuesday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Saturday',
  },
  1: { // Taurus - Venus ruled, lucky: Friday, Monday
    Interview: 'Friday', Travel: 'Monday', Romance: 'Friday',
    'Health Check': 'Monday', 'Financial Decisions': 'Friday',
    'New Ventures': 'Thursday', 'Legal Matters': 'Friday', 'Spiritual Practice': 'Monday',
  },
  2: { // Gemini - Mercury ruled, lucky: Wednesday, Friday
    Interview: 'Wednesday', Travel: 'Wednesday', Romance: 'Friday',
    'Health Check': 'Wednesday', 'Financial Decisions': 'Wednesday',
    'New Ventures': 'Wednesday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Friday',
  },
  3: { // Cancer - Moon ruled, lucky: Monday, Thursday
    Interview: 'Thursday', Travel: 'Monday', Romance: 'Monday',
    'Health Check': 'Monday', 'Financial Decisions': 'Thursday',
    'New Ventures': 'Thursday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Monday',
  },
  4: { // Leo - Sun ruled, lucky: Sunday, Tuesday
    Interview: 'Sunday', Travel: 'Thursday', Romance: 'Sunday',
    'Health Check': 'Tuesday', 'Financial Decisions': 'Sunday',
    'New Ventures': 'Sunday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Sunday',
  },
  5: { // Virgo - Mercury ruled, lucky: Wednesday, Monday
    Interview: 'Wednesday', Travel: 'Wednesday', Romance: 'Friday',
    'Health Check': 'Wednesday', 'Financial Decisions': 'Wednesday',
    'New Ventures': 'Wednesday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Monday',
  },
  6: { // Libra - Venus ruled, lucky: Friday, Wednesday
    Interview: 'Friday', Travel: 'Friday', Romance: 'Friday',
    'Health Check': 'Friday', 'Financial Decisions': 'Friday',
    'New Ventures': 'Thursday', 'Legal Matters': 'Friday', 'Spiritual Practice': 'Wednesday',
  },
  7: { // Scorpio - Mars ruled, lucky: Tuesday, Monday
    Interview: 'Tuesday', Travel: 'Thursday', Romance: 'Monday',
    'Health Check': 'Tuesday', 'Financial Decisions': 'Tuesday',
    'New Ventures': 'Tuesday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Monday',
  },
  8: { // Sagittarius - Jupiter ruled, lucky: Thursday, Sunday
    Interview: 'Thursday', Travel: 'Thursday', Romance: 'Friday',
    'Health Check': 'Thursday', 'Financial Decisions': 'Thursday',
    'New Ventures': 'Thursday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Sunday',
  },
  9: { // Capricorn - Saturn ruled, lucky: Saturday, Friday
    Interview: 'Saturday', Travel: 'Friday', Romance: 'Friday',
    'Health Check': 'Saturday', 'Financial Decisions': 'Saturday',
    'New Ventures': 'Saturday', 'Legal Matters': 'Saturday', 'Spiritual Practice': 'Saturday',
  },
  10: { // Aquarius - Saturn ruled, lucky: Saturday, Wednesday
    Interview: 'Wednesday', Travel: 'Saturday', Romance: 'Friday',
    'Health Check': 'Saturday', 'Financial Decisions': 'Saturday',
    'New Ventures': 'Wednesday', 'Legal Matters': 'Saturday', 'Spiritual Practice': 'Saturday',
  },
  11: { // Pisces - Jupiter ruled, lucky: Thursday, Monday
    Interview: 'Thursday', Travel: 'Thursday', Romance: 'Monday',
    'Health Check': 'Thursday', 'Financial Decisions': 'Thursday',
    'New Ventures': 'Thursday', 'Legal Matters': 'Thursday', 'Spiritual Practice': 'Monday',
  },
};

// ---------- Weekly Remedies Pool ----------

const weeklyRemedies: Record<number, string[]> = {
  0: [ // Aries
    'Fast on Tuesday to strengthen Mars and boost courage throughout the week',
    'Chant the Mangal mantra "Om Kraam Kreem Kraum Sah Bhaumaya Namah" 108 times each morning',
    'Wear red coral or a red thread on your right wrist starting Tuesday morning',
    'Donate red lentils (masoor dal) to the needy every Tuesday this week',
    'Light a ghee lamp near a Hanuman temple on Tuesday and Saturday evenings',
    'Practice Surya Namaskar (Sun Salutations) at dawn each day for physical and spiritual vitality',
  ],
  1: [ // Taurus
    'Fast on Friday to honor Venus and attract abundance and harmony this week',
    'Chant the Shukra mantra "Om Draam Dreem Draum Sah Shukraya Namah" 108 times each evening',
    'Wear a diamond or white sapphire ring on the middle finger for Venus blessings',
    'Offer white flowers to Goddess Lakshmi on Friday morning for financial stability',
    'Donate white clothing or rice to a woman in need on Friday',
    'Apply sandalwood paste on your forehead each morning to attract peace and prosperity',
  ],
  2: [ // Gemini
    'Fast on Wednesday to strengthen Mercury and sharpen intellectual abilities',
    'Chant the Budha mantra "Om Braam Breem Braum Sah Budhaya Namah" 108 times after sunrise',
    'Wear an emerald or green tourmaline on the little finger for enhanced communication',
    'Feed green vegetables to a cow on Wednesday for Mercury\'s blessings',
    'Donate green cloth or moong dal to the needy on Wednesday',
    'Practice Pranayama breathing exercises daily this week to calm the restless Gemini mind',
  ],
  3: [ // Cancer
    'Fast on Monday to honor the Moon and strengthen emotional equilibrium',
    'Chant the Chandra mantra "Om Shraam Shreem Shraum Sah Chandraya Namah" 108 times before bed',
    'Wear a pearl or moonstone ring on the ring finger for emotional balance',
    'Offer milk and white flowers at a Shiva temple on Monday evening',
    'Donate rice and white sweets to the needy on Monday',
    'Place a silver bowl of water on your nightstand to absorb lunar energy while you sleep',
  ],
  4: [ // Leo
    'Fast on Sunday to honor the Sun and amplify leadership energy all week',
    'Chant the Surya mantra "Om Hraam Hreem Hraum Sah Suryaya Namah" 108 times at sunrise',
    'Wear a ruby or garnet on the ring finger to strengthen solar confidence',
    'Offer water to the rising Sun each morning while reciting the Gayatri Mantra',
    'Donate wheat, jaggery, or red cloth to the needy on Sunday',
    'Light a ghee lamp before sunrise daily this week to invoke the Sun\'s blessings',
  ],
  5: [ // Virgo
    'Fast on Wednesday to strengthen Mercury and improve analytical precision this week',
    'Chant the Budha mantra "Om Braam Breem Braum Sah Budhaya Namah" 108 times in the morning',
    'Wear an emerald or peridot on the little finger for clarity and health',
    'Donate green vegetables and fruits to a temple or charity on Wednesday',
    'Feed birds with green grain each morning to attract Mercury\'s favor',
    'Practice mindful eating all week, blessing each meal with gratitude before the first bite',
  ],
  6: [ // Libra
    'Fast on Friday to honor Venus and strengthen relationships this week',
    'Chant the Shukra mantra "Om Draam Dreem Draum Sah Shukraya Namah" 108 times at twilight',
    'Wear a diamond, white sapphire, or opal on the middle finger for harmony',
    'Offer perfume, flowers, and sweets to Goddess Lakshmi on Friday',
    'Donate white silk or cotton cloth to women in need on Friday',
    'Burn jasmine or rose incense in your home each evening to invite Venusian peace and beauty',
  ],
  7: [ // Scorpio
    'Fast on Tuesday to empower Mars and fuel your transformative energy this week',
    'Chant the Mangal mantra "Om Kraam Kreem Kraum Sah Bhaumaya Namah" 108 times before noon',
    'Wear red coral on the ring finger to protect against negative energies',
    'Donate red cloth, jaggery, or lentils to the needy on Tuesday',
    'Light a sesame oil lamp at a Hanuman temple on Tuesday evening',
    'Take a salt bath on Saturday evening to cleanse accumulated psychic energy from the week',
  ],
  8: [ // Sagittarius
    'Fast on Thursday to strengthen Jupiter and expand blessings throughout the week',
    'Chant the Guru mantra "Om Graam Greem Graum Sah Gurave Namah" 108 times before Thursday sunrise',
    'Wear yellow sapphire or citrine on the index finger for wisdom and abundance',
    'Offer yellow flowers and turmeric at a Vishnu temple on Thursday',
    'Donate yellow cloth, chana dal, or books to the needy on Thursday',
    'Read a passage from the Bhagavad Gita or a sacred text each morning this week',
  ],
  9: [ // Capricorn
    'Fast on Saturday to honor Saturn and build patience and perseverance this week',
    'Chant the Shani mantra "Om Praam Preem Praum Sah Shanaischaraya Namah" 108 times on Saturday',
    'Wear blue sapphire or amethyst on the middle finger for Saturn\'s protective blessings',
    'Donate black sesame seeds, mustard oil, or iron items to the needy on Saturday',
    'Light a sesame oil lamp under a Peepal tree on Saturday evening',
    'Practice ten minutes of silent sitting each night this week to cultivate Saturn\'s patience',
  ],
  10: [ // Aquarius
    'Fast on Saturday to honor Saturn and ground innovative visions into reality',
    'Chant the Shani mantra "Om Praam Preem Praum Sah Shanaischaraya Namah" 108 times weekly',
    'Wear blue sapphire or lapis lazuli on the middle finger for focused innovation',
    'Donate black cloth, iron utensils, or sesame seeds on Saturday',
    'Serve food to laborers or underprivileged workers on Saturday afternoon',
    'Spend ten minutes each morning this week visualizing your highest ideals manifesting in the world',
  ],
  11: [ // Pisces
    'Fast on Thursday to strengthen Jupiter and deepen spiritual connection this week',
    'Chant the Guru mantra "Om Graam Greem Graum Sah Gurave Namah" 108 times during evening prayer',
    'Wear yellow sapphire or golden topaz on the index finger for spiritual growth',
    'Offer yellow flowers, turmeric, and sweets at a Vishnu or Lakshmi temple on Thursday',
    'Donate yellow cloth, bananas, or saffron to Brahmins or priests on Thursday',
    'Practice twenty minutes of guided meditation by water each evening this week for deep inner peace',
  ],
};

// ---------- Transit Focus Templates ----------

const transitFocusTemplates: Record<number, string[]> = {
  0: [
    'Mars\' continued transit through your sector of ambition accelerates career progress',
    'Jupiter\'s aspect on your fifth house this week boosts creative expression and romance',
    'Saturn\'s steady presence in your eleventh house strengthens long-term financial gains',
    'The Sun\'s movement through your angular houses reinforces leadership and public image',
    'Venus transiting your relationship axis softens conflicts and deepens emotional bonds',
  ],
  1: [
    'Venus\' favorable transit through your second house magnifies income and material comfort',
    'Jupiter\'s continued aspect on your ninth house encourages spiritual and educational pursuits',
    'Saturn\' steady transit strengthens your career foundation with lasting structural improvements',
    'Mercury\' movement through your communication sector enhances negotiations and contracts',
    'The Moon\'s weekly cycle through your domestic zone deepens family harmony and security',
  ],
  2: [
    'Mercury\'s transit through your first house amplifies personal charisma and communicative power',
    'Jupiter\'s aspect on your seventh house brings fortunate partnership developments this week',
    'Saturn\'s influence on your ninth house demands disciplined expansion of knowledge',
    'Venus transiting your creative sector inspires artistic breakthroughs and romantic sparks',
    'Mars\' movement through your financial zone energizes income-generating activities',
  ],
  3: [
    'The Moon\'s transit through your sign this week heightens intuition and emotional clarity',
    'Jupiter\'s aspect on your fifth house enhances creativity and joy in family relationships',
    'Saturn\'s continued presence in your eighth house deepens transformation and occult insight',
    'Venus\' movement through your domestic sector beautifies the home and nurtures relationships',
    'Mars transiting your tenth house provides ambition and drive for professional achievements',
  ],
  4: [
    'The Sun\'s powerful transit through your sign amplifies confidence, vitality, and visibility',
    'Jupiter\'s aspect on your ninth house expands philosophical understanding and foreign connections',
    'Saturn\'s presence in your seventh house demands maturity and commitment in partnerships',
    'Venus transiting your second house enhances financial luck and aesthetic appreciation',
    'Mercury\'s movement through your eleventh house multiplies social connections and intellectual gains',
  ],
  5: [
    'Mercury\'s transit through your sign sharpens analytical skills and health awareness this week',
    'Jupiter\'s aspect on your fourth house brings blessings to home life and inner contentment',
    'Saturn\'s steady influence on your sixth house strengthens discipline in health and service',
    'Venus\' movement through your eleventh house expands social circles and financial networking',
    'Mars transiting your third house increases courage, initiative, and communicative assertiveness',
  ],
  6: [
    'Venus\' transit through your sign magnifies charm, beauty, and diplomatic prowess this week',
    'Jupiter\'s aspect on your third house encourages creative communication and sibling bonds',
    'Saturn\'s continued presence in your fifth house demands disciplined creative expression',
    'Mercury\'s movement through your fourth house enhances domestic planning and family dialogue',
    'The Sun transiting your career zone illuminates professional achievements and public recognition',
  ],
  7: [
    'Mars\' powerful transit through your sign intensifies determination and transformative power',
    'Jupiter\'s aspect on your second house expands financial opportunities and family wealth',
    'Saturn\'s steady influence on your fourth house restructures domestic foundations and inner peace',
    'Venus transiting your twelfth house enhances private romantic moments and spiritual devotion',
    'Mercury\'s movement through your career sector sharpens professional communication and strategy',
  ],
  8: [
    'Jupiter\'s transit through your sign amplifies optimism, wisdom, and expansive opportunities',
    'Saturn\'s aspect on your third house encourages disciplined communication and focused learning',
    'Venus\' movement through your eleventh house brings social grace and profitable connections',
    'Mars transiting your fifth house ignites creative passion and competitive spirit',
    'The Sun\'s passage through your fourth house strengthens foundations and illuminates family matters',
  ],
  9: [
    'Saturn\'s transit through your sign reinforces ambition, discipline, and structural achievements',
    'Jupiter\'s aspect on your second house brings financial expansion and value-based growth',
    'Venus\' movement through your fifth house enhances romantic prospects and creative enjoyment',
    'Mars transiting your fourth house energizes domestic projects and property matters',
    'Mercury\'s passage through your career sector sharpens professional planning and negotiations',
  ],
  10: [
    'Saturn\'s transit through your sign stabilizes long-term visions with practical frameworks',
    'Jupiter\'s aspect on your home sector brings expansion and comfort to domestic life',
    'Venus\' movement through your fourth house enhances aesthetic improvements at home',
    'Mars transiting your third house boosts courage, initiative, and communication strength',
    'Mercury\'s passage through your wealth sector sharpens financial analysis and investment thinking',
  ],
  11: [
    'Jupiter\'s transit through your sign amplifies spiritual growth, compassion, and creative flow',
    'Saturn\'s aspect on your twelfth house deepens meditation practice and karmic resolution',
    'Venus\' movement through your second house enriches finances and appreciation of beauty',
    'Mars transiting your first house provides assertiveness and physical energy for new beginnings',
    'Mercury\'s passage through your tenth house enhances professional communication and career planning',
  ],
};

// ---------- Helper Functions ----------

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function pickItems<T>(arr: T[], count: number, rand: () => number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function pickOne<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

// ---------- Main Export ----------

export function generateWeeklyPrediction(vedicChart: VedicChart, date: Date): WeeklyPrediction {
  const moonSignIndex = vedicChart.moonSign.index;
  const rashi = rashiDetails[moonSignIndex];
  const weekNumber = getISOWeekNumber(date);
  const year = date.getFullYear();

  // Deterministic seed
  const seed = weekNumber + moonSignIndex * 13 + year;
  const rand = seededRandom(seed);

  // Week boundaries
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekStart = formatDate(monday);
  const weekEnd = formatDate(sunday);

  // Theme and overview
  const themes = weeklyThemes[moonSignIndex];
  const overviews = weeklyOverviews[moonSignIndex];
  const themeIndex = Math.floor(rand() * themes.length);
  const overviewIndex = Math.floor(rand() * overviews.length);
  const theme = themes[themeIndex];
  const overview = overviews[overviewIndex];

  // Ratings: smoothed range 50-85
  const ratingKeys = ['career', 'love', 'health', 'finance', 'overall'];
  const ratings: Record<string, number> = {};
  for (const key of ratingKeys) {
    ratings[key] = Math.round(50 + rand() * 35);
  }

  // Day highlights (Monday through Sunday)
  const luckyDaysSet = new Set(rashi.luckyDays.map((d: string) => d.toLowerCase()));
  const dayHighlights: DayHighlight[] = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const dayOfWeek = dayDate.getDay();
    const dayName = weekdayNames[dayOfWeek];
    const dateStr = formatDate(dayDate);

    // Determine mood
    const isLucky = luckyDaysSet.has(dayName.toLowerCase());
    const moodRoll = rand();
    let mood: DayHighlight['mood'];

    if (isLucky) {
      mood = moodRoll < 0.5 ? 'excellent' : 'good';
    } else {
      if (moodRoll < 0.2) {
        mood = 'good';
      } else if (moodRoll < 0.6) {
        mood = 'mixed';
      } else {
        mood = 'challenging';
      }
    }

    const bestFor = pickItems(dayActivities[mood], 2 + Math.floor(rand() * 2), rand);
    const avoidFor = pickItems(dayAvoidActivities[mood], 1 + Math.floor(rand() * 2), rand);
    const briefNote = pickOne(briefNoteTemplates[mood], rand);
    const detailed = generateDailyContent(moonSignIndex, vedicChart.nakshatra, dayDate);

    dayHighlights.push({
      dayName,
      date: dateStr,
      mood,
      bestFor,
      avoidFor,
      briefNote,
      detailed,
    });
  }

  // Activity recommendations (pick 4 distinct activities)
  const preferences = signActivityPreferences[moonSignIndex];
  const selectedActivities = pickItems([...activityTypes], 4, rand);
  const bestActivities: ActivityRecommendation[] = selectedActivities.map((activity) => {
    const bestDay = preferences[activity];
    const reason = activityReasons[activity][bestDay];
    return { activity, bestDay, reason };
  });

  // Transit focus (pick 3)
  const transits = transitFocusTemplates[moonSignIndex];
  const transitFocus = pickItems(transits, 3, rand);

  // Remedies (pick 3)
  const remedyPool = weeklyRemedies[moonSignIndex];
  const remedies = pickItems(remedyPool, 3, rand);

  return {
    weekStart,
    weekEnd,
    theme,
    overview,
    ratings,
    dayHighlights,
    transitFocus,
    remedies,
    bestActivities,
  };
}
