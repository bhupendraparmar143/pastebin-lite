const express = require('express');
const {
  healthCheck,
  createPaste,
  getPaste,
  viewPaste
} = require('../controllers/pasteController');

const router = express.Router();

// Health check
router.get('/healthz', healthCheck);

// API routes
router.post('/pastes', createPaste);
router.get('/pastes/:id', getPaste);

// HTML view route
router.get('/p/:id', viewPaste);

module.exports = router;
