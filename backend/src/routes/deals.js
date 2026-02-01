const express = require('express');
const router = express.Router();
const {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealStage,
  addActivity,
  getDealsByStage,
  getDealStats
} = require('../controllers/dealController');
const { protect } = require('../middleware/auth');
const { validateDeal } = require('../utils/validators');

// All routes are protected
router.use(protect);

// Stats and special routes (must come before :id routes)
router.get('/stats', getDealStats);
router.get('/by-stage/:stage', getDealsByStage);

// CRUD routes
router.route('/')
  .get(getDeals)
  .post(validateDeal, createDeal);

router.route('/:id')
  .get(getDeal)
  .put(validateDeal, updateDeal)
  .delete(deleteDeal);

// Deal-specific actions
router.put('/:id/stage', updateDealStage);
router.post('/:id/activity', addActivity);

module.exports = router;
