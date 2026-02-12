// Dasa-period specific remedies based on classical Vedic texts
// Maps to ClickAstro Chapter 10: "Time Periods: Negative Influence and Remedies"

export interface DasaRemedy {
  planet: string;
  sanskrit: string;
  overview: string;
  unfavorableEffects: string;
  dress: { colors: string[]; advice: string };
  deity: { primary: string; secondary: string[]; advice: string };
  lifestyle: string;
  morningPrayer: { description: string; mantras: string[] };
  generalMantras: string[];
  charity: string;
  fasting: { day: string; advice: string };
  gemstone: string;
}

export const dasaRemedies: Record<string, DasaRemedy> = {
  'Sun': {
    planet: 'Sun',
    sanskrit: 'Surya',
    overview: 'The Sun represents authority, father, government, health, and self-esteem. When Sun dasa is unfavorable, you may face issues with authority figures, father\'s health, government matters, and self-confidence.',
    unfavorableEffects: 'During unfavorable Sun dasa, you may face challenges with authority figures and government officials. Health issues related to heart, eyes, and bones may arise. Your self-confidence may waver and career progress may slow. Relationships with father or father-figures may be strained.',
    dress: {
      colors: ['Ruby red', 'Saffron', 'Orange', 'Golden'],
      advice: 'Red and saffron are dear to the Sun. Wear these colors, especially on Sundays, to appease the Sun. Avoid dark and dull colors during this period.',
    },
    deity: {
      primary: 'Lord Surya (Sun God)',
      secondary: ['Lord Rama', 'Lord Shiva', 'Lord Vishnu'],
      advice: 'Worship Lord Surya at sunrise by offering water (Arghya). Visit Sun temples on Sundays. Perform Surya Namaskar (Sun Salutations) daily. Lord Rama, an avatar of the Sun lineage, can also be worshipped.',
    },
    lifestyle: 'Rise before sunrise and offer water to the Sun. Practice Surya Namaskar daily. Maintain a disciplined routine. Show respect to your father and authority figures. Engage in government or administrative work with integrity. Avoid arrogance and develop humility.',
    morningPrayer: {
      description: 'Rise before sunrise daily during Sun dasa. Face east and offer water to the rising Sun while chanting.',
      mantras: [
        'Om Suryaaya Namah',
        'Japaa kusuma sankaasham kaashyapeyam mahadyutim',
        'Tamo-arim sarva paapagnam pranatosmi divaakaram',
      ],
    },
    generalMantras: [
      'Om Hraam Hreem Hraum Sah Suryaaya Namah',
      'Om Aadityaaya Vidmahe Divakaraaya Dheemahi Tanno Suryah Prachodayaat',
    ],
    charity: 'Donate wheat, jaggery, copper vessels, red cloth, and ruby-colored items on Sundays. Feed Brahmins and offer food to the poor. Contribute to eye hospitals and health causes.',
    fasting: {
      day: 'Sunday',
      advice: 'Observe partial fast on Sundays, consuming only one meal before sunset. Eat wheat-based foods and avoid salt during the fast.',
    },
    gemstone: 'Ruby (Manik) set in gold, worn on the ring finger on a Sunday during Surya Hora.',
  },
  'Moon': {
    planet: 'Moon',
    sanskrit: 'Chandra',
    overview: 'The Moon represents mind, emotions, mother, water, and nourishment. When Moon dasa is unfavorable, you may face mental disturbances, emotional instability, mother\'s health issues, and problems related to water and nourishment.',
    unfavorableEffects: 'During unfavorable Moon dasa, mental peace may be disturbed. You may experience anxiety, depression, or emotional instability. Mother\'s health may be a concern. Sleep disturbances and water-related issues may arise. Creative abilities may diminish temporarily.',
    dress: {
      colors: ['White', 'Silver', 'Light blue', 'Pearl white'],
      advice: 'White and silver colors are dear to the Moon. Wear white, especially on Mondays, to appease the Moon. Pearl jewelry is highly beneficial.',
    },
    deity: {
      primary: 'Lord Shiva',
      secondary: ['Goddess Parvati', 'Goddess Durga', 'Lord Krishna'],
      advice: 'Worship Lord Shiva who wears the crescent Moon. Perform Abhisheka with milk on Mondays. Visit Shiva temples. Worship the Divine Mother (Parvati/Durga) for emotional balance.',
    },
    lifestyle: 'Maintain a calm and peaceful environment. Practice meditation and yoga regularly. Spend time near water bodies. Show love and care to your mother. Drink sufficient water and maintain proper nutrition. Avoid harsh speech and emotional outbursts.',
    morningPrayer: {
      description: 'Rise early and meditate facing north during Moon dasa. Offer milk and white flowers to Lord Shiva.',
      mantras: [
        'Om Chandraaya Namah',
        'Dadhi shankha tusharaabham ksheerodaarnava sambhavam',
        'Namaami shashinam somam shambhor makuta bhooshanam',
      ],
    },
    generalMantras: [
      'Om Shraam Shreem Shraum Sah Chandraaya Namah',
      'Om Atrisputraaya Vidmahe Amritatatvaaya Dheemahi Tanno Chandrah Prachodayaat',
    ],
    charity: 'Donate rice, milk, white cloth, silver, and pearls on Mondays. Feed the poor and distribute food. Support women\'s welfare causes and maternal health.',
    fasting: {
      day: 'Monday',
      advice: 'Observe fast on Mondays, especially during Shravana month. Consume only milk and white-colored foods.',
    },
    gemstone: 'Pearl (Moti) set in silver, worn on the little finger on a Monday during Chandra Hora.',
  },
  'Mars': {
    planet: 'Mars',
    sanskrit: 'Mangala/Kuja',
    overview: 'Mars represents courage, energy, property, siblings, and blood. When Mars dasa is unfavorable, you may face accidents, injuries, property disputes, conflicts with siblings, and blood-related health issues.',
    unfavorableEffects: 'During unfavorable Mars dasa, you may face accidents, injuries, and surgical procedures. Property disputes and legal battles may arise. Relationship with siblings may be strained. Blood pressure issues, inflammation, and fever may trouble you. Aggression and impulsive behavior may increase.',
    dress: {
      colors: ['Red', 'Coral', 'Orange', 'Saffron'],
      advice: 'Red and coral colors are dear to Mars. Wear red on Tuesdays to appease Mars. Coral jewelry is highly recommended.',
    },
    deity: {
      primary: 'Lord Hanuman',
      secondary: ['Lord Kartikeya (Subramanya)', 'Lord Narasimha', 'Goddess Durga'],
      advice: 'Worship Lord Hanuman who embodies the positive qualities of Mars. Visit Hanuman temples on Tuesdays. Recite Hanuman Chalisa. Worship Lord Kartikeya for channeling martial energy constructively.',
    },
    lifestyle: 'Channel aggressive energy through physical exercise, sports, and constructive activities. Practice patience and anger management. Avoid unnecessary arguments and legal disputes. Maintain good relations with siblings. Take precautions against accidents.',
    morningPrayer: {
      description: 'Rise early on Tuesdays and visit Hanuman temple. Offer vermillion (sindoor) and red flowers.',
      mantras: [
        'Om Mangalaaya Namah',
        'Dharanee garbha sambhootam vidyut kaanti samaprabham',
        'Kumaaram shakti hastam tam mangalam pranamaamyaham',
      ],
    },
    generalMantras: [
      'Om Kraam Kreem Kraum Sah Bhaumaaya Namah',
      'Om Angaarakaaya Vidmahe Shakti Hastaaya Dheemahi Tanno Bhaumah Prachodayaat',
    ],
    charity: 'Donate red lentils (masoor dal), red cloth, coral, copper, and jaggery on Tuesdays. Support blood banks and accident relief organizations. Feed Brahmins with wheat preparations.',
    fasting: {
      day: 'Tuesday',
      advice: 'Observe fast on Tuesdays. Consume one meal of wheat-based foods. Avoid non-vegetarian food and alcohol during the fast.',
    },
    gemstone: 'Red Coral (Moonga) set in gold or copper, worn on the ring finger on a Tuesday during Mars Hora.',
  },
  'Mercury': {
    planet: 'Mercury',
    sanskrit: 'Budha',
    overview: 'Mercury represents intellect, communication, business, education, and skin. When Mercury dasa is unfavorable, you may face communication problems, business losses, educational setbacks, and skin ailments.',
    unfavorableEffects: 'During unfavorable Mercury dasa, your intellectual abilities may be temporarily affected. Communication failures and misunderstandings may arise. Business and trade may suffer losses. Educational pursuits may face obstacles. Skin diseases, nervous disorders, and speech problems may occur.',
    dress: {
      colors: ['Green', 'Emerald', 'Light green', 'Teal'],
      advice: 'Green colors are dear to Mercury. Wear green, especially on Wednesdays, to appease Mercury. Emerald jewelry is highly beneficial.',
    },
    deity: {
      primary: 'Lord Vishnu',
      secondary: ['Lord Krishna', 'Goddess Saraswati', 'Lord Ganesha'],
      advice: 'Worship Lord Vishnu and recite Vishnu Sahasranama. Worship Goddess Saraswati for intellectual enhancement. Visit Vishnu temples on Wednesdays. Lord Ganesha worship helps overcome communication barriers.',
    },
    lifestyle: 'Engage in intellectual pursuits, reading, and learning. Practice clear and honest communication. Be careful in business transactions and contracts. Maintain skin health through proper diet. Avoid gossip and false speech. Develop analytical and logical thinking.',
    morningPrayer: {
      description: 'Rise early on Wednesdays and offer green flowers to Lord Vishnu. Practice pranayama for mental clarity.',
      mantras: [
        'Om Budhaya Namah',
        'Priyangukalika shyaamam roopenaapratimam budham',
        'Soumyam soumya gunopetam tam budham pranamaamyaham',
      ],
    },
    generalMantras: [
      'Om Braam Breem Braum Sah Budhaaya Namah',
      'Om Gajadhwajaaya Vidmahe Graha Rajaaya Dheemahi Tanno Budhah Prachodayaat',
    ],
    charity: 'Donate green moong dal, green cloth, emerald, books, and educational materials on Wednesdays. Support schools and educational institutions. Feed Brahmins with green vegetables.',
    fasting: {
      day: 'Wednesday',
      advice: 'Observe fast on Wednesdays. Consume green vegetables and fruits. Avoid fried foods and heavy meals.',
    },
    gemstone: 'Emerald (Panna) set in gold, worn on the little finger on a Wednesday during Mercury Hora.',
  },
  'Jupiter': {
    planet: 'Jupiter',
    sanskrit: 'Guru/Brihaspati',
    overview: 'Jupiter represents wisdom, knowledge, children, fortune, and spirituality. When Jupiter dasa is unfavorable, you may face issues with children, loss of fortune, spiritual confusion, and liver-related health problems.',
    unfavorableEffects: 'During unfavorable Jupiter dasa, wisdom and judgment may be clouded. Financial losses and reduction in fortune may occur. Children may face difficulties. Spiritual confusion and loss of faith may trouble you. Liver, obesity, and diabetes-related health issues may arise.',
    dress: {
      colors: ['Yellow', 'Golden', 'Saffron', 'Turmeric'],
      advice: 'Yellow and golden colors are dear to Jupiter. Wear yellow, especially on Thursdays, to appease Jupiter. Yellow sapphire jewelry is highly beneficial.',
    },
    deity: {
      primary: 'Lord Vishnu/Dakshinamurthy',
      secondary: ['Lord Brihaspati', 'Goddess Lakshmi', 'Lord Dattatreya'],
      advice: 'Worship Lord Vishnu and perform Satya Narayana Puja. Visit temples on Thursdays wearing yellow. Worship Dakshinamurthy (Shiva as the cosmic teacher) for wisdom. Goddess Lakshmi worship brings fortune.',
    },
    lifestyle: 'Engage in spiritual practices, study of scriptures, and teaching. Show respect to teachers and elders. Practice generosity and charity. Maintain a sattvic (pure) diet. Avoid arrogance in knowledge. Support educational and religious institutions.',
    morningPrayer: {
      description: 'Rise early on Thursdays and visit a Vishnu temple. Offer yellow flowers and turmeric. Chant with devotion.',
      mantras: [
        'Om Gurave Namah',
        'Devaanam cha rishinaam cha gurum kaanchana sannibham',
        'Buddhi bhootam trilokesham tam namaami brihaspatim',
      ],
    },
    generalMantras: [
      'Om Graam Greem Graum Sah Gurave Namah',
      'Om Vrishabhadhwajaaya Vidmahe Graha Rajaaya Dheemahi Tanno Guruh Prachodayaat',
    ],
    charity: 'Donate yellow cloth, turmeric, chana dal (gram lentils), gold, yellow sapphire, and books on Thursdays. Support temples, schools, and religious institutions. Feed Brahmins with saffron rice.',
    fasting: {
      day: 'Thursday',
      advice: 'Observe fast on Thursdays. Consume yellow-colored foods like turmeric rice, gram dal, and bananas.',
    },
    gemstone: 'Yellow Sapphire (Pukhraj) set in gold, worn on the index finger on a Thursday during Jupiter Hora.',
  },
  'Venus': {
    planet: 'Venus',
    sanskrit: 'Shukra',
    overview: 'Venus represents love, marriage, luxury, arts, beauty, and reproductive system. When Venus dasa is unfavorable, you may face marital problems, loss of luxury, artistic blocks, and reproductive health issues.',
    unfavorableEffects: 'During unfavorable Venus dasa, marital harmony may be disturbed. Financial difficulties related to luxury and comfort may arise. Artistic and creative abilities may be blocked. Reproductive and kidney-related health issues may occur. Relationships may become superficial or troubled.',
    dress: {
      colors: ['White', 'Light blue', 'Cream', 'Silver'],
      advice: 'Light colors are dear to Venus. Wear white or light blue, especially on Fridays, to appease Venus. Diamond or white sapphire jewelry is beneficial. Avoid dark colors during this period.',
    },
    deity: {
      primary: 'Mahalakshmi',
      secondary: ['Goddess Annapoorneshwari', 'Goddess Parvati', 'Lord Krishna'],
      advice: 'Mahalakshmi is the patron goddess of Venus. Worship Goddess Annapoorneshwari and Lakshmi. Visit Lakshmi temples on Fridays. Present temple arts as offerings. Lord Krishna worship also pleases Venus.',
    },
    lifestyle: 'Maintain virtue and character in thought and action. Be kind and behave attractively to fellow beings. Keep home and surroundings clean. Wear clean clothes. Don\'t use hurtful words. Develop respect for the opposite sex. Check desire for sensual pleasures. Support marriages and family relationships. Listening to music and presenting temple arts will help gratify Venus.',
    morningPrayer: {
      description: 'Rise before sunrise during Venus dasa. Invoke the grace of Venus after purifying your body. Clear your mind of all other thoughts.',
      mantras: [
        'Om Shukraaya Namah',
        'Hima kunda mrinalaabham daityanaam paramam gurum',
        'Sarva shastra pravaktaaram bhaargavam pranamaamyaham',
      ],
    },
    generalMantras: [
      'Om Draam Dreem Draum Sah Shukraaya Namah',
      'Om Bhrigusutaaya Vidmahe Shvetavaahanaaya Dheemahi Tanno Shukrah Prachodayaat',
    ],
    charity: 'Donate white cloth, rice, silver, diamond/white sapphire, sugar, and ghee on Fridays. Support women\'s welfare, arts, and cultural organizations. Feed Brahmins with sweet preparations.',
    fasting: {
      day: 'Friday',
      advice: 'Observe fast on Fridays. Consume white foods like rice, milk, and sweets. Avoid sour and pungent foods.',
    },
    gemstone: 'Diamond (Heera) or White Sapphire set in silver or platinum, worn on the middle finger on a Friday during Venus Hora.',
  },
  'Saturn': {
    planet: 'Saturn',
    sanskrit: 'Shani',
    overview: 'Saturn represents discipline, hardship, longevity, service, and justice. When Saturn dasa is unfavorable, you may face delays, obstacles, chronic health issues, career setbacks, and karmic challenges.',
    unfavorableEffects: 'During unfavorable Saturn dasa, you will face unexpected obstacles and difficulties in every field. You may not be able to fight against unfavorable situations. Tension may affect your natural sleep. Your capacity to resist diseases will decrease considerably. You may suffer from chronic ailments. Social transactions will lack warmth. Financial losses and career setbacks may occur.',
    dress: {
      colors: ['Dark blue', 'Black', 'Grey', 'Indigo'],
      advice: 'Dark blue and black are the favorite colors of Saturn. Wearing these colors will help appease Saturn. Wear dark blue on Saturdays to reduce harmful effects.',
    },
    deity: {
      primary: 'Lord Shiva',
      secondary: ['Sri Ayyappa', 'Lord Hanuman', 'Lord Bhairava'],
      advice: 'Lord Shiva and Sri Ayyappa are worshipped to eliminate harmful effects of Saturn dasa. Visit the temple of Sri Ayyappa wearing black or blue dresses while fasting. Present light offerings and sesame sweet broth (Ellu Payasa) as libation. Worship Hanuman on Saturdays.',
    },
    lifestyle: 'Practice patience, discipline, and perseverance. Accept delays as part of karmic lessons. Serve the elderly, disabled, and underprivileged. Maintain hygienic food habits. Do not be mentally disturbed by setbacks. Practice meditation for mental peace. Avoid shortcuts and dishonest means.',
    morningPrayer: {
      description: 'Rise before sunrise daily during Saturn dasa. Invoke the grace of Saturn after purifying your body. Clear your mind of all other thoughts.',
      mantras: [
        'Om Shanaishcharaya Namah',
        'Neelanjana samaabhaasam raviputram yamaagrajam',
        'Chaayaa maartanda sambhootam tam namaami shanaishcharam',
      ],
    },
    generalMantras: [
      'Om Praam Preem Praum Sah Shanaishcharaaya Namah',
      'Om Suryaputraaya Vidmahe Mandagataye Dheemahi Tanno Shanih Prachodayaat',
    ],
    charity: 'Donate black sesame seeds, iron, mustard oil, dark blue cloth, and black urad dal on Saturdays. Serve the poor, elderly, and disabled. Support orphanages and old age homes. Feed crows and black dogs.',
    fasting: {
      day: 'Saturday',
      advice: 'Observe fast on Saturdays. Consume only one meal of black sesame, urad dal, or iron-rich foods. Avoid salt during the fast.',
    },
    gemstone: 'Blue Sapphire (Neelam) set in silver or iron, worn on the middle finger on a Saturday during Saturn Hora. (Use with caution — trial period recommended)',
  },
  'Rahu': {
    planet: 'Rahu',
    sanskrit: 'Rahu',
    overview: 'Rahu represents illusion, foreign connections, obsession, and unconventional paths. When Rahu dasa is unfavorable, you may face deception, confusion, foreign troubles, and psychological disturbances.',
    unfavorableEffects: 'During unfavorable Rahu dasa, you may face sudden and unexpected changes. Deception and fraud may occur from unexpected quarters. Mental confusion and psychological disturbances may arise. Foreign travels may bring complications. Addictive tendencies and obsessive behavior may intensify. Health issues related to nervous system and poison may occur.',
    dress: {
      colors: ['Dark blue', 'Black', 'Grey', 'Smoky colors'],
      advice: 'Dark and smoky colors appease Rahu. Wear dark blue or grey, especially on Saturdays. Hessonite (Gomed) jewelry is highly recommended.',
    },
    deity: {
      primary: 'Goddess Durga',
      secondary: ['Lord Bhairava', 'Goddess Kali', 'Lord Ganesha'],
      advice: 'Worship Goddess Durga for protection from Rahu\'s illusions. Perform Durga Saptashati path. Visit Durga or Kali temples on Saturdays and Tuesdays. Lord Ganesha worship removes obstacles caused by Rahu.',
    },
    lifestyle: 'Practice honesty and avoid all forms of deception. Be cautious with foreign connections and overseas ventures. Avoid addictive substances and obsessive behavior. Practice meditation to maintain mental clarity. Do not trust strangers easily. Maintain a grounded and practical approach.',
    morningPrayer: {
      description: 'Rise early and meditate facing southwest during Rahu dasa. Offer dark blue flowers and sesame oil lamps.',
      mantras: [
        'Om Rahave Namah',
        'Ardha kaayam mahaa veeryam chandraadityavimardanam',
        'Simhikaa garbha sambhootam tam rahum pranamaamyaham',
      ],
    },
    generalMantras: [
      'Om Bhraam Bhreem Bhraum Sah Raahave Namah',
      'Om Naagadhwajaaya Vidmahe Padmahastaya Dheemahi Tanno Raahuh Prachodayaat',
    ],
    charity: 'Donate sesame seeds, dark blue cloth, lead, hessonite, mustard, and coconut on Saturdays. Support shelters and rehabilitation centers. Feed the poor on Saturdays.',
    fasting: {
      day: 'Saturday',
      advice: 'Observe fast on Saturdays. Consume one meal of urad dal or sesame-based foods. Avoid alcohol and intoxicants strictly.',
    },
    gemstone: 'Hessonite Garnet (Gomed) set in silver, worn on the middle finger on a Saturday during Rahu Kaal.',
  },
  'Ketu': {
    planet: 'Ketu',
    sanskrit: 'Ketu',
    overview: 'Ketu represents spirituality, detachment, past karma, and liberation. When Ketu dasa is unfavorable, you may face spiritual confusion, sudden losses, unexplained health issues, and karmic challenges.',
    unfavorableEffects: 'During unfavorable Ketu dasa, you may face sudden and unexplainable losses. Spiritual confusion and loss of direction may occur. Health issues that resist diagnosis and treatment may arise. Relationships may dissolve suddenly. Ancestral and karmic issues may surface. Accidents and mysterious circumstances may trouble you.',
    dress: {
      colors: ['Brown', 'Grey', 'Earthy tones', 'Saffron'],
      advice: 'Earthy and muted colors appease Ketu. Wear brown and saffron, especially on Tuesdays and Saturdays. Cat\'s eye (Lehsunia) jewelry is recommended.',
    },
    deity: {
      primary: 'Lord Ganesha',
      secondary: ['Lord Dattatreya', 'Goddess Chamunda', 'Lord Chitragupta'],
      advice: 'Worship Lord Ganesha who embodies the spiritual wisdom of Ketu. Perform Ganesha Puja on Tuesdays. Visit Ganesha temples and offer modak (sweet dumplings). Worship Dattatreya for spiritual clarity.',
    },
    lifestyle: 'Embrace spiritual practices and self-reflection. Accept detachment as a path to liberation. Avoid clinging to material possessions. Perform ancestral rituals (Pitru Tarpana). Practice meditation and mindfulness. Avoid occult practices without proper guidance. Focus on inner growth.',
    morningPrayer: {
      description: 'Rise early and meditate facing south during Ketu dasa. Light a ghee lamp and offer brown or grey flowers to Lord Ganesha.',
      mantras: [
        'Om Ketve Namah',
        'Palaasha pushpa sankaasham taarakaagraha mastakam',
        'Raudram raudraatmakam ghoram tam ketum pranamaamyaham',
      ],
    },
    generalMantras: [
      'Om Sraam Sreem Sraum Sah Ketave Namah',
      'Om Ashwadhwajaaya Vidmahe Shoola Hastaaya Dheemahi Tannah Ketuh Prachodayaat',
    ],
    charity: 'Donate saffron cloth, seven grains mixture, sesame seeds, cat\'s eye stone, and brown blankets on Tuesdays. Support spiritual institutions and ashrams. Perform Pitru Tarpana. Feed dogs and stray animals.',
    fasting: {
      day: 'Tuesday',
      advice: 'Observe fast on Tuesdays. Consume one meal of multi-grain foods. Avoid non-vegetarian food. Practice silence during the fast.',
    },
    gemstone: 'Cat\'s Eye (Lehsunia/Vaidurya) set in silver, worn on the middle finger on a Tuesday during Ketu Hora.',
  },
};

/**
 * Get dasa remedies for a given planet
 */
export function getDasaRemedies(planet: string): DasaRemedy | null {
  return dasaRemedies[planet] || null;
}

/**
 * Get all dasa remedies for dasa periods that are relevant (unfavorable)
 */
export function getRelevantDasaRemedies(
  dashas: { planet: string; rating: string }[]
): { planet: string; remedy: DasaRemedy }[] {
  return dashas
    .filter(d => d.rating === 'challenging' || d.rating === 'mixed')
    .map(d => ({ planet: d.planet, remedy: dasaRemedies[d.planet] }))
    .filter(d => d.remedy != null) as { planet: string; remedy: DasaRemedy }[];
}
