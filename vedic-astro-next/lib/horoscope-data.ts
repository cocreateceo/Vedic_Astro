/**
 * Vedic Horoscope Data - Based on Classical Vedic Astrology Texts
 *
 * Sources & References:
 * - Brihat Parashara Hora Shastra (BPHS)
 * - Phaladeepika by Mantreshwara
 * - Brihat Jataka by Varahamihira
 * - Jataka Parijata
 * - Saravali by Kalyana Varma
 */

import {
  RashiDetail,
  NakshatraDetail,
  DailyPredictions,
  HouseSignification,
  VedicChart,
  HoroscopeData,
  PlanetAnalysis,
  DailyTimings,
  DayDetailedReport,
  TimePeriod,
} from '@/types';
import { generateWeeklyPrediction } from '@/lib/weekly-predictions';
import { generateMonthlyPrediction } from '@/lib/monthly-predictions';
import { generatePanchangaPredictions } from '@/lib/panchanga-predictions';
import { generateAllBhavaPredictions } from '@/lib/bhava-predictions';
import { calculatePanchang } from '@/lib/panchang';
import { functionalBeneficsMap, mostMaleficMap } from '@/lib/vedic-constants';

// ---------- Rashi (Moon Sign) Details ----------

export const rashiDetails: Record<number, RashiDetail> = {
  0: {
    name: 'Aries', sanskrit: 'Mesha', ruler: 'Mars (Mangal)', element: 'Fire (Agni)',
    quality: 'Cardinal (Chara)', nature: 'Fierce (Krura)', bodyPart: 'Head', direction: 'East',
    gem: 'Red Coral', deity: 'Lord Kartikeya',
    characteristics: 'Courageous, pioneering, energetic, competitive. Natural leaders with strong willpower.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Aries is valorous, fond of war, head of an army, skilled in riding, with reddish eyes and round knees. They are quick-witted, fond of travel, easily angered but equally quick to forgive. They acquire wealth through their own effort and are respected for their courage." Also:"The person born under Mesha is fond of travel, is heroic, and has a broad forehead."',
    strengths: ['Leadership', 'Courage', 'Initiative', 'Determination', 'Independence'],
    challenges: ['Impatience', 'Aggression', 'Impulsiveness', 'Short temper'],
    compatibleSigns: [4, 8, 0],
    career: ['Military', 'Sports', 'Surgery', 'Engineering', 'Entrepreneurship'],
    luckyNumbers: [9, 1, 8], luckyColors: ['Red', 'Scarlet', 'Orange'], luckyDays: ['Tuesday', 'Saturday'],
    mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
  },
  1: {
    name: 'Taurus', sanskrit: 'Vrishabha', ruler: 'Venus (Shukra)', element: 'Earth (Prithvi)',
    quality: 'Fixed (Sthira)', nature: 'Gentle (Soumya)', bodyPart: 'Face, Throat', direction: 'South',
    gem: 'Diamond', deity: 'Goddess Lakshmi',
    characteristics: 'Patient, reliable, devoted, responsible. Values security and material comfort.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Taurus has a broad thighs, face, and forehead. They are fond of pleasures, have an attractive physique, and are patient in disposition. They are endowed with lands, cattle, and wealth. Generous and forgiving, they are firm in friendship and strong in constitution." Also:"Born under Vrishabha, one is patient, happy, and endowed with good qualities."',
    strengths: ['Patience', 'Reliability', 'Determination', 'Practicality', 'Sensuality'],
    challenges: ['Stubbornness', 'Possessiveness', 'Resistance to change', 'Materialism'],
    compatibleSigns: [1, 5, 9],
    career: ['Finance', 'Agriculture', 'Arts', 'Real Estate', 'Hospitality'],
    luckyNumbers: [6, 5, 8], luckyColors: ['White', 'Green', 'Pink'], luckyDays: ['Friday', 'Monday'],
    mantra: 'Om Draam Dreem Draum Sah Shukraya Namah',
  },
  2: {
    name: 'Gemini', sanskrit: 'Mithuna', ruler: 'Mercury (Budha)', element: 'Air (Vayu)',
    quality: 'Dual (Dvisvabhava)', nature: 'Gentle (Soumya)', bodyPart: 'Arms, Shoulders', direction: 'West',
    gem: 'Emerald', deity: 'Lord Vishnu',
    characteristics: 'Intelligent, communicative, adaptable, curious. Natural learners and communicators.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Gemini is skilled in scriptures, arts, and music. They are soft-spoken, fond of women, and possess an attractive body. They are wealthy, of dual nature, clever in trade and diplomacy." Also:"Born under Mithuna, one is fond of women, skilled in sciences, and of good speech."',
    strengths: ['Communication', 'Adaptability', 'Intelligence', 'Wit', 'Versatility'],
    challenges: ['Inconsistency', 'Nervousness', 'Superficiality', 'Indecision'],
    compatibleSigns: [2, 6, 10],
    career: ['Writing', 'Teaching', 'Sales', 'Media', 'Technology'],
    luckyNumbers: [5, 3, 6], luckyColors: ['Green', 'Yellow', 'Light Blue'], luckyDays: ['Wednesday', 'Friday'],
    mantra: 'Om Braam Breem Braum Sah Budhaya Namah',
  },
  3: {
    name: 'Cancer', sanskrit: 'Karka', ruler: 'Moon (Chandra)', element: 'Water (Jala)',
    quality: 'Cardinal (Chara)', nature: 'Gentle (Soumya)', bodyPart: 'Chest, Stomach', direction: 'North',
    gem: 'Pearl', deity: 'Goddess Parvati',
    characteristics: 'Nurturing, protective, emotional, intuitive. Deep connection to home and family.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Cancer is fond of water, possesses houses and gardens, is disturbed in mind at times, and has a plump body. They are fond of their mother, gain through water-related activities, and are attached to their home and traditions." Also:"Born under Karka, one is wealthy, influenced by women, and walks with a swaying gait."',
    strengths: ['Intuition', 'Nurturing', 'Emotional depth', 'Loyalty', 'Imagination'],
    challenges: ['Moodiness', 'Over-sensitivity', 'Clinginess', 'Pessimism'],
    compatibleSigns: [3, 7, 11],
    career: ['Healthcare', 'Social Work', 'Real Estate', 'Food Industry', 'Psychology'],
    luckyNumbers: [2, 7, 9], luckyColors: ['White', 'Silver', 'Cream'], luckyDays: ['Monday', 'Thursday'],
    mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
  },
  4: {
    name: 'Leo', sanskrit: 'Simha', ruler: 'Sun (Surya)', element: 'Fire (Agni)',
    quality: 'Fixed (Sthira)', nature: 'Fierce (Krura)', bodyPart: 'Heart, Spine', direction: 'East',
    gem: 'Ruby', deity: 'Lord Shiva',
    characteristics: 'Confident, dramatic, generous, proud. Natural performers with royal bearing.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Leo has a broad chest and prominent face. They are bold, proud, and fond of meat and forests. They are generous, have few children, and are irascible. They possess commanding leadership and are honored by the state." Also:"Born under Simha, one has a broad face, is proud, and wanders in forests and mountains."',
    strengths: ['Leadership', 'Generosity', 'Creativity', 'Confidence', 'Loyalty'],
    challenges: ['Pride', 'Arrogance', 'Stubbornness', 'Need for attention'],
    compatibleSigns: [0, 4, 8],
    career: ['Entertainment', 'Politics', 'Management', 'Teaching', 'Luxury Goods'],
    luckyNumbers: [1, 4, 9], luckyColors: ['Gold', 'Orange', 'Yellow'], luckyDays: ['Sunday', 'Tuesday'],
    mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
  },
  5: {
    name: 'Virgo', sanskrit: 'Kanya', ruler: 'Mercury (Budha)', element: 'Earth (Prithvi)',
    quality: 'Dual (Dvisvabhava)', nature: 'Gentle (Soumya)', bodyPart: 'Intestines, Nervous System', direction: 'South',
    gem: 'Emerald', deity: 'Lord Vishnu',
    characteristics: 'Analytical, practical, diligent, modest. Perfectionist with attention to detail.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Virgo has a feminine body, is sweet in speech, and well-versed in writing and mathematics. They are modest, learned in arts and sciences, and possess skill in various crafts. They are helpful to others and earn through intellectual pursuits." Also:"Born under Kanya, one is modest, skilled in arts, and has a soft body."',
    strengths: ['Analysis', 'Precision', 'Service', 'Health consciousness', 'Practicality'],
    challenges: ['Over-criticism', 'Worry', 'Perfectionism', 'Shyness'],
    compatibleSigns: [1, 5, 9],
    career: ['Healthcare', 'Accounting', 'Research', 'Editing', 'Quality Control'],
    luckyNumbers: [5, 2, 7], luckyColors: ['Green', 'White', 'Gray'], luckyDays: ['Wednesday', 'Monday'],
    mantra: 'Om Braam Breem Braum Sah Budhaya Namah',
  },
  6: {
    name: 'Libra', sanskrit: 'Tula', ruler: 'Venus (Shukra)', element: 'Air (Vayu)',
    quality: 'Cardinal (Chara)', nature: 'Gentle (Soumya)', bodyPart: 'Kidneys, Lower Back', direction: 'West',
    gem: 'Diamond', deity: 'Goddess Lakshmi',
    characteristics: 'Balanced, diplomatic, artistic, harmonious. Natural peacemakers and aesthetes.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Libra is skilled in trade and commerce, worships gods and Brahmins, and is intelligent and wealthy. They are fond of traveling, have an agreeable nature, and excel in weighing and measuring things. They value justice and balance above all." Also:"Born under Tula, one is a trader, devoted to the gods, and skilled in scales."',
    strengths: ['Diplomacy', 'Fairness', 'Aesthetic sense', 'Partnership', 'Balance'],
    challenges: ['Indecision', 'People-pleasing', 'Avoidance of conflict', 'Dependency'],
    compatibleSigns: [2, 6, 10],
    career: ['Law', 'Diplomacy', 'Arts', 'Fashion', 'Interior Design'],
    luckyNumbers: [6, 9, 5], luckyColors: ['White', 'Light Blue', 'Pink'], luckyDays: ['Friday', 'Wednesday'],
    mantra: 'Om Draam Dreem Draum Sah Shukraya Namah',
  },
  7: {
    name: 'Scorpio', sanskrit: 'Vrishchika', ruler: 'Mars (Mangal)', element: 'Water (Jala)',
    quality: 'Fixed (Sthira)', nature: 'Fierce (Krura)', bodyPart: 'Reproductive Organs', direction: 'North',
    gem: 'Red Coral', deity: 'Lord Kartikeya',
    characteristics: 'Intense, passionate, resourceful, powerful. Deep emotional nature with transformative ability.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Scorpio has a broad chest, round thighs, and large eyes. They are fierce, bold, and harsh in speech but loyal to friends. They possess hidden strength, interest in occult sciences, and earn through secret or investigative means." Also:"Born under Vrishchika, one has round knees and a broad chest, is bold and secretive."',
    strengths: ['Determination', 'Passion', 'Research ability', 'Intuition', 'Resourcefulness'],
    challenges: ['Jealousy', 'Secrecy', 'Manipulation', 'Obsessiveness'],
    compatibleSigns: [3, 7, 11],
    career: ['Research', 'Surgery', 'Investigation', 'Psychology', 'Occult Sciences'],
    luckyNumbers: [9, 4, 2], luckyColors: ['Red', 'Maroon', 'Black'], luckyDays: ['Tuesday', 'Monday'],
    mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
  },
  8: {
    name: 'Sagittarius', sanskrit: 'Dhanu', ruler: 'Jupiter (Guru)', element: 'Fire (Agni)',
    quality: 'Dual (Dvisvabhava)', nature: 'Gentle (Soumya)', bodyPart: 'Thighs, Hips', direction: 'East',
    gem: 'Yellow Sapphire', deity: 'Lord Dattatreya',
    characteristics: 'Optimistic, philosophical, adventurous, honest. Natural teachers and explorers.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Sagittarius has a long face and prominent nose. They are devoted to gods and teachers, skilled in archery and scriptures, and possess poetic talent. They are truthful, grateful, and fond of walking and outdoor activities." Also:"Born under Dhanu, one is skilled in archery, has a beautiful figure, and is righteous."',
    strengths: ['Optimism', 'Wisdom', 'Adventure', 'Generosity', 'Honesty'],
    challenges: ['Tactlessness', 'Restlessness', 'Over-confidence', 'Irresponsibility'],
    compatibleSigns: [0, 4, 8],
    career: ['Teaching', 'Law', 'Travel', 'Publishing', 'Philosophy'],
    luckyNumbers: [3, 9, 6], luckyColors: ['Yellow', 'Orange', 'Light Blue'], luckyDays: ['Thursday', 'Sunday'],
    mantra: 'Om Graam Greem Graum Sah Gurave Namah',
  },
  9: {
    name: 'Capricorn', sanskrit: 'Makara', ruler: 'Saturn (Shani)', element: 'Earth (Prithvi)',
    quality: 'Cardinal (Chara)', nature: 'Fierce (Krura)', bodyPart: 'Knees, Bones', direction: 'South',
    gem: 'Blue Sapphire', deity: 'Lord Shani',
    characteristics: 'Ambitious, disciplined, patient, practical. Natural organizers with long-term vision.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Capricorn is lean in the lower body, has a long neck, and is fond of women. They are idle in youth but gain through persistent effort in later life. They are skilled in music and arts, and become wealthy through discipline." Also:"Born under Makara, one is lazy at first, fond of wandering, and gains wealth through effort."',
    strengths: ['Discipline', 'Ambition', 'Patience', 'Responsibility', 'Practicality'],
    challenges: ['Pessimism', 'Coldness', 'Workaholism', 'Rigidity'],
    compatibleSigns: [1, 5, 9],
    career: ['Management', 'Government', 'Banking', 'Construction', 'Administration'],
    luckyNumbers: [8, 4, 6], luckyColors: ['Black', 'Blue', 'Brown'], luckyDays: ['Saturday', 'Friday'],
    mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah',
  },
  10: {
    name: 'Aquarius', sanskrit: 'Kumbha', ruler: 'Saturn (Shani)', element: 'Air (Vayu)',
    quality: 'Fixed (Sthira)', nature: 'Fierce (Krura)', bodyPart: 'Ankles, Calves', direction: 'West',
    gem: 'Blue Sapphire', deity: 'Lord Shani',
    characteristics: 'Innovative, humanitarian, independent, intellectual. Visionaries ahead of their time.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Aquarius has a tall body and is fond of water. They are of clean habits, truthful in speech, and skilled in sciences. They may face sorrows from women but gain through original thinking and group activities. They are devoted to truth and justice." Also:"Born under Kumbha, one is fond of perfumes and water, and speaks truthfully."',
    strengths: ['Innovation', 'Humanitarianism', 'Independence', 'Originality', 'Friendship'],
    challenges: ['Detachment', 'Unpredictability', 'Stubbornness', 'Aloofness'],
    compatibleSigns: [2, 6, 10],
    career: ['Technology', 'Science', 'Social Work', 'Aviation', 'Astrology'],
    luckyNumbers: [4, 8, 7], luckyColors: ['Blue', 'Electric Blue', 'Violet'], luckyDays: ['Saturday', 'Wednesday'],
    mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah',
  },
  11: {
    name: 'Pisces', sanskrit: 'Meena', ruler: 'Jupiter (Guru)', element: 'Water (Jala)',
    quality: 'Dual (Dvisvabhava)', nature: 'Gentle (Soumya)', bodyPart: 'Feet, Lymphatic System', direction: 'North',
    gem: 'Yellow Sapphire', deity: 'Lord Vishnu',
    characteristics: 'Compassionate, intuitive, artistic, spiritual. Natural healers with deep empathy.',
    classicalDescription: 'Classical texts state:"The native born with Moon in Pisces has a well-proportioned body, bright eyes, and is learned. They are fond of women, skilled in art and music, and overcome enemies through wit rather than force. They gain wealth through water-related activities and possess an innately spiritual nature." Also:"Born under Meena, one is fond of the opposite sex, beautiful, and skilled in many arts."',
    strengths: ['Compassion', 'Intuition', 'Creativity', 'Spirituality', 'Imagination'],
    challenges: ['Escapism', 'Over-sensitivity', 'Victim mentality', 'Boundaries'],
    compatibleSigns: [3, 7, 11],
    career: ['Arts', 'Music', 'Healing', 'Spirituality', 'Social Work'],
    luckyNumbers: [3, 7, 12], luckyColors: ['Yellow', 'Sea Green', 'Lavender'], luckyDays: ['Thursday', 'Monday'],
    mantra: 'Om Graam Greem Graum Sah Gurave Namah',
  },
};

// ---------- Nakshatra (Birth Star) Details ----------

export const nakshatraDetails: Record<string, NakshatraDetail> = {
  'Ashwini': { deity: 'Ashwini Kumaras', ruler: 'Ketu', symbol: "Horse's Head", nature: 'Light/Swift (Laghu)', qualities: 'Healing, speed, pioneering, youthful energy', careers: ['Medicine', 'Racing', 'Transportation', 'Healing'], mantra: 'Om Ashwini Kumarabhyam Namah' },
  'Bharani': { deity: 'Yama', ruler: 'Venus', symbol: 'Yoni (Female Organ)', nature: 'Fierce (Ugra)', qualities: 'Transformation, restraint, creativity', careers: ['Judiciary', 'Arts', 'Birth/Death related', 'Entertainment'], mantra: 'Om Yamaaya Namah' },
  'Krittika': { deity: 'Agni', ruler: 'Sun', symbol: 'Razor/Flame', nature: 'Mixed (Mishra)', qualities: 'Purification, determination, fame', careers: ['Military', 'Cooking', 'Criticism', 'Leadership'], mantra: 'Om Agnaye Namah' },
  'Rohini': { deity: 'Brahma', ruler: 'Moon', symbol: 'Ox Cart', nature: 'Fixed (Dhruva)', qualities: 'Growth, beauty, fertility, creativity', careers: ['Fashion', 'Agriculture', 'Arts', 'Luxury goods'], mantra: 'Om Brahmaaya Namah' },
  'Mrigashira': { deity: 'Soma (Moon)', ruler: 'Mars', symbol: "Deer's Head", nature: 'Gentle (Mridu)', qualities: 'Curiosity, search, gentleness', careers: ['Research', 'Travel', 'Writing', 'Perfumery'], mantra: 'Om Somaaya Namah' },
  'Ardra': { deity: 'Rudra', ruler: 'Rahu', symbol: 'Teardrop', nature: 'Sharp (Tikshna)', qualities: 'Transformation, effort, intensity', careers: ['Technology', 'Research', 'Destruction/Construction', 'Psychology'], mantra: 'Om Rudraaya Namah' },
  'Punarvasu': { deity: 'Aditi', ruler: 'Jupiter', symbol: 'Bow and Quiver', nature: 'Moveable (Chara)', qualities: 'Renewal, restoration, return to goodness', careers: ['Teaching', 'Counseling', 'Recovery', 'Spirituality'], mantra: 'Om Aditye Namah' },
  'Pushya': { deity: 'Brihaspati', ruler: 'Saturn', symbol: "Cow's Udder", nature: 'Light (Laghu)', qualities: 'Nourishment, protection, auspicious', careers: ['Counseling', 'Politics', 'Dairy', 'Education'], mantra: 'Om Brihaspataye Namah' },
  'Ashlesha': { deity: 'Nagas (Serpents)', ruler: 'Mercury', symbol: 'Coiled Serpent', nature: 'Sharp (Tikshna)', qualities: 'Kundalini, wisdom, mysticism', careers: ['Occult', 'Psychology', 'Pharmacy', 'Politics'], mantra: 'Om Sarpebhyo Namah' },
  'Magha': { deity: 'Pitris (Ancestors)', ruler: 'Ketu', symbol: 'Royal Throne', nature: 'Fierce (Ugra)', qualities: 'Authority, ancestry, tradition', careers: ['Government', 'History', 'Genealogy', 'Leadership'], mantra: 'Om Pitribhyo Namah' },
  'Purva Phalguni': { deity: 'Bhaga', ruler: 'Venus', symbol: 'Front Legs of Bed', nature: 'Fierce (Ugra)', qualities: 'Pleasure, creativity, love, fortune', careers: ['Entertainment', 'Arts', 'Marriage', 'Luxury'], mantra: 'Om Bhagaaya Namah' },
  'Uttara Phalguni': { deity: 'Aryaman', ruler: 'Sun', symbol: 'Back Legs of Bed', nature: 'Fixed (Dhruva)', qualities: 'Prosperity, contracts, friendship', careers: ['Social Work', 'Contracts', 'Partnerships', 'Healing'], mantra: 'Om Aryamne Namah' },
  'Hasta': { deity: 'Savitar (Sun)', ruler: 'Moon', symbol: 'Hand', nature: 'Light (Laghu)', qualities: 'Skill, cleverness, healing hands', careers: ['Crafts', 'Healing', 'Commerce', 'Writing'], mantra: 'Om Savitre Namah' },
  'Chitra': { deity: 'Tvashtar (Celestial Architect)', ruler: 'Mars', symbol: 'Bright Jewel', nature: 'Gentle (Mridu)', qualities: 'Creativity, beauty, architecture', careers: ['Architecture', 'Fashion', 'Jewelry', 'Design'], mantra: 'Om Tvashtre Namah' },
  'Swati': { deity: 'Vayu (Wind)', ruler: 'Rahu', symbol: 'Coral', nature: 'Moveable (Chara)', qualities: 'Independence, flexibility, movement', careers: ['Trade', 'Travel', 'Business', 'Technology'], mantra: 'Om Vaayave Namah' },
  'Vishakha': { deity: 'Indra-Agni', ruler: 'Jupiter', symbol: 'Triumphal Arch', nature: 'Mixed (Mishra)', qualities: 'Determination, goal-oriented, success', careers: ['Politics', 'Research', 'Speaking', 'Leadership'], mantra: 'Om Indraagnibhyaam Namah' },
  'Anuradha': { deity: 'Mitra (Sun, Friend)', ruler: 'Saturn', symbol: 'Lotus', nature: 'Gentle (Mridu)', qualities: 'Devotion, friendship, success in foreign lands', careers: ['Organizations', 'Foreign travel', 'Music', 'Diplomacy'], mantra: 'Om Mitraaya Namah' },
  'Jyeshtha': { deity: 'Indra', ruler: 'Mercury', symbol: 'Circular Amulet', nature: 'Sharp (Tikshna)', qualities: 'Seniority, protection, heroism', careers: ['Military', 'Protection', 'Occult', 'Administration'], mantra: 'Om Indraaya Namah' },
  'Mula': { deity: 'Nirriti (Goddess of Destruction)', ruler: 'Ketu', symbol: 'Bunch of Roots', nature: 'Sharp (Tikshna)', qualities: 'Investigation, roots, destruction for renewal', careers: ['Research', 'Medicine', 'Destruction', 'Spirituality'], mantra: 'Om Nirritaye Namah' },
  'Purva Ashadha': { deity: 'Apas (Water)', ruler: 'Venus', symbol: 'Elephant Tusk', nature: 'Fierce (Ugra)', qualities: 'Invincibility, purification, early victory', careers: ['Water works', 'Shipping', 'Beauty', 'Counseling'], mantra: 'Om Adbhyo Namah' },
  'Uttara Ashadha': { deity: 'Vishwadevas', ruler: 'Sun', symbol: 'Elephant Tusk', nature: 'Fixed (Dhruva)', qualities: 'Final victory, righteousness, leadership', careers: ['Government', 'Leadership', 'Military', 'Social service'], mantra: 'Om Vishvadevebhyo Namah' },
  'Shravana': { deity: 'Vishnu', ruler: 'Moon', symbol: 'Three Footprints', nature: 'Moveable (Chara)', qualities: 'Learning, listening, connection', careers: ['Teaching', 'Media', 'Counseling', 'Languages'], mantra: 'Om Vishnave Namah' },
  'Dhanishta': { deity: 'Eight Vasus', ruler: 'Mars', symbol: 'Drum', nature: 'Moveable (Chara)', qualities: 'Wealth, fame, music, versatility', careers: ['Music', 'Real estate', 'Sports', 'Science'], mantra: 'Om Vasubhyo Namah' },
  'Shatabhisha': { deity: 'Varuna', ruler: 'Rahu', symbol: 'Empty Circle', nature: 'Moveable (Chara)', qualities: 'Healing, mysticism, solitude', careers: ['Healing', 'Technology', 'Space', 'Electricity'], mantra: 'Om Varunaya Namah' },
  'Purva Bhadrapada': { deity: 'Aja Ekapada', ruler: 'Jupiter', symbol: 'Front of Funeral Cot', nature: 'Fierce (Ugra)', qualities: 'Transformation, intensity, spirituality', careers: ['Occult', 'Astrology', 'Philanthropy', 'Writing'], mantra: 'Om Aja Ekapaade Namah' },
  'Uttara Bhadrapada': { deity: 'Ahir Budhnya', ruler: 'Saturn', symbol: 'Back of Funeral Cot', nature: 'Fixed (Dhruva)', qualities: 'Wisdom, discipline, kundalini, depth', careers: ['Yoga', 'Spirituality', 'Charity', 'Research'], mantra: 'Om Ahir Budhnyaaya Namah' },
  'Revati': { deity: 'Pushan (Nourisher)', ruler: 'Mercury', symbol: 'Fish/Drum', nature: 'Gentle (Mridu)', qualities: 'Protection, nourishment, safe journey', careers: ['Travel', 'Fostering', 'Roads', 'Dairy'], mantra: 'Om Pushne Namah' },
};

// ---------- Daily Predictions Template by Rashi ----------

export const dailyPredictions: Record<number, DailyPredictions> = {
  0: {
    themes: ['initiative', 'energy', 'leadership', 'courage', 'action'],
    generalPositive: [
      'Mars energizes your chart bringing dynamic opportunities for new beginnings. Your natural leadership shines brightly today.',
      'Your ruling planet Mars bestows courage and determination. Take bold steps toward your goals with confidence.',
      'The cosmic energy favors action and initiative. Trust your instincts when making important decisions today.',
      'A powerful day for asserting yourself professionally. Your energy attracts success and recognition.',
      'Your pioneering spirit is amplified. This is an excellent day for starting new ventures or physical activities.',
    ],
    generalChallenging: [
      'Mars aspects suggest potential for conflicts. Channel your energy into constructive activities rather than arguments.',
      'Impulsive decisions may lead to regrets. Take a moment to reflect before acting on sudden urges.',
      'High energy may manifest as restlessness. Physical exercise will help channel this productively.',
      'Competitive situations require diplomacy. Your natural assertiveness should be balanced with consideration for others.',
    ],
    careerPositive: [
      'Professional opportunities arise through bold action. Your leadership qualities are recognized by superiors.',
      'Excellent day for negotiations and presentations. Your confidence inspires trust in your abilities.',
      'New projects benefit from your initiative. Take charge and others will follow your lead.',
    ],
    careerChallenging: [
      'Workplace conflicts may arise if you\'re too assertive. Balance confidence with collaboration.',
      'Avoid rushing important career decisions. Patience today prevents problems tomorrow.',
    ],
    lovePositive: [
      'Passion runs high in romantic matters. Express your feelings with courage and authenticity.',
      'Your magnetic energy attracts admirers. Singles may find exciting new connections today.',
      'Adventure and spontaneity strengthen existing relationships. Plan something exciting with your partner.',
    ],
    loveChallenging: [
      'Impatience in relationships may cause friction. Practice understanding with your loved ones.',
      'Control tendencies toward jealousy or possessiveness. Trust and freedom strengthen bonds.',
    ],
    healthAdvice: [
      'High energy supports vigorous physical activity. Channel any restlessness into exercise.',
      'Pay attention to head and face areas. Avoid overexertion that may lead to tension headaches.',
      'Your vitality is strong. Use this energy for fitness goals and outdoor activities.',
    ],
    remedies: [
      "Recite Mangal Beej Mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 11 times",
      "Wear red or orange colored clothing for Mars's blessings",
      'Donate red lentils or jaggery on Tuesday',
      'Offer water to the rising Sun for vitality',
      'Light a red candle or lamp in the evening for protection',
    ],
  },
  1: {
    themes: ['stability', 'material comfort', 'beauty', 'patience', 'sensuality'],
    generalPositive: [
      'Venus blesses your chart with harmony and material blessings. Financial matters show positive movement.',
      'Your patience and persistence are rewarded today. Steady progress toward goals brings satisfaction.',
      'Beauty and comfort enhance your day. This is favorable for purchases and aesthetic improvements.',
      "Relationships flourish under Venus's graceful influence. Express love through tangible gestures.",
      'Your practical wisdom guides good decisions. Trust your instincts about financial matters.',
    ],
    generalChallenging: [
      'Resistance to change may limit opportunities. Consider new approaches with an open mind.',
      'Material attachments may cause stress. Remember that true security comes from within.',
      'Stubbornness could create relationship friction. Flexibility brings greater harmony.',
      'Overindulgence in pleasures may have consequences. Practice moderation in all things.',
    ],
    careerPositive: [
      'Financial matters and investments show promise. Your reliability earns trust from colleagues.',
      'Steady work brings recognition. Your methodical approach solves complex problems.',
      'Good day for real estate, banking, or beauty-related fields. Venus supports material gains.',
    ],
    careerChallenging: [
      'Reluctance to adapt may hinder progress. Embrace innovation while maintaining quality.',
      'Avoid power struggles over resources. Collaboration yields better results than competition.',
    ],
    lovePositive: [
      'Sensual pleasures and romantic gestures are favored. Express love through touch and comfort.',
      'Loyalty deepens existing bonds. Partners appreciate your steadfast devotion.',
      'Singles attract through charm and stability. Your grounded nature appeals to potential partners.',
    ],
    loveChallenging: [
      'Possessiveness may strain relationships. Trust in your connection without controlling outcomes.',
      'Avoid stubbornness in romantic disagreements. Compromise strengthens rather than weakens love.',
    ],
    healthAdvice: [
      'Focus on throat and neck health. Singing or gentle neck exercises are beneficial.',
      'Enjoy healthy, delicious foods. Your connection to physical pleasures supports well-being.',
      'Avoid overindulgence despite temptations. Balance enjoyment with moderation.',
    ],
    remedies: [
      "Recite Shukra Beej Mantra: 'Om Draam Dreem Draum Sah Shukraya Namah' 16 times",
      "Wear white or light green clothing for Venus's blessings",
      'Offer white flowers to Goddess Lakshmi on Friday',
      'Donate rice or white sweets to young women',
      'Apply sandalwood tilak for peace and prosperity',
    ],
  },
  2: {
    themes: ['communication', 'learning', 'adaptability', 'curiosity', 'wit'],
    generalPositive: [
      'Mercury enhances your natural communication abilities. Express ideas with clarity and charm.',
      'Learning and intellectual pursuits are highly favored. Your curiosity leads to valuable discoveries.',
      'Versatility serves you well today. Multiple opportunities compete for your attention.',
      'Social connections bring opportunities. Networking and conversations open new doors.',
      'Quick thinking solves problems efficiently. Your mental agility is at peak performance.',
    ],
    generalChallenging: [
      'Scattered energy may reduce effectiveness. Focus on priorities rather than multitasking.',
      'Nervous energy requires grounding. Take breaks to prevent mental exhaustion.',
      'Superficial approaches may miss deeper understanding. Dive beneath the surface when needed.',
      'Inconsistency could frustrate others. Follow through on commitments made.',
    ],
    careerPositive: [
      'Writing, teaching, and communication roles excel. Your ideas receive positive reception.',
      'Negotiations and sales conversations go smoothly. Your wit and charm win people over.',
      'Learning new skills or technologies comes easily. Invest in your knowledge base.',
    ],
    careerChallenging: [
      'Avoid spreading yourself too thin professionally. Quality matters more than quantity.',
      "Double-check details in important communications. Mercury's speed may cause oversights.",
    ],
    lovePositive: [
      'Intellectual connection deepens romantic bonds. Engage in stimulating conversations with your partner.',
      'Singles attract through wit and charm. Your communicative nature draws interesting connections.',
      'Flirtation and playful exchanges enliven relationships. Keep things light and fun.',
    ],
    loveChallenging: [
      'Avoid over-analyzing romantic situations. Sometimes feelings matter more than logic.',
      'Restlessness may be mistaken for disinterest. Reassure your partner of your commitment.',
    ],
    healthAdvice: [
      'Mental activity is high - take breaks to prevent nervous exhaustion.',
      'Focus on lung health and proper breathing. Pranayama exercises are beneficial.',
      'Avoid overthinking that disrupts sleep. Practice relaxation techniques before bed.',
    ],
    remedies: [
      "Recite Budha Beej Mantra: 'Om Braam Breem Braum Sah Budhaya Namah' 9 times",
      "Wear green or yellow clothing for Mercury's blessings",
      'Donate green vegetables or books on Wednesday',
      'Read or recite Vishnu Sahasranama for mental clarity',
      "Keep tulsi plant and water it daily for Mercury's grace",
    ],
  },
  3: {
    themes: ['nurturing', 'intuition', 'home', 'emotions', 'protection'],
    generalPositive: [
      'The Moon heightens your intuitive abilities. Trust the wisdom of your inner voice.',
      'Home and family matters bring joy and fulfillment. Nurturing activities are especially rewarding.',
      'Emotional connections deepen with loved ones. Your caring nature strengthens bonds.',
      'Creative and imaginative faculties are enhanced. Artistic pursuits flow naturally.',
      'Protective instincts guide wise decisions. Your nurturing serves both self and others.',
    ],
    generalChallenging: [
      'Emotional sensitivity may cause overreactions. Ground yourself before responding to situations.',
      'Mood fluctuations require self-awareness. Honor your feelings without being controlled by them.',
      'Clinging to the past may limit present opportunities. Let go of what no longer serves you.',
      'Over-protectiveness could stifle growth. Balance care with allowing independence.',
    ],
    careerPositive: [
      'Caring and service-oriented work thrives. Your nurturing approach benefits colleagues and clients.',
      'Creative projects benefit from emotional depth. Channel feelings into productive expressions.',
      'Real estate and home-related businesses show promise. Trust your instincts in decisions.',
    ],
    careerChallenging: [
      'Emotional reactions may affect professional judgments. Maintain boundaries in workplace matters.',
      'Avoid taking professional criticism personally. Separate work from emotional well-being.',
    ],
    lovePositive: [
      'Deep emotional connections are possible today. Open your heart to intimate sharing.',
      'Creating a nurturing home environment strengthens relationships. Domestic activities bond couples.',
      'Singles attract through genuine care and empathy. Your sensitivity appeals to compatible partners.',
    ],
    loveChallenging: [
      'Moodiness may create misunderstandings with partners. Communicate your emotional needs clearly.',
      'Avoid retreating into your shell during relationship challenges. Vulnerability strengthens bonds.',
    ],
    healthAdvice: [
      'Emotional well-being directly affects physical health. Practice self-care and nurturing.',
      'Pay attention to stomach and digestive health. Eat emotionally comforting but healthy foods.',
      'Water-based activities are therapeutic. Swimming or bathing brings relaxation and renewal.',
    ],
    remedies: [
      "Recite Chandra Beej Mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah' 11 times",
      "Wear white, silver, or cream colored clothing for Moon's blessings",
      'Offer milk to Shiva Lingam on Monday',
      'Keep fast on Mondays for emotional balance',
      'Honor your mother or maternal figures with respect and service',
    ],
  },
  4: {
    themes: ['creativity', 'leadership', 'confidence', 'generosity', 'recognition'],
    generalPositive: [
      'The Sun illuminates your natural charisma and leadership. Shine brightly in all endeavors.',
      'Creative expression and performance are highly favored. Your talents receive well-deserved recognition.',
      'Confidence and generosity attract positive attention. Lead with heart and courage.',
      'Recognition and appreciation come your way. Your efforts are seen and valued by others.',
      'Your natural dignity inspires respect. Carry yourself with pride and authenticity.',
    ],
    generalChallenging: [
      'Pride may become excessive. Balance confidence with humility for best results.',
      'Need for attention could overshadow others. Share the spotlight generously.',
      'Stubbornness in opinions may create conflicts. Consider alternative viewpoints.',
      'Dramatic reactions may be disproportionate. Maintain regal composure in challenges.',
    ],
    careerPositive: [
      'Leadership opportunities arise naturally. Step into roles of authority with confidence.',
      'Creative projects and performances excel. Your vision inspires and motivates teams.',
      'Recognition for past efforts materializes. Accept praise graciously while planning future achievements.',
    ],
    careerChallenging: [
      'Ego conflicts with colleagues require diplomacy. Lead through inspiration, not domination.',
      'Avoid overcommitting to maintain your image. Authenticity matters more than appearances.',
    ],
    lovePositive: [
      'Romance is dramatic and passionate. Grand gestures of love are appreciated and reciprocated.',
      'Your warmth and generosity strengthen partnerships. Show love through abundance and celebration.',
      'Singles attract through confidence and charisma. Your magnetic presence draws admirers.',
    ],
    loveChallenging: [
      'Excessive pride may create distance in relationships. Allow vulnerability with those you trust.',
      'Need for adoration should be balanced with giving. Mutual appreciation sustains love.',
    ],
    healthAdvice: [
      'Heart health is paramount. Cardiovascular exercise and joy support well-being.',
      'Your vitality is generally high. Channel energy into creative and physical pursuits.',
      'Avoid burnout from excessive activity. Rest with the same dignity you bring to action.',
    ],
    remedies: [
      "Recite Surya Beej Mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah' 7 times",
      "Wear gold, orange, or red clothing for Sun's blessings",
      'Offer water to the rising Sun every morning (Surya Arghya)',
      'Donate wheat or jaggery on Sunday',
      'Perform Surya Namaskar for vitality and confidence',
    ],
  },
  5: {
    themes: ['analysis', 'service', 'health', 'precision', 'improvement'],
    generalPositive: [
      'Mercury sharpens your analytical abilities. Details that others miss become clear to you.',
      'Service and helpful activities bring fulfillment. Your contributions make meaningful differences.',
      'Health-conscious activities are favored. Improvements to diet and routine yield results.',
      'Organizational tasks are accomplished efficiently. Bring order to chaos with satisfaction.',
      'Practical problem-solving succeeds. Your methodical approach finds effective solutions.',
    ],
    generalChallenging: [
      'Over-analysis may lead to paralysis. Trust your preparation and take action.',
      'Critical tendencies could affect relationships. Balance discernment with acceptance.',
      'Perfectionism may delay completion. Good enough is sometimes the best approach.',
      'Worry about details may cause unnecessary stress. Focus on what you can control.',
    ],
    careerPositive: [
      'Precision and attention to detail are rewarded. Your thoroughness prevents problems.',
      'Health and service-related work thrives. Your dedication improves outcomes for many.',
      'Analysis and research yield valuable insights. Your findings inform better decisions.',
    ],
    careerChallenging: [
      "Avoid being overly critical of colleagues' work. Constructive feedback is more effective than criticism.",
      "Don't let perfectionism delay important deliverables. Meet deadlines while maintaining quality.",
    ],
    lovePositive: [
      'Show love through practical help and service. Actions speak louder than words today.',
      "Small thoughtful gestures mean more than grand displays. Attention to your partner's needs strengthens bonds.",
      'Singles may find connection through shared activities or health interests.',
    ],
    loveChallenging: [
      "Criticism of partner's habits may cause friction. Accept imperfections with love.",
      'Over-analysis of relationship dynamics can create distance. Trust in the connection.',
    ],
    healthAdvice: [
      'Focus on digestive health and nutrition. Clean eating supports overall well-being.',
      'Your nervous system benefits from calming practices. Reduce worry through meditation.',
      'Physical health routines are especially effective now. Establish or maintain beneficial habits.',
    ],
    remedies: [
      "Recite Budha Beej Mantra: 'Om Braam Breem Braum Sah Budhaya Namah' 9 times",
      "Wear green or earth-toned clothing for Mercury's blessings",
      'Donate to health-related charities on Wednesday',
      'Keep your space clean and organized for mental clarity',
      'Help someone in need as service to Mercury',
    ],
  },
  6: {
    themes: ['balance', 'harmony', 'relationships', 'beauty', 'justice'],
    generalPositive: [
      'Venus brings harmony and beauty to your day. Relationships and aesthetics flourish.',
      'Balance and fairness guide your decisions. Your diplomatic approach resolves conflicts.',
      'Partnership opportunities present themselves. Collaboration yields better results than solo efforts.',
      'Artistic and aesthetic pursuits are favored. Surround yourself with beauty and elegance.',
      'Social connections are harmonious and rewarding. Your charm opens doors and hearts.',
    ],
    generalChallenging: [
      'Indecision may delay important choices. Trust your inner sense of balance.',
      'People-pleasing could compromise your needs. Maintain healthy boundaries.',
      'Avoidance of conflict may allow problems to grow. Address issues diplomatically but directly.',
      "Dependency on others' approval limits growth. Value your own judgment.",
    ],
    careerPositive: [
      'Negotiations and partnerships succeed through diplomacy. Your fairness builds trust.',
      'Legal matters and contracts are favored. Justice supports your rightful claims.',
      'Creative and beauty-related work thrives. Your aesthetic sense enhances all endeavors.',
    ],
    careerChallenging: [
      'Difficulty making decisions may frustrate colleagues. Practice decisive action when needed.',
      'Avoid sacrificing your position to avoid conflict. Stand firm on important matters.',
    ],
    lovePositive: [
      'Romance flourishes in atmosphere of beauty and harmony. Plan elegant experiences with your partner.',
      'Partnership is strengthened through mutual appreciation. Express admiration generously.',
      'Singles attract through grace and charm. Social events bring promising connections.',
    ],
    loveChallenging: [
      'Avoiding relationship issues creates larger problems. Address concerns with diplomatic honesty.',
      'Seeking perfect balance may create anxiety. Accept that relationships have natural fluctuations.',
    ],
    healthAdvice: [
      'Balance in all areas supports well-being. Avoid extremes in diet or exercise.',
      'Kidney and lower back health may need attention. Stay well-hydrated.',
      'Beauty treatments and self-care enhance health and confidence. Pamper yourself.',
    ],
    remedies: [
      "Recite Shukra Beej Mantra: 'Om Draam Dreem Draum Sah Shukraya Namah' 16 times",
      "Wear white, pink, or light blue clothing for Venus's blessings",
      'Create or appreciate art as offering to Venus',
      'Practice forgiveness to maintain inner balance',
      'Donate to causes promoting equality and justice',
    ],
  },
  7: {
    themes: ['transformation', 'intensity', 'depth', 'power', 'regeneration'],
    generalPositive: [
      'Mars and transformative energy empower deep change. Embrace evolution with courage.',
      'Your intensity and focus cut through obstacles. Determination achieves what others consider impossible.',
      'Hidden truths are revealed to your penetrating perception. Use insights wisely.',
      'Regenerative abilities are strong. Heal and transform what has been wounded.',
      'Powerful intuition guides important decisions. Trust your inner knowing.',
    ],
    generalChallenging: [
      'Intensity may overwhelm others. Moderate your expression in social situations.',
      'Jealousy or possessiveness could strain relationships. Trust in what is truly yours.',
      'Desire for control may create power struggles. Allow natural outcomes.',
      'Holding onto grudges blocks your own growth. Release resentments for your liberation.',
    ],
    careerPositive: [
      'Research and investigation yield breakthroughs. Your ability to uncover hidden information excels.',
      'Crisis management and troubleshooting succeed. Others rely on your composure under pressure.',
      "Financial matters involving others' resources are favored. Investments show potential.",
    ],
    careerChallenging: [
      'Power struggles with colleagues should be avoided. Choose battles wisely.',
      'Secretive behavior may create distrust. Share appropriately while maintaining boundaries.',
    ],
    lovePositive: [
      'Passionate and deep connections intensify. Emotional and physical intimacy reaches new depths.',
      'Transformative experiences strengthen bonds. Face challenges together and grow stronger.',
      'Singles attract through magnetic intensity. Meaningful connections over superficial ones.',
    ],
    loveChallenging: [
      'Jealousy and possessiveness require conscious management. Trust strengthens love more than control.',
      'Emotional intensity may overwhelm partners. Allow space while maintaining connection.',
    ],
    healthAdvice: [
      'Reproductive and eliminative systems may need attention. Support detoxification processes.',
      'Emotional release through physical activity is therapeutic. Intense exercise helps.',
      'Regenerative practices like deep rest support healing. Honor your need for renewal.',
    ],
    remedies: [
      "Recite Mangal Beej Mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 11 times",
      "Wear red, maroon, or black clothing for Mars's protection",
      'Practice releasing grudges and forgiving old hurts',
      'Donate blood if eligible as service to Mars',
      'Meditate on transformation and positive change',
    ],
  },
  8: {
    themes: ['wisdom', 'expansion', 'adventure', 'philosophy', 'optimism'],
    generalPositive: [
      'Jupiter expands your horizons with opportunities for growth. Aim your arrow high.',
      'Travel, education, and philosophical pursuits are blessed. Explore new territories.',
      'Optimism and faith attract positive outcomes. Your enthusiasm inspires others.',
      'Teaching and sharing wisdom benefit many. Your knowledge finds receptive audiences.',
      'Adventure and exploration bring joy and discovery. Embrace new experiences fully.',
    ],
    generalChallenging: [
      'Over-optimism may overlook practical concerns. Balance faith with realistic planning.',
      'Tactless honesty could hurt sensitive feelings. Speak truth with kindness.',
      'Restlessness may prevent deep commitment. Find focus within expansion.',
      'Excessive indulgence in pleasures has consequences. Enjoy wisely.',
    ],
    careerPositive: [
      'Educational and teaching roles excel. Your wisdom benefits students and colleagues.',
      'International connections and travel are favored. Expand your professional reach.',
      'Publishing and broadcasting opportunities arise. Share your message broadly.',
    ],
    careerChallenging: [
      'Overcommitment to multiple projects may scatter energy. Focus on highest priorities.',
      'Impatience with details could cause oversights. Attend to necessary specifics.',
    ],
    lovePositive: [
      'Adventure and exploration strengthen romantic bonds. Travel together or explore new experiences.',
      'Shared philosophy and beliefs deepen connection. Discuss meaningful topics with your partner.',
      'Singles attract through enthusiasm and wisdom. Your adventurous spirit draws compatible souls.',
    ],
    loveChallenging: [
      'Need for freedom may conflict with relationship commitments. Find balance between independence and intimacy.',
      'Blunt communication may unintentionally hurt partners. Temper honesty with sensitivity.',
    ],
    healthAdvice: [
      'Outdoor activities and adventures support well-being. Connect with nature and expand.',
      'Thigh and liver health may need attention. Moderate indulgences and stay active.',
      'Sports and physical challenges are therapeutic. Push your boundaries safely.',
    ],
    remedies: [
      "Recite Guru Beej Mantra: 'Om Graam Greem Graum Sah Gurave Namah' 19 times",
      "Wear yellow or orange clothing for Jupiter's blessings",
      'Donate to educational or religious institutions on Thursday',
      'Feed Brahmins or elderly learned persons',
      'Study sacred texts and expand your knowledge',
    ],
  },
  9: {
    themes: ['discipline', 'ambition', 'structure', 'achievement', 'mastery'],
    generalPositive: [
      'Saturn rewards your disciplined efforts. Steady progress toward goals brings satisfaction.',
      'Ambition and practical planning lead to achievements. Build on solid foundations.',
      'Authority and responsibility are handled with maturity. Leadership earns respect.',
      'Long-term investments of time and effort yield returns. Patience proves its worth.',
      'Your practical wisdom guides sound decisions. Trust your experience and judgment.',
    ],
    generalChallenging: [
      'Excessive work may neglect other life areas. Balance achievement with well-being.',
      'Pessimism could limit possibilities. Maintain realistic hope alongside caution.',
      'Rigidity in approach may miss creative solutions. Allow flexibility within structure.',
      'Coldness or detachment may affect relationships. Express care despite reserve.',
    ],
    careerPositive: [
      'Professional advancement through competence and dedication. Your reliability is recognized.',
      'Authority figures support your ambitions. Earn respect through consistent performance.',
      'Long-term career planning bears fruit. Strategic moves position you well.',
    ],
    careerChallenging: [
      'Overwork risks burnout. Maintain sustainable pace for lasting success.',
      'Political maneuvering by others requires vigilance. Protect your position wisely.',
    ],
    lovePositive: [
      'Commitment and reliability strengthen partnerships. Show love through consistent actions.',
      'Serious discussions about the future are productive. Plan together with your partner.',
      'Singles attract through stability and maturity. Depth of character appeals to compatible partners.',
    ],
    loveChallenging: [
      'Work priorities may overshadow relationship needs. Make time for love and connection.',
      'Emotional reserve may feel cold to partners. Express feelings even when difficult.',
    ],
    healthAdvice: [
      'Bones, joints, and knees need attention and care. Support structural health.',
      'Steady, moderate exercise maintains fitness. Avoid excessive strain.',
      'Stress management is essential. Build relaxation into your disciplined routine.',
    ],
    remedies: [
      "Recite Shani Beej Mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah' 23 times",
      "Wear black, dark blue, or brown clothing for Saturn's blessings",
      'Help elderly people and those in need on Saturday',
      'Donate sesame seeds, iron items, or mustard oil',
      "Practice patience and accept delays as Saturn's teachings",
    ],
  },
  10: {
    themes: ['innovation', 'humanitarianism', 'originality', 'community', 'vision'],
    generalPositive: [
      'Saturn and innovative energy support unconventional approaches. Your unique vision finds expression.',
      "Humanitarian and community activities bring fulfillment. Make a difference in others' lives.",
      'Technology and progressive ideas flourish. Be ahead of your time without apology.',
      'Friendship and group connections are strengthened. Your network supports your goals.',
      'Originality and independence are assets. March to your own drum with confidence.',
    ],
    generalChallenging: [
      'Detachment may seem cold to those seeking closeness. Balance independence with connection.',
      "Stubbornness about ideas may limit collaboration. Remain open to others' contributions.",
      'Unpredictability may frustrate those depending on you. Provide reliability when needed.',
      'Excessive idealism may overlook practical concerns. Ground visions in reality.',
    ],
    careerPositive: [
      'Technology and innovation projects excel. Your forward-thinking approach solves problems.',
      'Networking brings unexpected opportunities. Connections open doors to advancement.',
      'Humanitarian or social justice work is meaningful. Contribute to causes larger than yourself.',
    ],
    careerChallenging: [
      'Resistance to hierarchy may create friction. Navigate structures while maintaining integrity.',
      'Too many ideas without follow-through limits success. Focus and execute key projects.',
    ],
    lovePositive: [
      'Friendship is the foundation of romance. Connect intellectually before emotionally.',
      'Giving space while maintaining connection satisfies both needs. Respect independence in partnership.',
      'Singles attract through originality and humanitarian values. Find kindred spirits in group activities.',
    ],
    loveChallenging: [
      'Emotional detachment may frustrate partners seeking intimacy. Open your heart gradually.',
      'Need for freedom may conflict with commitment. Find partners who respect your independence.',
    ],
    healthAdvice: [
      'Circulation and ankles need attention and care. Stay active to support blood flow.',
      'Mental stimulation is as important as physical health. Feed your innovative mind.',
      'Try new wellness approaches and technologies. Your experimental nature serves health.',
    ],
    remedies: [
      "Recite Shani Beej Mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah' 23 times",
      "Wear electric blue, purple, or black clothing for Saturn's blessings",
      'Support humanitarian causes and community service',
      'Connect with like-minded individuals for collective benefit',
      'Meditate on service to humanity and universal brotherhood',
    ],
  },
  11: {
    themes: ['spirituality', 'compassion', 'intuition', 'creativity', 'transcendence'],
    generalPositive: [
      'Jupiter and Neptune enhance spiritual awareness. Connect with the infinite within you.',
      'Creativity and imagination flow abundantly. Artistic expression channels higher inspiration.',
      'Compassion and healing abilities are heightened. Your empathy benefits those around you.',
      'Dreams and intuitions carry important messages. Pay attention to subtle guidance.',
      'Spiritual practices bring profound experiences. Meditation and prayer connect you to source.',
    ],
    generalChallenging: [
      'Escapist tendencies may avoid necessary realities. Face challenges with faith.',
      'Over-sensitivity may drain your energy. Establish healthy boundaries with empathy.',
      'Illusions in relationships or situations require discernment. See clearly beyond glamour.',
      'Victim mentality limits your power. Reclaim agency while maintaining compassion.',
    ],
    careerPositive: [
      'Creative and artistic work thrives. Channel inspiration into tangible expression.',
      'Healing and helping professions are fulfilling. Your compassion makes meaningful difference.',
      'Intuition guides successful career decisions. Trust your inner knowing about opportunities.',
    ],
    careerChallenging: [
      'Avoidance of practical details may create problems. Attend to necessary responsibilities.',
      'Deception by others is possible. Verify important information and agreements.',
    ],
    lovePositive: [
      'Romantic and spiritual connections deepen. Love transcends ordinary boundaries.',
      'Compassionate understanding heals relationship wounds. Forgive and be forgiven.',
      'Singles attract through sensitivity and spiritual depth. Soul connections are possible.',
    ],
    loveChallenging: [
      'Illusions about partners may lead to disappointment. See people as they truly are.',
      'Sacrificing too much for love depletes you. Maintain healthy self-care in relationships.',
    ],
    healthAdvice: [
      'Feet and lymphatic system benefit from attention. Water therapies and foot care help.',
      'Spiritual practices support physical health. Meditation reduces stress-related issues.',
      'Avoid escapist substances or behaviors. Healthy transcendence through art, music, or spirituality.',
    ],
    remedies: [
      "Recite Guru Beej Mantra: 'Om Graam Greem Graum Sah Gurave Namah' 19 times",
      "Wear yellow, sea green, or lavender clothing for Jupiter's blessings",
      'Practice meditation and spiritual disciplines daily',
      'Help animals and the underprivileged as service',
      'Offer prayers at water bodies for spiritual cleansing',
    ],
  },
};

// ---------- Weekly & Monthly Themes ----------

export const weeklyThemes: Record<number, string[]> = {
  0: ['new initiatives', 'leadership challenges', 'physical energy', 'competition', 'breakthrough moments'],
  1: ['financial matters', 'material stability', 'relationship harmony', 'patience tested', 'comfort seeking'],
  2: ['communication opportunities', 'learning experiences', 'travel possibilities', 'networking success', 'mental agility'],
  3: ['home and family', 'emotional processing', 'nurturing activities', 'intuitive guidance', 'protective instincts'],
  4: ['creative expression', 'recognition opportunities', 'romantic developments', 'leadership roles', 'confidence building'],
  5: ['health improvements', 'work efficiency', 'service opportunities', 'analytical tasks', 'detailed planning'],
  6: ['partnership developments', 'balance seeking', 'artistic pursuits', 'legal matters', 'social activities'],
  7: ['transformative experiences', 'depth exploration', 'power dynamics', 'research success', 'hidden revelations'],
  8: ['expansion opportunities', 'travel and adventure', 'philosophical insights', 'educational pursuits', 'optimism growing'],
  9: ['career advancement', 'authority matters', 'long-term planning', 'discipline rewards', 'reputation building'],
  10: ['innovation projects', 'community involvement', 'friendship developments', 'humanitarian activities', 'unconventional approaches'],
  11: ['spiritual growth', 'creative inspiration', 'compassionate service', 'intuitive insights', 'healing processes'],
};

export const monthlyFocus: Record<number, string[]> = {
  0: ['career momentum', 'personal goals', 'physical fitness', 'independence', 'new beginnings'],
  1: ['financial security', 'material investments', 'relationship stability', 'self-worth', 'comfort creation'],
  2: ['communication skills', 'intellectual growth', 'social connections', 'adaptability', 'information gathering'],
  3: ['home improvements', 'family bonds', 'emotional security', 'ancestral matters', 'inner reflection'],
  4: ['creative projects', 'romance and pleasure', 'children matters', 'self-expression', 'joyful activities'],
  5: ['health routines', 'work organization', 'service activities', 'skill development', 'practical improvements'],
  6: ['partnership growth', 'legal proceedings', 'artistic development', 'social harmony', 'balanced living'],
  7: ['deep transformation', 'financial partnerships', 'psychological insights', 'power reclamation', 'regeneration'],
  8: ['higher learning', 'spiritual expansion', 'travel adventures', 'philosophical development', 'teaching opportunities'],
  9: ['professional achievement', 'public reputation', 'authority development', 'long-term success', 'discipline mastery'],
  10: ['community leadership', 'future planning', 'technological advancement', 'friendship cultivation', 'humanitarian goals'],
  11: ['spiritual deepening', 'artistic creation', 'retreat and reflection', 'karmic completion', 'compassionate service'],
};

// ---------- Functional Benefic Planets per Ascendant ----------
// Source: Functional B Planets.jpg (documents/)
export const functionalBenefics = functionalBeneficsMap;

// ---------- Most Malefic Planet per Ascendant ----------
// Source: MMP.jpg (documents/)
export const mostMaleficPlanet = mostMaleficMap;

// ---------- House Significations (North Indian Chart) ----------
// Source: house_rep_n.jpeg (documents/)

export const houseSignifications: Record<number, HouseSignification> = {
  1:  { name: '1st House (Lagna)', keywords: ['Looks', 'Complexion', 'Character', 'Manners'], description: 'Self, personality, physical body, health, and overall life path' },
  2:  { name: '2nd House (Dhana)', keywords: ['Speech', 'Savings'], description: 'Wealth, family, speech, food habits, and early education' },
  3:  { name: '3rd House (Sahaja)', keywords: ['Courage', 'Social Media', 'Creative Writing'], description: 'Siblings, courage, communication, short travels, and self-effort' },
  4:  { name: '4th House (Sukha)', keywords: ['Property', 'Vehicles', 'Education'], description: 'Mother, home, land, vehicles, happiness, and formal education' },
  5:  { name: '5th House (Putra)', keywords: ['Intelligence', 'Romance', 'Fame'], description: 'Children, creativity, intelligence, romance, past life merit' },
  6:  { name: '6th House (Ripu)', keywords: ['Diseases', 'Debts', 'Service Roles', 'Enemies'], description: 'Enemies, diseases, debts, obstacles, and daily work routines' },
  7:  { name: '7th House (Kalatra)', keywords: ['Business', 'Legal Contracts', 'Partnership', 'Marriage'], description: 'Spouse, marriage, business partnerships, and public dealings' },
  8:  { name: '8th House (Ayu)', keywords: ['Death', 'Occult Knowledge', 'Court Cases', 'Divorce'], description: 'Longevity, transformation, inheritance, secrets, and sudden events' },
  9:  { name: '9th House (Dharma)', keywords: ['Travels', 'Spirituality', 'Higher Education'], description: 'Fortune, father, religion, long travels, higher learning, and guru' },
  10: { name: '10th House (Karma)', keywords: ['Career', 'Bosses', 'Co-workers', 'Workplace', 'Prestige'], description: 'Career, profession, reputation, authority, and public status' },
  11: { name: '11th House (Labha)', keywords: ['Income', 'Social Circle', 'Networking Contacts'], description: 'Gains, income, friends, elder siblings, and fulfillment of desires' },
  12: { name: '12th House (Vyaya)', keywords: ['Losses', 'Prison', 'Research', 'Moksha'], description: 'Expenses, losses, foreign lands, spirituality, and liberation' },
};

// ---------- Helper Functions ----------

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function isBeneficForAscendant(planet: string, ascendantIndex: number): boolean {
  const benefics = functionalBenefics[ascendantIndex];
  return benefics ? benefics.includes(planet) : false;
}

export function getMostMalefic(ascendantIndex: number): string {
  return mostMaleficPlanet[ascendantIndex] || 'Unknown';
}

export function getHouseInfo(houseNumber: number): HouseSignification | null {
  return houseSignifications[houseNumber] || null;
}

export function generatePlanetAnalysis(vedicChart: VedicChart): PlanetAnalysis[] {
  if (!vedicChart || !vedicChart.ascendant || !vedicChart.planets) return [];

  const ascIdx = vedicChart.ascendant.index;
  const malefic = getMostMalefic(ascIdx);
  const analysis: PlanetAnalysis[] = [];

  Object.entries(vedicChart.planets).forEach(([planet, data]) => {
    const isBenefic = isBeneficForAscendant(planet, ascIdx);
    const isMostMalefic = planet === malefic;
    const houseInfo = getHouseInfo(data.house);

    analysis.push({
      planet,
      sign: data.sign,
      house: data.house,
      degree: data.degree,
      isBenefic,
      isMostMalefic,
      houseKeywords: houseInfo ? houseInfo.keywords : [],
      houseDescription: houseInfo ? houseInfo.description : '',
      interpretation: isMostMalefic
        ? `${planet} is your most challenging planet. In the ${data.house}${getOrdinal(data.house)} house (${houseInfo ? houseInfo.keywords.join(', ') : ''}), exercise caution in these areas. Remedies are recommended.`
        : isBenefic
          ? `${planet} is a functional benefic for your ascendant. Placed in the ${data.house}${getOrdinal(data.house)} house (${houseInfo ? houseInfo.keywords.join(', ') : ''}), it brings positive results in these life areas.`
          : `${planet} in the ${data.house}${getOrdinal(data.house)} house (${houseInfo ? houseInfo.keywords.join(', ') : ''}) gives mixed results. Monitor this area carefully.`,
    });
  });

  return analysis;
}

// ---------- Personalized Horoscope Generator ----------

function calculateBestDays(moonSignIndex: number, date: Date): string[] {
  const luckyDays = rashiDetails[moonSignIndex].luckyDays;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = date.getDay();

  const bestDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    const dayName = dayNames[(currentDay + i) % 7];
    if (luckyDays.includes(dayName)) {
      const futureDate = new Date(date);
      futureDate.setDate(date.getDate() + i);
      bestDays.push(futureDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    }
  }
  return bestDays;
}

function calculateChallengeDays(moonSignIndex: number, date: Date): string[] {
  const challengeOffset = [3, 6][moonSignIndex % 2];
  const challengeDate = new Date(date);
  challengeDate.setDate(date.getDate() + challengeOffset);
  return [challengeDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })];
}

function calculateKeyDates(moonSignIndex: number, date: Date): { date: string; significance: string }[] {
  const keyDates: { date: string; significance: string }[] = [];
  const luckyNumbers = rashiDetails[moonSignIndex].luckyNumbers;

  luckyNumbers.forEach((num) => {
    if (num <= 28) {
      const keyDate = new Date(date.getFullYear(), date.getMonth(), num);
      keyDates.push({
        date: keyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        significance: 'Auspicious for important activities',
      });
    }
  });

  return keyDates;
}

// ---------- Daily Timings (Shubh / Ashubh Muhurat) ----------

// Rahu Kaal period index per day of week (Sun=0..Sat=6)
// Based on traditional Vedic calculation: "Mother Saw Father Wearing The Turban on Sunday"
const RAHU_KAAL_PERIOD: Record<number, number> = { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 };
const YAMAGANDAM_PERIOD: Record<number, number> = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 7, 6: 6 };
const GULIKA_KAAL_PERIOD: Record<number, number> = { 0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 };

// Best activity hours by moon sign ruler's planetary hora
const SIGN_BEST_HOURS: Record<number, { hours: [number, number][]; activities: string[] }> = {
  0:  { hours: [[6, 7], [13, 14], [20, 21]], activities: ['Action & initiatives', 'Physical activities', 'Competitive tasks'] },
  1:  { hours: [[7, 8], [14, 15], [18, 19]], activities: ['Financial decisions', 'Property matters', 'Creative work'] },
  2:  { hours: [[8, 9], [11, 12], [17, 18]], activities: ['Communication', 'Learning & study', 'Business meetings'] },
  3:  { hours: [[6, 7], [10, 11], [19, 20]], activities: ['Family matters', 'Emotional healing', 'Home activities'] },
  4:  { hours: [[7, 8], [12, 13], [16, 17]], activities: ['Leadership tasks', 'Government work', 'Important meetings'] },
  5:  { hours: [[8, 9], [11, 12], [17, 18]], activities: ['Analysis & planning', 'Health checkups', 'Detailed work'] },
  6:  { hours: [[7, 8], [14, 15], [18, 19]], activities: ['Partnerships', 'Legal matters', 'Artistic pursuits'] },
  7:  { hours: [[6, 7], [13, 14], [20, 21]], activities: ['Research', 'Investments', 'Strategic planning'] },
  8:  { hours: [[9, 10], [12, 13], [16, 17]], activities: ['Education', 'Spiritual activities', 'Travel planning'] },
  9:  { hours: [[8, 9], [15, 16], [19, 20]], activities: ['Career decisions', 'Long-term planning', 'Discipline tasks'] },
  10: { hours: [[8, 9], [15, 16], [19, 20]], activities: ['Innovation', 'Technology work', 'Community projects'] },
  11: { hours: [[9, 10], [12, 13], [16, 17]], activities: ['Spiritual practice', 'Creative arts', 'Healing work'] },
};

function formatHour(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

function getPeriodTime(periodIndex: number, sunriseMin: number, periodLengthMin: number): { start: string; end: string } {
  const startMin = sunriseMin + (periodIndex - 1) * periodLengthMin;
  const endMin = startMin + periodLengthMin;
  return { start: formatHour(Math.round(startMin)), end: formatHour(Math.round(endMin)) };
}

export function calculateDailyTimings(dayOfWeek: number, moonSignIndex: number, overrideSunrise?: number, overrideSunset?: number): DailyTimings {
  const sunriseMin = overrideSunrise ?? (6 * 60 + 15);
  const sunsetMin = overrideSunset ?? (18 * 60 + 15);
  const periodLengthMin = (sunsetMin - sunriseMin) / 8; // ~90 minutes

  const rahuKaal = getPeriodTime(RAHU_KAAL_PERIOD[dayOfWeek], sunriseMin, periodLengthMin);
  const yamagandam = getPeriodTime(YAMAGANDAM_PERIOD[dayOfWeek], sunriseMin, periodLengthMin);
  const gulikaKaal = getPeriodTime(GULIKA_KAAL_PERIOD[dayOfWeek], sunriseMin, periodLengthMin);

  // Abhijit Muhurat: midday period (~11:45 AM to 12:33 PM)
  const middayMin = (sunriseMin + sunsetMin) / 2;
  const abhijitHalfLen = 24; // ~48 min total
  const abhijitMuhurat = {
    start: formatHour(Math.round(middayMin - abhijitHalfLen)),
    end: formatHour(Math.round(middayMin + abhijitHalfLen)),
  };

  // Build sign-specific best hours
  const signHours = SIGN_BEST_HOURS[moonSignIndex];
  const bestHours = signHours.hours.map(([startH, endH], i) => ({
    start: formatHour(startH * 60),
    end: formatHour(endH * 60),
    activity: signHours.activities[i],
  }));

  // Compile all periods sorted by time for visual display
  const allPeriods: TimePeriod[] = [
    { label: 'Abhijit Muhurat', ...abhijitMuhurat, type: 'best' as const, description: 'Most auspicious time - ideal for any important activity' },
    { label: 'Rahu Kaal', ...rahuKaal, type: 'bad' as const, description: 'Avoid starting new work, travel, or interviews' },
    { label: 'Yamagandam', ...yamagandam, type: 'bad' as const, description: 'Inauspicious - avoid important decisions' },
    { label: 'Gulika Kaal', ...gulikaKaal, type: 'bad' as const, description: 'Unfavorable - avoid signing documents or deals' },
    ...bestHours.map((bh) => ({
      label: `Best for: ${bh.activity}`,
      start: bh.start,
      end: bh.end,
      type: 'good' as const,
      description: `Favorable hora for ${bh.activity.toLowerCase()}`,
    })),
  ];

  return { rahuKaal, yamagandam, gulikaKaal, abhijitMuhurat, bestHours, allPeriods };
}

export function generateDailyContent(moonSignIndex: number, nakshatra: string, date: Date): DayDetailedReport {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const dayOfWeek = date.getDay();
  const dateNum = date.getDate();

  const seed = dayOfYear + moonSignIndex * 7 + dateNum;

  const rashiData = rashiDetails[moonSignIndex];
  const predictions = dailyPredictions[moonSignIndex];
  const nakshatraData = nakshatraDetails[nakshatra] || {} as NakshatraDetail;

  const isPositiveDay = (seed % 7) < 5;

  const general = isPositiveDay
    ? predictions.generalPositive[seed % predictions.generalPositive.length]
    : predictions.generalChallenging[seed % predictions.generalChallenging.length];

  const career = isPositiveDay
    ? predictions.careerPositive[seed % predictions.careerPositive.length]
    : predictions.careerChallenging[seed % predictions.careerChallenging.length];

  const love = isPositiveDay
    ? predictions.lovePositive[seed % predictions.lovePositive.length]
    : predictions.loveChallenging[seed % predictions.loveChallenging.length];

  const health = predictions.healthAdvice[seed % predictions.healthAdvice.length];

  const baseRating = isPositiveDay ? 65 : 45;
  const ratings = {
    overall: Math.min(95, baseRating + (seed % 25)),
    career: Math.min(95, baseRating + ((seed * 2) % 28)),
    love: Math.min(95, baseRating + ((seed * 3) % 30)),
    health: Math.min(95, baseRating + ((seed * 4) % 22)),
    finance: Math.min(95, baseRating + ((seed * 5) % 26)),
  };

  const remedies = predictions.remedies.slice(0, 3);
  remedies.push(nakshatraData.mantra || rashiData.mantra);

  const timings = calculateDailyTimings(dayOfWeek, moonSignIndex);

  return {
    general,
    career,
    love,
    health,
    ratings,
    lucky: {
      number: rashiData.luckyNumbers[dateNum % rashiData.luckyNumbers.length],
      color: rashiData.luckyColors[dayOfWeek % rashiData.luckyColors.length],
      day: rashiData.luckyDays[dayOfWeek % rashiData.luckyDays.length],
      direction: rashiData.direction,
    },
    remedies,
    mantra: rashiData.mantra,
    timings,
  };
}

export function generatePersonalizedHoroscope(vedicChart: VedicChart, date: Date = new Date()): HoroscopeData {
  const moonSignIndex = vedicChart.moonSign.index;
  const rashiData = rashiDetails[moonSignIndex];
  const nakshatraData = nakshatraDetails[vedicChart.nakshatra] || {} as NakshatraDetail;

  const daily = generateDailyContent(moonSignIndex, vedicChart.nakshatra, date);

  // Generate rich weekly & monthly predictions
  const weeklyPrediction = generateWeeklyPrediction(vedicChart, date);
  const monthlyPrediction = generateMonthlyPrediction(vedicChart, date);

  // Generate panchanga predictions from birth data
  const birthPanchang = calculatePanchang(new Date(vedicChart.birthDetails.date + 'T00:00:00'));
  const panchangaPrediction = generatePanchangaPredictions(
    vedicChart.birthDetails.date,
    vedicChart.nakshatra,
    birthPanchang.tithi,
    birthPanchang.karana,
    birthPanchang.yoga
  );

  // Generate bhava (house) predictions
  const bhavaPredictions = generateAllBhavaPredictions(vedicChart);

  return {
    date: date.toISOString().split('T')[0],
    generatedAt: new Date().toISOString(),
    moonSign: rashiData,
    nakshatra: nakshatraData,
    daily: {
      general: daily.general,
      career: daily.career,
      love: daily.love,
      health: daily.health,
      ratings: daily.ratings,
      lucky: daily.lucky,
      remedies: daily.remedies,
      mantra: daily.mantra,
      timings: daily.timings,
    },
    weekly: weeklyPrediction,
    monthly: monthlyPrediction,
    panchanga: panchangaPrediction,
    bhava: bhavaPredictions,
    compatibility: rashiData.compatibleSigns.map((idx) => rashiDetails[idx].name),
    element: rashiData.element,
    ruler: rashiData.ruler,
    gem: rashiData.gem,
    deity: rashiData.deity,
  };
}
