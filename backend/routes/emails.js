const express = require('express');
const router = express.Router();
const { classifyEmail, getEmails, deleteEmail } = require('../controllers/emailController');
const authMiddleware = require('../middleware/auth');

router.post('/classify', authMiddleware, classifyEmail);
router.get('/', authMiddleware, getEmails);
router.delete('/:emailId', authMiddleware, deleteEmail);

module.exports = router;
