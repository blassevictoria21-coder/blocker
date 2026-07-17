const { query } = require('../config/database');
const { isSpam } = require('../utils/spamDetector');
const logger = require('../utils/logger');

const classifyEmail = async (req, res) => {
  try {
    const { from, to, subject } = req.body;
    const userId = req.user.userId;

    if (!subject || subject.trim().length === 0) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    // Classify email
    const classification = isSpam(subject, from, to);
    const spamScore = calculateSpamScore(subject, from, to);

    // Store in database
    const result = await query(
      `INSERT INTO emails (user_id, email_from, email_to, subject, classification, spam_score, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, classification, spam_score, created_at`,
      [userId, from || 'Unknown', to || 'Unknown', subject, classification, spamScore]
    );

    logger.info(`Email classified: ${classification} (score: ${spamScore})`);
    res.json({
      email: result.rows[0],
      classification,
      spamScore,
    });
  } catch (error) {
    logger.error('Email classification error:', error);
    res.status(500).json({ error: 'Classification failed' });
  }
};

const getEmails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, offset = 0, filter = 'all' } = req.query;

    let whereClause = 'WHERE user_id = $1';
    const params = [userId];

    if (filter === 'spam') {
      whereClause += ' AND classification = \'spam\'';
    } else if (filter === 'safe') {
      whereClause += ' AND classification = \'safe\'';
    }

    const result = await query(
      `SELECT id, email_from, email_to, subject, classification, spam_score, created_at
       FROM emails
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM emails ${whereClause}`,
      params
    );

    res.json({
      emails: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    logger.error('Get emails error:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

const deleteEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    const userId = req.user.userId;

    const result = await query(
      'DELETE FROM emails WHERE id = $1 AND user_id = $2 RETURNING id',
      [emailId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    logger.info(`Email deleted: ${emailId}`);
    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    logger.error('Delete email error:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
};

const calculateSpamScore = (subject, from, to) => {
  let score = 0;
  const spamPatterns = [
    { word: 'free', weight: 1 },
    { word: 'offer', weight: 1 },
    { word: 'win', weight: 2 },
    { word: 'prize', weight: 2 },
    { word: 'limited', weight: 1 },
    { word: 'urgent', weight: 1 },
    { word: 'click here', weight: 2 },
    { word: 'congratulations', weight: 2 },
    { word: 'inheritance', weight: 2 },
    { regex: /!!!+/, weight: 1 },
    { regex: /\$\d+/, weight: 1 },
  ];

  const lowerSubject = (subject || '').toLowerCase();

  for (const pattern of spamPatterns) {
    if (pattern.word && lowerSubject.includes(pattern.word)) score += pattern.weight;
    if (pattern.regex && pattern.regex.test(lowerSubject)) score += pattern.weight;
  }

  if (from && from.toLowerCase().includes('noreply')) score += 2;
  if (from && from.toLowerCase().includes('marketing')) score += 2;
  if (from && from === to) score += 1;

  return Math.min(score, 10);
};

module.exports = {
  classifyEmail,
  getEmails,
  deleteEmail,
};
