const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  exportContacts
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { validateContact } = require('../utils/validators');

// All routes are protected
router.use(protect);

// Search and export routes (must come before :id routes)
router.get('/search', searchContacts);
router.get('/export', exportContacts);

// CRUD routes
router.route('/')
  .get(getContacts)
  .post(validateContact, createContact);

router.route('/:id')
  .get(getContact)
  .put(validateContact, updateContact)
  .delete(deleteContact);

module.exports = router;
