const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get counts
    const statsResult = await query(
      `SELECT
        COUNT(*) as total_emails,
        SUM(CASE WHEN classification = 'spam' THEN 1 ELSE 0 END) as spam_count,
        SUM(CASE WHEN classification = 'safe' THEN 1 ELSE 0 END) as safe_count,
        AVG(spam_score) as avg_spam_score
       FROM emails WHERE user_id = $1`,
      [userId]
    );

    // Get recent emails
    const recentResult = await query(
      `SELECT classification, COUNT(*) as count
       FROM emails
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'
       GROUP BY classification`,
      [userId]
    );

    res.json({
      stats: statsResult.rows[0],
      recent: recentResult.rows,
    });
  } catch (error) {
    logger.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
