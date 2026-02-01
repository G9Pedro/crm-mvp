const express = require('express');
const router = express.Router();
const {
  sendEmail,
  getEmailHistory,
  sendBulkEmail
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');
const { validateEmail } = require('../utils/validators');

// All routes are protected
router.use(protect);

router.post('/send', validateEmail, sendEmail);
router.post('/bulk', sendBulkEmail);
router.get('/history', getEmailHistory);
router.get('/history/:contactId', getEmailHistory);

module.exports = router;
