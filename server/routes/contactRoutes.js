const express = require('express');
const router = express.Router();
const {
  submitContact,
  getHealth,
} = require('../controllers/contactController');

// Support & Contact submissions via Nodemailer
router.post('/contact', submitContact);

// Health check endpoint
router.get('/health', getHealth);

module.exports = router;
