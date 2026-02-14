import { VedicChart, BhavaPrediction } from '@/types';

// ---------------------------------------------------------------------------
// Sign Rulers (0-indexed sign → ruling planet)
// ---------------------------------------------------------------------------
const signRulers: Record<number, string> = {
  0: 'Mars',     // Aries
  1: 'Venus',    // Taurus
  2: 'Mercury',  // Gemini
  3: 'Moon',     // Cancer
  4: 'Sun',      // Leo
  5: 'Mercury',  // Virgo
  6: 'Venus',    // Libra
  7: 'Mars',     // Scorpio
  8: 'Jupiter',  // Sagittarius
  9: 'Saturn',   // Capricorn
  10: 'Saturn',  // Aquarius
  11: 'Jupiter', // Pisces
};

// ---------------------------------------------------------------------------
// House Names
// ---------------------------------------------------------------------------
const houseNames: Record<number, string> = {
  1: '1st House (Lagna/Tanu)',
  2: '2nd House (Dhana)',
  3: '3rd House (Sahaja)',
  4: '4th House (Sukha)',
  5: '5th House (Putra)',
  6: '6th House (Ripu)',
  7: '7th House (Kalatra)',
  8: '8th House (Ayu)',
  9: '9th House (Dharma)',
  10: '10th House (Karma)',
  11: '11th House (Labha)',
  12: '12th House (Vyaya)',
};

// ---------------------------------------------------------------------------
// Lord-in-House Templates (144 entries: lord of house X placed in house Y)
// Keys: "X-in-Y" where X = source house (1-12), Y = placement house (1-12)
// ---------------------------------------------------------------------------
const lordInHouseTemplates: Record<string, string> = {
  // ── Lord of 1st House ──
  '1-in-1': 'Since the ascendant lord is in the 1st house itself, your personality is strong, self-assured, and commanding. You possess natural leadership abilities and a robust constitution that supports a healthy, active life.',
  '1-in-2': 'The ascendant lord placed in the 2nd house connects your identity closely with wealth and family matters. You are articulate, value financial security, and derive much of your confidence from accumulated resources and close family bonds.',
  '1-in-3': 'With the ascendant lord in the 3rd house, you are courageous, communicative, and inclined toward short journeys and artistic pursuits. Your self-expression flourishes through writing, media, or interactions with siblings.',
  '1-in-4': 'The ascendant lord in the 4th house gives you deep attachment to home, mother, and native land. You find emotional security through property, vehicles, and a comfortable domestic environment.',
  '1-in-5': 'Since the ascendant lord is placed in the 5th house, you possess creative intelligence and are drawn to speculative ventures. Your personality shines through artistic expression and matters related to children.',
  '1-in-6': 'The ascendant lord in the 6th house indicates a life shaped by overcoming obstacles, competitors, and health challenges. You develop resilience through service, and success comes after conquering opposition.',
  '1-in-7': 'With the ascendant lord in the 7th house, partnerships and marriage play a defining role in your life. You are diplomatic, seek balance in relationships, and may gain prominence through your spouse or business associates.',
  '1-in-8': 'The ascendant lord in the 8th house brings a life of transformation, occult interests, and hidden knowledge. You may face periodic upheavals but possess remarkable ability to reinvent yourself.',
  '1-in-9': 'Since the ascendant lord occupies the 9th house, fortune favors you through higher learning, spirituality, and long-distance travel. You are naturally righteous and benefit greatly from your father or mentors.',
  '1-in-10': 'The ascendant lord in the 10th house is an excellent placement for career success and public recognition. Your identity is closely tied to your profession, and you achieve high status through determined effort.',
  '1-in-11': 'With the ascendant lord in the 11th house, your ambitions and desires find fulfillment through social networks and influential friendships. Income flows from multiple sources and gains come with relative ease.',
  '1-in-12': 'The ascendant lord in the 12th house inclines you toward spiritual pursuits, foreign lands, and solitary contemplation. You may spend freely and find meaning in charitable work or meditative practices.',

  // ── Lord of 2nd House ──
  '2-in-1': 'The lord of wealth placed in the ascendant makes you naturally prosperous and eloquent. Your personality attracts financial opportunities, and you are known for your pleasing speech and refined tastes.',
  '2-in-2': 'With the 2nd lord in its own house, your family wealth is well-preserved and speech is influential. You accumulate resources steadily and maintain strong family traditions and values.',
  '2-in-3': 'The 2nd lord in the 3rd house channels your wealth through communication, writing, or media-related ventures. Siblings may play a role in your financial life, and short travels bring monetary gains.',
  '2-in-4': 'Since the 2nd lord sits in the 4th house, wealth comes through property, vehicles, and real estate. Your mother or homeland contributes significantly to your financial well-being and emotional security.',
  '2-in-5': 'The 2nd lord in the 5th house connects wealth with creative intelligence and speculation. You may earn through education, entertainment, investments, or through the achievements of your children.',
  '2-in-6': 'With the 2nd lord in the 6th house, finances may face periodic setbacks due to debts, health expenses, or litigation. However, you can build wealth through service-oriented professions or competitive fields.',
  '2-in-7': 'The 2nd lord in the 7th house brings wealth through marriage, partnerships, and business collaborations. Your spouse contributes positively to family finances, and trade activities prove profitable.',
  '2-in-8': 'Since the 2nd lord occupies the 8th house, sudden financial transformations, inheritance, or insurance-related gains are possible. Be cautious with family finances as unexpected expenses may arise.',
  '2-in-9': 'The 2nd lord in the 9th house is highly auspicious, linking wealth to dharma and fortune. You earn through teaching, publishing, spiritual pursuits, or connections with foreign lands and higher education.',
  '2-in-10': 'With the 2nd lord in the 10th house, your career is the primary source of wealth and status. You earn well through professional achievements and are known for your authoritative, persuasive speech.',
  '2-in-11': 'The 2nd lord in the 11th house is excellent for financial accumulation and fulfillment of desires. Multiple income streams flow toward you, and your social connections enhance your prosperity.',
  '2-in-12': 'Since the 2nd lord is in the 12th house, expenditure may exceed income at times, or wealth flows toward foreign lands, charity, or spiritual pursuits. Managing finances carefully is essential for stability.',

  // ── Lord of 3rd House ──
  '3-in-1': 'The 3rd lord in the ascendant makes you bold, adventurous, and self-driven in communication. You take initiative in creative endeavors and your courage defines your personality.',
  '3-in-2': 'With the 3rd lord in the 2nd house, your communication skills and courage contribute directly to wealth accumulation. You may earn through writing, media, sales, or vocal talents.',
  '3-in-3': 'The 3rd lord in its own house strengthens your valor, artistic abilities, and relationships with siblings. You are daring, skilled with your hands, and excel in fields requiring initiative and communication.',
  '3-in-4': 'Since the 3rd lord sits in the 4th house, your efforts and courage are directed toward securing home comforts and emotional well-being. You may work from home or in property-related fields.',
  '3-in-5': 'The 3rd lord in the 5th house channels your creative energy and communication skills into artistic pursuits, education, or romance. Your writings or performances may bring recognition.',
  '3-in-6': 'With the 3rd lord in the 6th house, your courage helps you overcome enemies and obstacles. You are competitive by nature and can succeed in fields related to defense, medicine, or dispute resolution.',
  '3-in-7': 'The 3rd lord in the 7th house brings partnerships based on shared creative or communicative interests. Your spouse may be artistic or involved in media, and short journeys relate to business.',
  '3-in-8': 'Since the 3rd lord occupies the 8th house, your courage is tested through crises and hidden challenges. You have interest in occult research or investigative fields, and siblings may face difficulties.',
  '3-in-9': 'The 3rd lord in the 9th house combines initiative with higher purpose, bringing gains through publishing, long-distance communication, or philosophical writing. Your efforts bear fruit through dharmic pursuits.',
  '3-in-10': 'With the 3rd lord in the 10th house, your career involves communication, media, writing, or short-distance travel. You rise professionally through courage, initiative, and skillful self-expression.',
  '3-in-11': 'The 3rd lord in the 11th house fulfills your desires through collaborative efforts and networking. Siblings and friends support your ambitions, and gains come through communicative ventures.',
  '3-in-12': 'Since the 3rd lord is in the 12th house, your creative efforts may find expression in foreign lands or spiritual contexts. Courage may wane at times, and relationships with siblings require conscious nurturing.',

  // ── Lord of 4th House ──
  '4-in-1': 'The 4th lord in the ascendant blesses you with inner contentment, a pleasant disposition, and benefits from property and vehicles. Your personality radiates domestic warmth and emotional stability.',
  '4-in-2': 'With the 4th lord in the 2nd house, family wealth is connected to property, land, and real estate. You value domestic harmony and accumulate assets that provide long-term security.',
  '4-in-3': 'The 4th lord in the 3rd house brings comfort through communication, travel, and creative hobbies. You may frequently change residences or find emotional peace through artistic expression.',
  '4-in-4': 'Since the 4th lord is in its own house, domestic happiness, property, and maternal blessings are strong. You enjoy a comfortable home, possess vehicles, and have a deep connection with your motherland.',
  '4-in-5': 'The 4th lord in the 5th house links domestic happiness with children, education, and creative pursuits. Your home is a center of learning and joy, and your heart finds peace through intellectual growth.',
  '4-in-6': 'With the 4th lord in the 6th house, domestic life may face disturbances from disputes, health issues, or debts. You work hard to maintain household stability and may live away from your birthplace.',
  '4-in-7': 'The 4th lord in the 7th house connects domestic happiness with marriage and partnerships. Your spouse contributes to home comforts, and you may acquire property through business or marital connections.',
  '4-in-8': 'Since the 4th lord occupies the 8th house, there may be upheavals in domestic life or property matters. However, you can gain through inheritance, insurance, or transformation of real estate holdings.',
  '4-in-9': 'The 4th lord in the 9th house is very auspicious, bringing blessings of both comfort and fortune. You may own property in distant places and your home life is enriched by spiritual and philosophical pursuits.',
  '4-in-10': 'With the 4th lord in the 10th house, your career brings domestic comforts and property. You may work from home or in fields related to real estate, agriculture, or homeland development.',
  '4-in-11': 'The 4th lord in the 11th house brings gains through property, vehicles, and real estate investments. Your home life supports your social ambitions, and friendships enhance domestic happiness.',
  '4-in-12': 'Since the 4th lord is in the 12th house, you may reside in foreign lands or invest in property abroad. Domestic peace requires effort, and spiritual practices at home bring inner tranquility.',

  // ── Lord of 5th House ──
  '5-in-1': 'The 5th lord in the ascendant makes you intelligent, creative, and naturally inclined toward learning. Your personality is infused with artistic talent and you are blessed with good progeny.',
  '5-in-2': 'With the 5th lord in the 2nd house, wealth comes through education, creativity, or investments. Your speech is refined and learned, and children contribute positively to family prosperity.',
  '5-in-3': 'The 5th lord in the 3rd house channels creative intelligence into writing, performance, or media. Your siblings may be artistically inclined, and short journeys inspire your creative output.',
  '5-in-4': 'Since the 5th lord sits in the 4th house, academic achievements bring domestic happiness and property. Your home is filled with intellectual pursuits, and your mother supports your creative ambitions.',
  '5-in-5': 'The 5th lord in its own house is excellent for intelligence, progeny, and spiritual merit. You have strong creative abilities, good fortune in speculation, and a deep connection with your children.',
  '5-in-6': 'With the 5th lord in the 6th house, creative pursuits face competition or obstacles, and children may require extra care. However, your intelligence helps you triumph over enemies and health challenges.',
  '5-in-7': 'The 5th lord in the 7th house brings a romantic and creative dimension to partnerships. Your spouse is likely intelligent and cultured, and love marriages are indicated.',
  '5-in-8': 'Since the 5th lord occupies the 8th house, creative pursuits may involve research, occult subjects, or transformation. Be attentive to children\'s well-being and exercise caution in speculative investments.',
  '5-in-9': 'The 5th lord in the 9th house creates a powerful trikona connection, bringing tremendous fortune through education, dharma, and spiritual wisdom. Children bring honor, and your past-life merit is strong.',
  '5-in-10': 'With the 5th lord in the 10th house, your career benefits from creative intelligence and education. You may work in entertainment, education, or advisory roles, achieving public recognition.',
  '5-in-11': 'The 5th lord in the 11th house brings gains through investments, speculation, and creative ventures. Your children prosper, desires are fulfilled, and influential friends support your ambitions.',
  '5-in-12': 'Since the 5th lord is in the 12th house, creative expression may find outlets in foreign lands or spiritual contexts. Be mindful of speculative losses, and children may live abroad.',

  // ── Lord of 6th House ──
  '6-in-1': 'The 6th lord in the ascendant may bring health challenges or a competitive nature that defines your personality. You are a fighter by temperament and excel in overcoming adversity.',
  '6-in-2': 'With the 6th lord in the 2nd house, debts or health issues may strain family finances. Guard your speech against disputes, and be cautious with dietary habits to maintain well-being.',
  '6-in-3': 'The 6th lord in the 3rd house gives you courage to face enemies and competitors head-on. Your communication may have a sharp edge, and siblings may face health or legal challenges.',
  '6-in-4': 'Since the 6th lord sits in the 4th house, domestic peace may be disturbed by disputes, maternal health concerns, or property-related conflicts. Effort is needed to maintain household harmony.',
  '6-in-5': 'The 6th lord in the 5th house may create obstacles in education, challenges with children, or losses through speculation. Your intelligence is applied to solving complex problems and disputes.',
  '6-in-6': 'With the 6th lord in its own house, your ability to overcome enemies, debts, and diseases is remarkably strong. You triumph in competitive situations and thrive in service-oriented professions.',
  '6-in-7': 'The 6th lord in the 7th house may bring challenges in marriage or business partnerships through disagreements or litigation. Patience and diplomacy are essential for relationship harmony.',
  '6-in-8': 'Since the 6th lord occupies the 8th house, this creates viparita raja yoga, where enemies destroy themselves and debts resolve unexpectedly. Hidden blessings emerge from apparent difficulties.',
  '6-in-9': 'The 6th lord in the 9th house may create tension between duty and dharma, or health issues during long journeys. Your father may face challenges, and spiritual growth comes through overcoming obstacles.',
  '6-in-10': 'With the 6th lord in the 10th house, your career involves service, healthcare, legal matters, or competitive fields. Professional success comes through hard work and defeating opposition.',
  '6-in-11': 'The 6th lord in the 11th house brings gains through overcoming enemies and competition. Your adversaries ultimately contribute to your prosperity, and debts are repaid through social connections.',
  '6-in-12': 'Since the 6th lord is in the 12th house, this creates another viparita raja yoga bringing unexpected relief from enemies, debts, and diseases. Hospitalizations may lead to healing and spiritual growth.',

  // ── Lord of 7th House ──
  '7-in-1': 'The 7th lord in the ascendant makes partnerships and marriage central to your identity. Your spouse strongly influences your personality, and you are naturally diplomatic and relationship-oriented.',
  '7-in-2': 'With the 7th lord in the 2nd house, your spouse contributes to family wealth and financial stability. Marriage enhances your resources, and partnerships are commercially profitable.',
  '7-in-3': 'The 7th lord in the 3rd house brings a communicative and adventurous partner. Your marriage involves frequent short travels, and business partnerships thrive through media or writing.',
  '7-in-4': 'Since the 7th lord sits in the 4th house, marriage brings domestic happiness, property, and emotional security. Your spouse creates a comfortable home environment and supports family harmony.',
  '7-in-5': 'The 7th lord in the 5th house indicates a romantic, creative, and intelligent spouse. Love marriages are likely, and partnerships bring joy through children and artistic collaboration.',
  '7-in-6': 'With the 7th lord in the 6th house, marital life may face challenges from health issues, debts, or disagreements. Your partner may work in service or healthcare fields, requiring patience in the relationship.',
  '7-in-7': 'The 7th lord in its own house blesses you with a strong, loyal, and supportive spouse. Marriage is a source of great happiness, and business partnerships flourish with mutual trust.',
  '7-in-8': 'Since the 7th lord occupies the 8th house, marriage undergoes transformative phases and your spouse may bring inheritance or hidden resources. Intimacy is deep but the relationship faces periodic upheavals.',
  '7-in-9': 'The 7th lord in the 9th house brings a righteous, spiritually inclined, or foreign-born spouse. Marriage enhances your fortune, and partnerships thrive through dharmic activities and higher learning.',
  '7-in-10': 'With the 7th lord in the 10th house, your spouse supports your career or you meet your partner through professional circles. Marriage elevates your public status and professional standing.',
  '7-in-11': 'The 7th lord in the 11th house brings gains and fulfillment through marriage and partnerships. Your spouse contributes to income growth, and social networks expand through your partner.',
  '7-in-12': 'Since the 7th lord is in the 12th house, your spouse may be from a foreign land or the marriage may involve significant expenditure. Bed pleasures are indicated, but emotional distance requires attention.',

  // ── Lord of 8th House ──
  '8-in-1': 'The 8th lord in the ascendant may bring health vulnerabilities and a mysterious, introspective personality. You are drawn to hidden knowledge and undergo significant personal transformations throughout life.',
  '8-in-2': 'With the 8th lord in the 2nd house, family finances may face sudden disruptions or you receive unexpected inheritance. Be cautious with speech and dietary habits to protect your well-being.',
  '8-in-3': 'The 8th lord in the 3rd house tests your courage through sudden events and hidden dangers during travels. You possess investigative skills and may write about occult or mysterious subjects.',
  '8-in-4': 'Since the 8th lord sits in the 4th house, domestic peace may face hidden disturbances and property matters involve complications. Your mother\'s health requires attention, but you may gain through inheritance.',
  '8-in-5': 'The 8th lord in the 5th house may create challenges in education, speculative losses, or concerns about children. However, you possess deep research abilities and interest in occult sciences.',
  '8-in-6': 'With the 8th lord in the 6th house, you possess resilience to overcome chronic health issues and hidden enemies. This placement can grant longevity and victory over seemingly insurmountable obstacles.',
  '8-in-7': 'The 8th lord in the 7th house brings transformative experiences through marriage and partnerships. Your spouse may have a secretive nature, and business dealings involve hidden dimensions.',
  '8-in-8': 'Since the 8th lord is in its own house, longevity is strong and you possess deep insight into life\'s mysteries. You may receive inheritance, excel in research, and navigate crises with remarkable composure.',
  '8-in-9': 'The 8th lord in the 9th house may bring sudden changes in fortune or challenges to your father. Your spiritual path involves deep transformation, and you seek esoteric rather than conventional wisdom.',
  '8-in-10': 'With the 8th lord in the 10th house, your career may involve research, insurance, investigation, or dealing with other people\'s resources. Professional life undergoes dramatic shifts and reinventions.',
  '8-in-11': 'The 8th lord in the 11th house may bring sudden gains or losses through social networks. Elder siblings face challenges, but you can profit from research, insurance, or transformation-related fields.',
  '8-in-12': 'Since the 8th lord occupies the 12th house, this creates viparita raja yoga where losses transform into spiritual gains. You may travel abroad for healing and find liberation through surrender.',

  // ── Lord of 9th House ──
  '9-in-1': 'The 9th lord in the ascendant is highly auspicious, making you fortunate, righteous, and blessed by destiny. You naturally attract luck, possess a philosophical mind, and inspire others through your conduct.',
  '9-in-2': 'With the 9th lord in the 2nd house, wealth flows through dharmic means, teaching, or inherited fortune. Your family upholds strong values, and your speech carries wisdom and moral authority.',
  '9-in-3': 'The 9th lord in the 3rd house channels fortune through communication, publishing, and short journeys. Your writings or media work carry philosophical depth, and siblings share your spiritual inclinations.',
  '9-in-4': 'Since the 9th lord sits in the 4th house, you are blessed with a fortunate home life, valuable property, and academic excellence. Your mother is virtuous, and your homeland brings you prosperity.',
  '9-in-5': 'The 9th lord in the 5th house creates a powerful trikona yoga bringing immense fortune through intelligence, children, and past-life merit. Education and spiritual practices yield extraordinary results.',
  '9-in-6': 'With the 9th lord in the 6th house, fortune comes through service, overcoming challenges, and competitive fields. Your dharmic path involves healing others, and obstacles test your faith.',
  '9-in-7': 'The 9th lord in the 7th house brings a fortunate and righteous spouse who enhances your destiny. Business partnerships are blessed, and foreign connections prove highly beneficial.',
  '9-in-8': 'Since the 9th lord occupies the 8th house, fortune may arrive through unexpected channels such as inheritance, research, or occult pursuits. Your father\'s life may involve transformations.',
  '9-in-9': 'The 9th lord in its own house maximizes fortune, dharma, and spiritual blessings. You are naturally lucky, devoted to righteous living, and benefit immensely from teachers, mentors, and long journeys.',
  '9-in-10': 'With the 9th lord in the 10th house, this powerful dharma-karma yoga brings professional success aligned with higher purpose. You rise to prominence through ethical conduct and merit.',
  '9-in-11': 'The 9th lord in the 11th house brings abundant gains through fortunate connections and dharmic endeavors. Your desires are fulfilled with ease, and elder siblings are prosperous.',
  '9-in-12': 'Since the 9th lord is in the 12th house, your fortune manifests in foreign lands or through spiritual liberation. You may settle abroad, engage in charitable work, or find wealth through renunciation.',

  // ── Lord of 10th House ──
  '10-in-1': 'The 10th lord in the ascendant makes you career-oriented and publicly visible. Your professional identity and personal identity merge, bringing early recognition and leadership opportunities.',
  '10-in-2': 'With the 10th lord in the 2nd house, your career generates significant family wealth and financial security. You may work in banking, finance, or food-related industries with great success.',
  '10-in-3': 'The 10th lord in the 3rd house brings a career in communication, media, writing, or publishing. Your professional life involves courage, initiative, and frequent short-distance travel.',
  '10-in-4': 'Since the 10th lord sits in the 4th house, your career is connected to property, homeland, education, or your mother\'s influence. You may work from home or achieve success in real estate.',
  '10-in-5': 'The 10th lord in the 5th house brings a career in creative fields, education, entertainment, or advisory roles. Your professional success stems from intelligence and artistic expression.',
  '10-in-6': 'With the 10th lord in the 6th house, your career involves service, healthcare, law, or competitive environments. You overcome professional rivals and find success through dedicated hard work.',
  '10-in-7': 'The 10th lord in the 7th house builds your career through partnerships, collaborations, and foreign trade. Your spouse supports your professional ambitions, and business ventures thrive.',
  '10-in-8': 'Since the 10th lord occupies the 8th house, your career involves research, transformation, insurance, or occult sciences. Professional life undergoes sudden changes but leads to deeper expertise.',
  '10-in-9': 'The 10th lord in the 9th house creates a powerful dharma-karma yoga bringing a career aligned with higher purpose. You succeed in teaching, law, religion, or international affairs.',
  '10-in-10': 'With the 10th lord in its own house, career success and professional recognition are maximized. You are ambitious, hardworking, and achieve the highest positions in your chosen field.',
  '10-in-11': 'The 10th lord in the 11th house brings excellent career-related income and fulfillment of professional ambitions. Your network and influential friends support your career growth tremendously.',
  '10-in-12': 'Since the 10th lord is in the 12th house, your career may take you to foreign lands or involve behind-the-scenes work. You succeed in hospitals, ashrams, spiritual organizations, or multinational companies.',

  // ── Lord of 11th House ──
  '11-in-1': 'The 11th lord in the ascendant attracts gains and opportunities directly to you. Your personality magnetizes wealth, social connections, and the fulfillment of desires with minimal effort.',
  '11-in-2': 'With the 11th lord in the 2nd house, income flows steadily into family savings and accumulated wealth. Your speech and knowledge are assets that generate continuous financial returns.',
  '11-in-3': 'The 11th lord in the 3rd house brings gains through writing, communication, media ventures, and sibling partnerships. Your courage and initiative translate directly into income.',
  '11-in-4': 'Since the 11th lord sits in the 4th house, gains come through property, vehicles, and real estate investments. Your home life is comfortable, and your mother supports your financial growth.',
  '11-in-5': 'The 11th lord in the 5th house brings profits through creative ventures, speculation, and investments. Your children bring gains, and your intelligence is a powerful tool for wealth creation.',
  '11-in-6': 'With the 11th lord in the 6th house, gains come through competitive fields, service industries, or overcoming obstacles. Income may be irregular, but your perseverance ensures steady accumulation.',
  '11-in-7': 'The 11th lord in the 7th house brings gains through marriage, business partnerships, and trade. Your spouse enhances your income, and foreign collaborations prove especially profitable.',
  '11-in-8': 'Since the 11th lord occupies the 8th house, gains may arrive suddenly through inheritance, insurance, or unexpected windfalls. Friendships may undergo transformative experiences.',
  '11-in-9': 'The 11th lord in the 9th house is very auspicious, bringing gains through dharmic pursuits, teaching, and long-distance ventures. Fortune and income align to create lasting prosperity.',
  '11-in-10': 'With the 11th lord in the 10th house, your career is the primary vehicle for fulfilling desires and generating income. Professional achievements bring substantial financial rewards and social status.',
  '11-in-11': 'The 11th lord in its own house maximizes income, gains, and the fulfillment of all desires. You are blessed with influential friends, a thriving social circle, and multiple streams of revenue.',
  '11-in-12': 'Since the 11th lord is in the 12th house, gains may come through foreign sources or be directed toward charitable and spiritual expenditures. Income is earned abroad or spent on higher causes.',

  // ── Lord of 12th House ──
  '12-in-1': 'The 12th lord in the ascendant may increase expenses and draw you toward foreign lands or spiritual retreats. Your personality carries an otherworldly quality, and you find fulfillment through selfless service.',
  '12-in-2': 'With the 12th lord in the 2nd house, family wealth may face drainage through excessive spending or foreign investments. Guard your finances carefully and be mindful of extravagant tendencies.',
  '12-in-3': 'The 12th lord in the 3rd house may diminish initiative or direct your creative efforts toward spiritual or foreign-themed work. Siblings may live abroad, and short journeys have a contemplative purpose.',
  '12-in-4': 'Since the 12th lord sits in the 4th house, domestic peace may be disturbed by hidden anxieties or property-related losses. You may feel a longing for a homeland different from where you reside.',
  '12-in-5': 'The 12th lord in the 5th house may cause distractions in education or losses through speculation. However, your spiritual intelligence is heightened, and meditation enhances creative expression.',
  '12-in-6': 'With the 12th lord in the 6th house, this creates a viparita raja yoga where expenditures are controlled and enemies are defeated. Losses transform into victories, and debts are manageable.',
  '12-in-7': 'The 12th lord in the 7th house connects foreign travel and expenditure with marriage. Your spouse may be from a different cultural background, and business involves international dealings.',
  '12-in-8': 'Since the 12th lord occupies the 8th house, another viparita raja yoga forms, bringing hidden gains from apparent losses. Spiritual liberation comes through deep transformation and surrender.',
  '12-in-9': 'The 12th lord in the 9th house links expenditure with pilgrimages, higher education, and charitable giving. You spend generously on spiritual growth and may live in a foreign land.',
  '12-in-10': 'With the 12th lord in the 10th house, your career may involve foreign countries, hospitals, spiritual institutions, or behind-the-scenes work. Professional expenses are high but purposeful.',
  '12-in-11': 'The 12th lord in the 11th house brings gains through foreign connections, spiritual organizations, or expenditures that ultimately create income. Elder friends from abroad support your growth.',
  '12-in-12': 'Since the 12th lord is in its own house, spiritual inclinations are very strong and expenditures serve a higher purpose. You may live abroad, engage in deep meditation, and find peace through detachment.',
};

// ---------------------------------------------------------------------------
// Planet-in-House Effects (108 entries: 9 planets × 12 houses)
// Keys: "Planet-House" (e.g. "Sun-1")
// Based on BPHS (Brihat Parashara Hora Shastra) and Phaladeepika principles.
// ---------------------------------------------------------------------------
const planetInHouseEffects: Record<string, string> = {
  // ── Sun ──
  'Sun-1': 'The Sun in the 1st house bestows a strong, authoritative personality with natural leadership qualities. You possess vitality, self-confidence, and a dignified demeanor that commands respect from others.',
  'Sun-2': 'The Sun in the 2nd house gives a commanding voice and the ability to earn through government, authority, or leadership roles. Family pride is strong, though there may be occasional friction with family members.',
  'Sun-3': 'The Sun in the 3rd house makes you courageous, determined, and successful in communication-related fields. You have a powerful will, and your siblings respect your authority and guidance.',
  'Sun-4': 'The Sun in the 4th house may create tension in domestic life but grants status through property and vehicles. Your relationship with your father may influence your sense of emotional security.',
  'Sun-5': 'The Sun in the 5th house blesses you with creative brilliance, leadership in education, and dignified progeny. You are drawn to politics, performing arts, or speculative ventures with a regal flair.',
  'Sun-6': 'The Sun in the 6th house grants victory over enemies, strong immunity, and success in competitive fields. You excel in government service, healthcare, or any profession requiring authority over adversaries.',
  'Sun-7': 'The Sun in the 7th house brings a dominating quality to partnerships and marriage. Your spouse may be ambitious and authoritative, and you gain prominence through public dealings and collaborations.',
  'Sun-8': 'The Sun in the 8th house deepens your interest in occult sciences, research, and hidden matters. Longevity may involve periodic health challenges, but you possess remarkable resilience and transformative power.',
  'Sun-9': 'The Sun in the 9th house makes you righteous, devoted to your father, and inclined toward philosophy and higher learning. You gain through government, law, religious institutions, and long-distance travel.',
  'Sun-10': 'The Sun in the 10th house is one of the strongest placements for career success, fame, and governmental authority. You achieve high professional status and are recognized as a leader in your field.',
  'Sun-11': 'The Sun in the 11th house brings substantial gains through influential contacts, government connections, and leadership roles in organizations. Your ambitions are fulfilled with the support of powerful friends.',
  'Sun-12': 'The Sun in the 12th house inclines you toward spiritual pursuits, foreign travels, and working behind the scenes. Your ego dissolves through service, and you find purpose in hospitals, ashrams, or foreign lands.',

  // ── Moon ──
  'Moon-1': 'The Moon in the 1st house gives you an attractive, emotionally responsive personality with a nurturing demeanor. You are sensitive to your environment, popular with others, and strongly influenced by your moods.',
  'Moon-2': 'The Moon in the 2nd house blesses you with a sweet, persuasive voice and fluctuating finances. You are emotionally attached to family wealth, enjoy good food, and your income may come through public-facing roles.',
  'Moon-3': 'The Moon in the 3rd house makes you imaginative, emotionally expressive, and fond of short journeys. Your communication has an emotional depth that touches others, and you share a close bond with siblings.',
  'Moon-4': 'The Moon in the 4th house is very strong in its natural signification, granting emotional contentment, a loving mother, and beautiful homes. You are deeply attached to your homeland and find peace at home.',
  'Moon-5': 'The Moon in the 5th house blesses you with emotional intelligence, creative imagination, and a loving relationship with children. You are romantic at heart and drawn to artistic and speculative pursuits.',
  'Moon-6': 'The Moon in the 6th house may bring emotional sensitivity to health issues and workplace challenges. You serve others with compassion and may work in healthcare, hospitality, or caregiving professions.',
  'Moon-7': 'The Moon in the 7th house brings an emotionally fulfilling marriage and a nurturing, attractive spouse. You are relationship-oriented, diplomatically skilled, and gain through public partnerships.',
  'Moon-8': 'The Moon in the 8th house creates emotional intensity, psychic abilities, and interest in the occult. You experience deep emotional transformations and may face anxieties that drive spiritual growth.',
  'Moon-9': 'The Moon in the 9th house makes you emotionally connected to dharma, spirituality, and higher learning. You love pilgrimages, your mother is devout, and fortune flows through nurturing and caring professions.',
  'Moon-10': 'The Moon in the 10th house brings fame and public popularity through emotionally resonant work. You succeed in careers involving the public, women, food, hospitality, or creative arts.',
  'Moon-11': 'The Moon in the 11th house fulfills desires easily and brings gains through public connections and women. Your social circle is nurturing, and emotional satisfaction comes through fulfilled ambitions.',
  'Moon-12': 'The Moon in the 12th house inclines you toward meditation, dreams, and spiritual retreat. You are compassionate, spend on charitable causes, and may find emotional peace in foreign lands or solitude.',

  // ── Mars ──
  'Mars-1': 'Mars in the 1st house gives you a strong, athletic physique with a bold and assertive personality. You are energetic, competitive, and possess tremendous drive, though temperamental outbursts require management.',
  'Mars-2': 'Mars in the 2nd house makes your speech direct and forceful, sometimes creating family disputes. You earn through courage, engineering, surgery, or military pursuits, and are aggressive in wealth accumulation.',
  'Mars-3': 'Mars in the 3rd house is excellent for courage, physical prowess, and success in competitive fields. You are a natural warrior, protective of siblings, and excel in sports, defense, or adventurous pursuits.',
  'Mars-4': 'Mars in the 4th house may cause disturbances in domestic life, disputes over property, or tension with your mother. However, you possess strong real estate instincts and energy for home improvement.',
  'Mars-5': 'Mars in the 5th house brings passionate creativity, competitive intelligence, and an assertive approach to romance. You may have athletic or spirited children, and speculative ventures require careful management.',
  'Mars-6': 'Mars in the 6th house is a powerful placement for defeating enemies, overcoming diseases, and excelling in competitive arenas. You are an unstoppable force in litigation, surgery, military, or athletic careers.',
  'Mars-7': 'Mars in the 7th house brings a passionate, assertive energy to marriage and partnerships. Your spouse may be fiery and independent, and business dealings are conducted with boldness and determination.',
  'Mars-8': 'Mars in the 8th house grants extraordinary resilience, interest in surgery or investigation, and potential inheritance of property. You face danger fearlessly and possess a powerful capacity for transformation.',
  'Mars-9': 'Mars in the 9th house channels your energy toward righteous causes, philosophical debates, and adventurous long journeys. You are a defender of dharma, though your views may be strong and uncompromising.',
  'Mars-10': 'Mars in the 10th house is excellent for career success through engineering, military, surgery, sports, or law enforcement. You are a dynamic professional who leads with courage and achieves through action.',
  'Mars-11': 'Mars in the 11th house brings gains through competitive fields, engineering, or property dealings. Your ambitions are backed by tremendous energy, and you attract bold, action-oriented friends.',
  'Mars-12': 'Mars in the 12th house may cause hidden expenses, suppressed anger, or hospitalization. However, this placement can channel energy into spiritual practices, foreign travel, or working in institutions.',

  // ── Mercury ──
  'Mercury-1': 'Mercury in the 1st house blesses you with a youthful appearance, sharp intellect, and excellent communication skills. You are witty, adaptable, and naturally curious about diverse subjects.',
  'Mercury-2': 'Mercury in the 2nd house gives you an eloquent, persuasive speaking style and the ability to earn through intellect. You are financially astute, skilled in commerce, and may have a talent for languages.',
  'Mercury-3': 'Mercury in the 3rd house is in its natural signification, granting exceptional writing, speaking, and analytical abilities. You excel in media, publishing, and maintain a lively, intellectual bond with siblings.',
  'Mercury-4': 'Mercury in the 4th house brings intellectual stimulation at home, educational achievements, and a well-stocked library. Your mother is intelligent, and you excel in academics, real estate analysis, or teaching.',
  'Mercury-5': 'Mercury in the 5th house sharpens your intellect, gives skill in mathematics and analysis, and blesses you with bright children. You succeed in education, writing, advisory roles, and speculative thinking.',
  'Mercury-6': 'Mercury in the 6th house gives you analytical ability to solve health and workplace problems systematically. You excel in accounting, medical diagnostics, legal analysis, or any detail-oriented profession.',
  'Mercury-7': 'Mercury in the 7th house brings a communicative, intellectual partner and success in business negotiations. You excel in trade, counseling, and forming partnerships based on shared intellectual interests.',
  'Mercury-8': 'Mercury in the 8th house grants research abilities, interest in mysteries, and skill in financial analysis. You are drawn to psychology, investigation, or occult studies, and communicate about hidden subjects.',
  'Mercury-9': 'Mercury in the 9th house makes you a scholar, teacher, and philosophical thinker. You excel in higher education, publishing, translation, and bridging different cultures through communication.',
  'Mercury-10': 'Mercury in the 10th house brings career success through communication, technology, writing, or commerce. You are known professionally for your intellectual abilities and adaptable business acumen.',
  'Mercury-11': 'Mercury in the 11th house brings gains through intellectual networks, technology ventures, and commercial dealings. Your friendships are mentally stimulating, and multiple income sources reflect your versatility.',
  'Mercury-12': 'Mercury in the 12th house inclines you toward contemplative thinking, writing in solitude, or working in foreign languages. Your intellect is turned inward toward spiritual inquiry and imagination.',

  // ── Jupiter ──
  'Jupiter-1': 'Jupiter in the 1st house is one of the most benefic placements, granting wisdom, optimism, a generous nature, and physical well-being. You are naturally ethical, spiritually inclined, and attract good fortune.',
  'Jupiter-2': 'Jupiter in the 2nd house blesses you with abundant wealth, a truthful and pleasant voice, and a harmonious family life. You accumulate resources through teaching, counseling, or spiritual professions.',
  'Jupiter-3': 'Jupiter in the 3rd house brings wisdom to your communication, philosophical depth to your writing, and harmonious relations with siblings. You are a thoughtful advisor and excel in publishing or media.',
  'Jupiter-4': 'Jupiter in the 4th house bestows exceptional domestic happiness, valuable properties, and a wise mother. You enjoy academic success, emotional stability, and find peace through spiritual practices at home.',
  'Jupiter-5': 'Jupiter in the 5th house is an extraordinarily fortunate placement, granting brilliant children, creative wisdom, and success in education. Your spiritual merit is strong, and speculative ventures are blessed.',
  'Jupiter-6': 'Jupiter in the 6th house helps you overcome enemies and health challenges through wisdom and divine grace. You excel in service professions and your generosity, even in competitive environments, wins you allies.',
  'Jupiter-7': 'Jupiter in the 7th house blesses you with a wise, virtuous, and supportive spouse. You are diplomatic, fair in dealings, and attract beneficial partnerships that expand your horizons.',
  'Jupiter-8': 'Jupiter in the 8th house grants longevity, protection from sudden calamities, and gains through inheritance. You possess deep occult wisdom and navigate life\'s transformations with spiritual grace.',
  'Jupiter-9': 'Jupiter in the 9th house is in its own signification, maximizing fortune, dharma, and spiritual wisdom. You are blessed with excellent teachers, foreign travel opportunities, and a righteous, prosperous father.',
  'Jupiter-10': 'Jupiter in the 10th house brings a prestigious, respected career in teaching, law, finance, or religious leadership. You are known for your ethical professional conduct and achieve high positions.',
  'Jupiter-11': 'Jupiter in the 11th house brings abundant gains, wealthy friends, and the fulfillment of grand ambitions. Your social circle includes wise and generous individuals who support your growth.',
  'Jupiter-12': 'Jupiter in the 12th house is excellent for spiritual liberation, charitable activities, and peaceful life in foreign lands. You spend wisely on higher causes and find ultimate fulfillment through detachment.',

  // ── Venus ──
  'Venus-1': 'Venus in the 1st house bestows physical beauty, charm, artistic talent, and a magnetic personality. You are socially graceful, enjoy luxury, and attract love and admiration naturally.',
  'Venus-2': 'Venus in the 2nd house brings wealth through beauty, art, entertainment, or luxury goods. Your speech is sweet and captivating, family life is harmonious, and you enjoy fine food and possessions.',
  'Venus-3': 'Venus in the 3rd house gives artistic talents in writing, music, or performing arts. Your communication style is elegant and charming, and you enjoy pleasant relationships with siblings.',
  'Venus-4': 'Venus in the 4th house blesses you with a beautiful, comfortable home, luxury vehicles, and deep emotional contentment. Your mother is graceful, and domestic life is filled with love and beauty.',
  'Venus-5': 'Venus in the 5th house brings romantic love, artistic creativity, and beautiful children. You are drawn to entertainment, luxury, and creative expression, and enjoy success in speculative ventures.',
  'Venus-6': 'Venus in the 6th house may create challenges in love life or health related to overindulgence. However, you bring grace to service roles and can succeed in beauty, fashion, or hospitality industries.',
  'Venus-7': 'Venus in the 7th house is one of the best placements for a beautiful, loving, and harmonious marriage. Your spouse is attractive and refined, and partnerships are marked by mutual affection and prosperity.',
  'Venus-8': 'Venus in the 8th house brings intensity to love life, potential inheritance, and interest in tantric or occult arts. Your sensuality is deep, and you may gain through your partner\'s resources.',
  'Venus-9': 'Venus in the 9th house brings love for philosophy, art, and culture. You may find romance during travels, have a refined spiritual practice, and your good fortune manifests through beauty and creativity.',
  'Venus-10': 'Venus in the 10th house brings a glamorous career in arts, entertainment, fashion, diplomacy, or luxury industries. You are publicly admired for your charm and achieve success through creative professions.',
  'Venus-11': 'Venus in the 11th house brings gains through artistic ventures, luxury trade, and beautiful friendships. Your social life is vibrant, desires are fulfilled, and income comes through creative or romantic fields.',
  'Venus-12': 'Venus in the 12th house enhances pleasures of the bed, foreign romance, and spiritual devotion through beauty. You appreciate refined solitude and may spend on luxury, charity, or foreign artistic pursuits.',

  // ── Saturn ──
  'Saturn-1': 'Saturn in the 1st house gives a serious, disciplined, and mature personality from an early age. You face life\'s challenges with stoic determination and build your character through persistent effort.',
  'Saturn-2': 'Saturn in the 2nd house may delay wealth accumulation but ensures lasting financial security through disciplined saving. Your speech is measured, family responsibilities are heavy, and resources grow slowly.',
  'Saturn-3': 'Saturn in the 3rd house builds courage through hardship and makes you a determined, persistent communicator. Relationships with siblings may be strained, but your efforts yield long-lasting results.',
  'Saturn-4': 'Saturn in the 4th house may bring difficulties in domestic life, a strict or distant mother, or delays in acquiring property. However, you build a solid, lasting home through patient, sustained effort.',
  'Saturn-5': 'Saturn in the 5th house may delay children or create a disciplined approach to education and creativity. Your intelligence is methodical, and speculative ventures require cautious, long-term planning.',
  'Saturn-6': 'Saturn in the 6th house is a strong placement for defeating enemies, overcoming chronic diseases, and excelling in labor-intensive fields. You are tireless in service and triumph through sheer persistence.',
  'Saturn-7': 'Saturn in the 7th house may delay marriage or bring a mature, older, or serious spouse. Partnerships require patience and commitment, but they endure and deepen over time.',
  'Saturn-8': 'Saturn in the 8th house grants longevity and the ability to endure prolonged hardships. You face life\'s deepest challenges with resilience and may deal professionally with death, taxes, or legacy matters.',
  'Saturn-9': 'Saturn in the 9th house brings a structured, disciplined approach to spirituality and higher learning. Your father may face hardships, and your philosophical views are practical and grounded in experience.',
  'Saturn-10': 'Saturn in the 10th house brings career success through discipline, perseverance, and methodical effort. You may face delays early but achieve lasting professional recognition and positions of authority.',
  'Saturn-11': 'Saturn in the 11th house brings slow but steady gains, reliable older friends, and fulfillment of long-held ambitions. Your patience in building networks pays off handsomely over time.',
  'Saturn-12': 'Saturn in the 12th house may bring expenses related to institutions, hospitals, or foreign lands. You develop spiritual depth through solitude, and meditation practices bring lasting inner peace.',

  // ── Rahu ──
  'Rahu-1': 'Rahu in the 1st house gives an unconventional, ambitious personality with a strong desire for worldly success. You are drawn to foreign cultures, technology, and innovative approaches to self-presentation.',
  'Rahu-2': 'Rahu in the 2nd house creates intense desire for wealth accumulation and may cause unusual speech patterns or dietary habits. You earn through unconventional means, technology, or foreign connections.',
  'Rahu-3': 'Rahu in the 3rd house amplifies courage, ambition in communication, and success through media or technology. You are daring in self-expression and may gain through unconventional writing or digital platforms.',
  'Rahu-4': 'Rahu in the 4th house creates a restless desire for luxurious comforts and property. You may live in foreign lands, acquire unusual properties, or have an unconventional relationship with your mother.',
  'Rahu-5': 'Rahu in the 5th house brings unusual creative talents, unconventional romance, and interest in speculative or technological ventures. Your approach to education is innovative but may be undisciplined.',
  'Rahu-6': 'Rahu in the 6th house is a powerful placement for defeating enemies through cunning and unconventional strategies. You excel in competitive environments and overcome obstacles through resourcefulness.',
  'Rahu-7': 'Rahu in the 7th house may bring a foreign or unconventional spouse and unusual business partnerships. You are drawn to people from different backgrounds and thrive in international business dealings.',
  'Rahu-8': 'Rahu in the 8th house intensifies interest in occult sciences, hidden knowledge, and transformation. You may experience sudden, dramatic life changes and can gain through research or unconventional inheritance.',
  'Rahu-9': 'Rahu in the 9th house creates an unconventional approach to spirituality, religion, and higher learning. You may follow unorthodox belief systems and find fortune through foreign connections or technology.',
  'Rahu-10': 'Rahu in the 10th house brings ambitious career goals and success through technology, foreign companies, or unconventional professions. You achieve fame through innovative approaches to your work.',
  'Rahu-11': 'Rahu in the 11th house is one of Rahu\'s best placements, bringing massive gains through technology, foreign connections, and large networks. Your ambitions are grand, and worldly desires find fulfillment.',
  'Rahu-12': 'Rahu in the 12th house may cause excessive expenditure, foreign settlement, or unusual spiritual experiences. You are drawn to meditation, isolation, and may encounter deceptive situations abroad.',

  // ── Ketu ──
  'Ketu-1': 'Ketu in the 1st house gives a spiritually inclined, introspective personality with detachment from material self-image. You possess intuitive wisdom, psychic abilities, and a mysterious aura.',
  'Ketu-2': 'Ketu in the 2nd house may create disruptions in family life, unusual speech patterns, or detachment from wealth. You possess spiritual knowledge but may be indifferent to material accumulation.',
  'Ketu-3': 'Ketu in the 3rd house gives you innate courage that requires no external validation. You may have a distant relationship with siblings but possess deep, intuitive communication abilities.',
  'Ketu-4': 'Ketu in the 4th house creates detachment from homeland, mother, or domestic comforts. You seek inner peace rather than material security and may feel like a wanderer searching for true belonging.',
  'Ketu-5': 'Ketu in the 5th house brings past-life spiritual merit, intuitive intelligence, and a detached approach to romance. Your children may be spiritually inclined, and creativity flows from deep inner sources.',
  'Ketu-6': 'Ketu in the 6th house is excellent for spiritual healing, overcoming enemies, and transcending health issues through alternative methods. You are naturally resistant to adversaries and possess occult healing abilities.',
  'Ketu-7': 'Ketu in the 7th house creates detachment in marriage or attracts a spiritually inclined partner. Partnerships may feel karmic, and you seek deeper meaning beyond conventional relationship dynamics.',
  'Ketu-8': 'Ketu in the 8th house grants deep occult knowledge, extraordinary intuition, and a fearless approach to life\'s mysteries. You possess natural healing abilities and navigate transformations with spiritual wisdom.',
  'Ketu-9': 'Ketu in the 9th house brings past-life spiritual attainment and innate wisdom about dharma. You may have a complex relationship with organized religion but possess profound philosophical understanding.',
  'Ketu-10': 'Ketu in the 10th house creates detachment from career ambitions and worldly recognition. You may achieve success unexpectedly or be drawn to unconventional, spiritually meaningful professions.',
  'Ketu-11': 'Ketu in the 11th house brings detachment from material gains and large social networks. You are selective in friendships and may receive unexpected gains that you approach with spiritual equanimity.',
  'Ketu-12': 'Ketu in the 12th house is one of the most spiritually potent placements, granting liberation, enlightenment potential, and deep meditative abilities. You naturally transcend worldly attachments and find peace in solitude.',
};

// ---------------------------------------------------------------------------
// Vedic Aspect Computation
// ---------------------------------------------------------------------------

/**
 * Returns the list of houses (1-12) that a planet in `fromHouse` aspects.
 *
 * Standard Vedic aspects:
 *  - Every planet aspects the 7th house from itself.
 *  - Mars additionally aspects the 4th and 8th houses from itself.
 *  - Jupiter additionally aspects the 5th and 9th houses from itself.
 *  - Saturn additionally aspects the 3rd and 10th houses from itself.
 *  - Rahu and Ketu additionally aspect the 5th and 9th houses from itself.
 */
function getAspectedHouses(planet: string, fromHouse: number): number[] {
  const houses: number[] = [];

  // Helper: wrap house number to 1-12 range
  const wrap = (h: number): number => ((h - 1) % 12 + 12) % 12 + 1;

  // All planets aspect 7th from themselves
  houses.push(wrap(fromHouse + 7));

  switch (planet) {
    case 'Mars':
      houses.push(wrap(fromHouse + 4));
      houses.push(wrap(fromHouse + 8));
      break;
    case 'Jupiter':
      houses.push(wrap(fromHouse + 5));
      houses.push(wrap(fromHouse + 9));
      break;
    case 'Saturn':
      houses.push(wrap(fromHouse + 3));
      houses.push(wrap(fromHouse + 10));
      break;
    case 'Rahu':
    case 'Ketu':
      houses.push(wrap(fromHouse + 5));
      houses.push(wrap(fromHouse + 9));
      break;
  }

  return houses;
}

// ---------------------------------------------------------------------------
// Aspect Effect Templates — BPHS & Saravali: planet's drishti (glance) on a house
// ---------------------------------------------------------------------------
const aspectEffects: Record<string, Record<number, string>> = {
  Sun: {
    1: "The Sun's aspect on the 1st house strengthens your confidence, vitality, and leadership qualities. Government favor and paternal blessings are indicated.",
    2: "The Sun's aspect on the 2nd house enhances family prestige and authoritative speech. Wealth may come through government or leadership positions.",
    4: "The Sun's aspect on the 4th house brings paternal influence on home life and potential for government-related property. Education and comfort are supported.",
    5: "The Sun's aspect on the 5th house enhances creative intelligence, political leanings, and pride in children's achievements.",
    7: "The Sun's aspect on the 7th house brings an authoritative quality to partnerships. Your spouse may be dignified, and business dealings carry prestige.",
    9: "The Sun's aspect on the 9th house strengthens dharma, fortune, and connection with father. Pilgrimage and higher learning are favored.",
    10: "The Sun's aspect on the 10th house powerfully supports career advancement, fame, and government recognition.",
    11: "The Sun's aspect on the 11th house brings gains through authority figures, government sources, and prestigious connections.",
  },
  Moon: {
    1: "The Moon's aspect gives a nurturing, emotionally receptive quality. Public popularity and emotional intelligence are enhanced.",
    2: "The Moon's aspect on the 2nd house enhances emotional attachment to family and fluctuating finances that trend positively.",
    4: "The Moon's aspect on the 4th house deepens domestic happiness, strengthens the bond with mother, and brings emotional security.",
    5: "The Moon's aspect on the 5th house enhances creativity, romantic feelings, and emotional connection with children.",
    7: "The Moon's aspect on the 7th house brings emotional depth to partnerships and attracts a nurturing, caring spouse.",
    10: "The Moon's aspect on the 10th house brings public fame and success in careers involving the masses, women, or caregiving.",
    11: "The Moon's aspect on the 11th house brings gains through public dealings, women, and emotionally fulfilling friendships.",
  },
  Mars: {
    1: "Mars' aspect on the 1st house adds courage, energy, and assertiveness to your personality. Physical vitality is strengthened.",
    4: "Mars' aspect on the 4th house brings energy to domestic matters but may create occasional friction at home. Property acquisition is favored.",
    5: "Mars' aspect on the 5th house sharpens competitive intelligence and brings athletic or spirited children.",
    7: "Mars' aspect on the 7th house brings passion and intensity to partnerships. The spouse is likely energetic and independent.",
    8: "Mars' aspect on the 8th house enhances investigative abilities and resilience. Inheritance through property is possible.",
    10: "Mars' aspect on the 10th house strongly supports careers in engineering, military, sports, surgery, or any field requiring courage.",
    11: "Mars' aspect on the 11th house brings gains through competitive endeavors, property, and bold initiative.",
  },
  Jupiter: {
    1: "Jupiter's benevolent aspect on the 1st house is one of the finest blessings — granting wisdom, optimism, and divine protection.",
    2: "Jupiter's aspect on the 2nd house enhances family wealth, truthful speech, and moral values within the household.",
    4: "Jupiter's aspect on the 4th house blesses domestic life with peace, excellent education, and valuable property.",
    5: "Jupiter's aspect on the 5th house is a tremendous blessing for children, creative intelligence, and spiritual merit.",
    7: "Jupiter's aspect on the 7th house brings a wise, virtuous spouse and harmonious, dharmic partnerships.",
    9: "Jupiter's aspect on the 9th house maximizes fortune, spiritual wisdom, and blessings from teachers and father.",
    10: "Jupiter's aspect on the 10th house brings career success through righteous means, teaching, or advisory roles.",
    11: "Jupiter's aspect on the 11th house is excellent for financial gains, influential friends, and fulfillment of noble desires.",
  },
  Venus: {
    1: "Venus' aspect on the 1st house adds charm, beauty, and artistic sensibility to your personality.",
    2: "Venus' aspect on the 2nd house enhances family harmony, beautiful speech, and wealth through artistic or luxury ventures.",
    4: "Venus' aspect on the 4th house brings luxurious home comforts, beautiful vehicles, and a graceful mother.",
    5: "Venus' aspect on the 5th house enhances romantic life, artistic creativity, and beauty in creative expression.",
    7: "Venus' aspect on the 7th house is one of the best influences for a beautiful, loving, and harmonious marriage.",
    10: "Venus' aspect on the 10th house supports careers in arts, entertainment, fashion, and luxury industries.",
    11: "Venus' aspect on the 11th house brings gains through beauty, art, romance, and socially delightful connections.",
  },
  Saturn: {
    1: "Saturn's aspect on the 1st house brings discipline, maturity, and a serious disposition. Success comes through patience and hard work.",
    3: "Saturn's aspect on the 3rd house strengthens determination and perseverance in communication. Results come slowly but are lasting.",
    4: "Saturn's aspect on the 4th house may bring delays in domestic happiness but builds a solid, enduring home foundation.",
    5: "Saturn's aspect on the 5th house may delay children or bring a disciplined approach to creativity and education.",
    7: "Saturn's aspect on the 7th house may delay marriage but brings a stable, committed, and enduring partnership.",
    10: "Saturn's aspect on the 10th house demands hard work in career but rewards with lasting authority and recognition.",
    11: "Saturn's aspect on the 11th house brings slow but steady gains and loyal, long-term friendships.",
  },
  Rahu: {
    1: "Rahu's aspect on the 1st house adds an unconventional, ambitious quality. Foreign influences and innovation shape your personality.",
    5: "Rahu's aspect on the 5th house brings unconventional creativity, interest in technology, and unique approaches to education.",
    7: "Rahu's aspect on the 7th house may bring a foreign or unconventional spouse and unusual business partnerships.",
    9: "Rahu's aspect on the 9th house creates an unconventional spiritual path and fortune through foreign connections.",
    10: "Rahu's aspect on the 10th house drives ambitious career goals, success through technology, and fame in unconventional fields.",
  },
  Ketu: {
    1: "Ketu's aspect on the 1st house adds spiritual depth and introspective qualities. Past-life wisdom enriches your personality.",
    5: "Ketu's aspect on the 5th house brings intuitive intelligence and interest in spiritual or esoteric subjects.",
    7: "Ketu's aspect on the 7th house may create detachment in partnerships or attract a spiritually inclined partner.",
    9: "Ketu's aspect on the 9th house grants innate spiritual wisdom and past-life merit in dharmic matters.",
  },
};

// ---------------------------------------------------------------------------
// Main export: generateAllBhavaPredictions
// ---------------------------------------------------------------------------
export function generateAllBhavaPredictions(vedicChart: VedicChart): BhavaPrediction[] {
  const ascendantIndex = vedicChart.ascendant.index; // 0-based sign index
  const planetEntries = Object.entries(vedicChart.planets);

  const predictions: BhavaPrediction[] = [];

  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    // 1. Sign of this house (0-indexed)
    const houseSignIndex = (ascendantIndex + houseNum - 1) % 12;

    // 2. Lord of this house
    const lordPlanet = signRulers[houseSignIndex];

    // 3. Find which house the lord occupies
    let lordPlacedIn = houseNum; // default to own house if lord not found
    for (const [name, data] of planetEntries) {
      if (name === lordPlanet) {
        lordPlacedIn = data.house;
        break;
      }
    }

    // 4. Find all planets occupying this house
    const occupants: string[] = [];
    for (const [name, data] of planetEntries) {
      if (data.house === houseNum) {
        occupants.push(name);
      }
    }

    // 5. Build prediction paragraph
    const parts: string[] = [];

    // a. Lord-in-house template
    const lordKey = `${houseNum}-in-${lordPlacedIn}`;
    if (lordInHouseTemplates[lordKey]) {
      parts.push(lordInHouseTemplates[lordKey]);
    }

    // b. Planet-in-house effects for each occupant
    for (const occ of occupants) {
      const effectKey = `${occ}-${houseNum}`;
      if (planetInHouseEffects[effectKey]) {
        parts.push(planetInHouseEffects[effectKey]);
      }
    }

    // 6. Collect aspects: find planets that aspect this house
    const aspects: string[] = [];
    for (const [name, data] of planetEntries) {
      const aspectedHouses = getAspectedHouses(name, data.house);
      if (aspectedHouses.includes(houseNum)) {
        aspects.push(name);
      }
    }

    // c. Aspect effects — add interpretation for aspecting planets
    for (const asp of aspects) {
      const aspEffect = aspectEffects[asp]?.[houseNum];
      if (aspEffect) {
        parts.push(aspEffect);
      }
    }

    const prediction = parts.join(' ');

    predictions.push({
      house: houseNum,
      houseName: houseNames[houseNum],
      lordPlanet,
      lordPlacedIn,
      occupants,
      prediction,
      aspects,
    });
  }

  return predictions;
}
