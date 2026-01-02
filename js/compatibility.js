// Compatibility Calculator JavaScript

const gunaDetails = [
    { name: 'Varna', max: 1, desc: 'Spiritual compatibility' },
    { name: 'Vashya', max: 2, desc: 'Mutual attraction' },
    { name: 'Tara', max: 3, desc: 'Destiny & health' },
    { name: 'Yoni', max: 4, desc: 'Physical compatibility' },
    { name: 'Graha Maitri', max: 5, desc: 'Mental compatibility' },
    { name: 'Gana', max: 6, desc: 'Temperament' },
    { name: 'Bhakoot', max: 7, desc: 'Emotional harmony' },
    { name: 'Nadi', max: 8, desc: 'Health & genes' }
];

const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Simplified nakshatra calculation from date
function getNakshatraIndex(dateStr) {
    const date = new Date(dateStr);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return dayOfYear % 27;
}

// Calculate individual Guna scores
function calculateGunaScores(nakshatra1, nakshatra2) {
    const n1 = nakshatra1;
    const n2 = nakshatra2;

    // Simplified scoring algorithm
    const scores = [];

    // Varna (0-1)
    const varnaScore = Math.abs(n1 - n2) % 4 === 0 ? 1 : (Math.abs(n1 - n2) % 2 === 0 ? 0.5 : 0);
    scores.push({ ...gunaDetails[0], obtained: varnaScore });

    // Vashya (0-2)
    const vashyaScore = Math.min(2, 2 - (Math.abs(n1 - n2) % 3));
    scores.push({ ...gunaDetails[1], obtained: vashyaScore });

    // Tara (0-3)
    const taraDiff = Math.abs(n1 - n2) % 9;
    const taraScore = taraDiff <= 3 ? 3 : (taraDiff <= 6 ? 1.5 : 0);
    scores.push({ ...gunaDetails[2], obtained: taraScore });

    // Yoni (0-4)
    const yoniScore = ((n1 + n2) % 5) <= 2 ? 4 : (((n1 + n2) % 5) === 3 ? 2 : 1);
    scores.push({ ...gunaDetails[3], obtained: yoniScore });

    // Graha Maitri (0-5)
    const maitriScore = Math.abs(n1 - n2) <= 9 ? 5 : (Math.abs(n1 - n2) <= 18 ? 3 : 0);
    scores.push({ ...gunaDetails[4], obtained: maitriScore });

    // Gana (0-6)
    const gana1 = n1 % 3;
    const gana2 = n2 % 3;
    const ganaScore = gana1 === gana2 ? 6 : (Math.abs(gana1 - gana2) === 1 ? 3 : 0);
    scores.push({ ...gunaDetails[5], obtained: ganaScore });

    // Bhakoot (0-7)
    const rashi1 = Math.floor(n1 * 12 / 27);
    const rashi2 = Math.floor(n2 * 12 / 27);
    const rashiDiff = Math.abs(rashi1 - rashi2);
    const bhakootScore = (rashiDiff === 0 || rashiDiff === 6) ? 0 : 7;
    scores.push({ ...gunaDetails[6], obtained: bhakootScore });

    // Nadi (0-8)
    const nadi1 = n1 % 3;
    const nadi2 = n2 % 3;
    const nadiScore = nadi1 !== nadi2 ? 8 : 0;
    scores.push({ ...gunaDetails[7], obtained: nadiScore });

    return scores;
}

// Get verdict based on score
function getVerdict(totalScore) {
    if (totalScore >= 28) {
        return {
            title: 'Excellent Match!',
            description: 'This is an excellent match with a very high compatibility score. The union is blessed with harmony, understanding, and mutual respect. All major aspects of life are well-aligned for a successful partnership.'
        };
    } else if (totalScore >= 21) {
        return {
            title: 'Good Match',
            description: 'This is a good match with above-average compatibility. While some areas may need attention, the overall alignment is positive. With mutual effort, this relationship can thrive.'
        };
    } else if (totalScore >= 18) {
        return {
            title: 'Average Match',
            description: 'This is an average match. Some compatibility exists, but there are areas of concern. Consultation with an astrologer is recommended to understand potential challenges and remedies.'
        };
    } else {
        return {
            title: 'Challenging Match',
            description: 'This match shows below-average compatibility. Significant challenges may exist in certain areas. We strongly recommend consulting an experienced astrologer for detailed analysis and remedial measures.'
        };
    }
}

// Form submission handler
document.getElementById('compatibility-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name1 = document.getElementById('name1').value;
    const name2 = document.getElementById('name2').value;
    const dob1 = document.getElementById('dob1').value;
    const dob2 = document.getElementById('dob2').value;

    // Get nakshatra indices
    const nakshatra1 = getNakshatraIndex(dob1);
    const nakshatra2 = getNakshatraIndex(dob2);

    // Calculate scores
    const scores = calculateGunaScores(nakshatra1, nakshatra2);
    const totalScore = scores.reduce((sum, s) => sum + s.obtained, 0);
    const percentage = (totalScore / 36) * 100;

    // Update UI
    document.getElementById('partner-names').textContent = `${name1} & ${name2}`;

    // Animate score circle
    const scoreCircle = document.getElementById('score-circle');
    scoreCircle.style.setProperty('--score-percent', `${percentage}%`);
    document.getElementById('total-score').innerHTML = `${Math.round(totalScore)}<span>/36</span>`;

    // Populate guna table
    const gunaTable = document.getElementById('guna-scores');
    gunaTable.innerHTML = '';

    scores.forEach(score => {
        const row = document.createElement('tr');
        const scoreClass = score.obtained >= score.max * 0.7 ? 'score-good' :
                          score.obtained >= score.max * 0.4 ? 'score-medium' : 'score-low';
        row.innerHTML = `
            <td><strong>${score.name}</strong></td>
            <td>${score.max}</td>
            <td class="${scoreClass}">${score.obtained}</td>
            <td>${score.desc}</td>
        `;
        gunaTable.appendChild(row);
    });

    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td><strong>36</strong></td>
        <td><strong class="${totalScore >= 18 ? 'score-good' : 'score-low'}">${Math.round(totalScore)}</strong></td>
        <td><strong>${Math.round(percentage)}% Match</strong></td>
    `;
    gunaTable.appendChild(totalRow);

    // Update verdict
    const verdict = getVerdict(totalScore);
    document.getElementById('result-verdict').textContent = verdict.title;
    document.getElementById('result-description').textContent = verdict.description;

    // Show results
    document.getElementById('compatibility-result').classList.add('active');

    // Scroll to results
    document.getElementById('compatibility-result').scrollIntoView({ behavior: 'smooth' });
});
