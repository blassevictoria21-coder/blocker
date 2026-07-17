const spamPatterns = [
  { word: 'free', weight: 1 },
  { word: 'offer', weight: 1 },
  { word: 'win', weight: 2 },
  { word: 'prize', weight: 2 },
  { word: 'limited', weight: 1 },
  { word: 'urgent', weight: 1 },
  { word: 'act now', weight: 2 },
  { word: 'click here', weight: 1 },
  { word: 'claim', weight: 1 },
  { word: 'verify', weight: 1 },
  { word: 'congratulations', weight: 2 },
  { word: 'inheritance', weight: 2 },
];

const suspiciousDomains = [
  'noreply@',
  'no-reply@',
  'donotreply@',
  'spam@',
  'marketing@',
  'promotions@',
  'deals@',
  'offers@',
];

const calculateSpamScore = (subject, from, to) => {
  let score = 0;
  const lowerSubject = (subject || '').toLowerCase();
  const lowerFrom = (from || '').toLowerCase();

  // Check subject patterns
  for (const pattern of spamPatterns) {
    if (pattern.word && lowerSubject.includes(pattern.word)) {
      score += pattern.weight;
    } else if (pattern.regex && pattern.regex.test(lowerSubject)) {
      score += pattern.weight;
    }
  }

  // Check for special characters
  if (/!!!+/.test(lowerSubject)) score += 1;
  if (/\$\d+/.test(lowerSubject)) score += 1;
  if (/\[URGENT\]/i.test(lowerSubject)) score += 2;

  // Check sender domain
  for (const domain of suspiciousDomains) {
    if (lowerFrom.includes(domain)) score += 2;
  }

  // Check for self-addressed emails
  if (from && to && lowerFrom === (to || '').toLowerCase()) {
    score += 1;
  }

  return Math.min(score, 10);
};

const isSpam = (subject, from, to) => {
  const score = calculateSpamScore(subject, from, to);
  return score >= 2 ? 'spam' : 'safe';
};

module.exports = {
  calculateSpamScore,
  isSpam,
};
