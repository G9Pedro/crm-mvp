const Deal = require('../models/Deal');
const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
const getDeals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, stage, sortBy = 'createdAt', order = 'desc' } = req.query;

  const query = { owner: req.user._id };

  // Filter by stage if provided
  if (stage) {
    query.stage = stage;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: order === 'desc' ? -1 : 1 },
  };

  const deals = await Deal.find(query)
    .populate('contact', 'firstName lastName email company')
    .sort(options.sort)
    .limit(options.limit)
    .skip((options.page - 1) * options.limit);

  const total = await Deal.countDocuments(query);

  res.json({
    deals,
    page: options.page,
    limit: options.limit,
    total,
    pages: Math.ceil(total / options.limit),
  });
});

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
const getDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id)
    .populate('contact', 'firstName lastName email company phone position');

  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }

  // Make sure user owns deal
  if (deal.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this deal');
  }

  res.json(deal);
});

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private
const createDeal = asyncHandler(async (req, res) => {
  const { title, value, stage, probability, expectedCloseDate, contact, notes } = req.body;

  // Verify contact exists and belongs to user
  const contactExists = await Contact.findOne({ 
    _id: contact, 
    owner: req.user._id 
  });

  if (!contactExists) {
    res.status(404);
    throw new Error('Contact not found or not authorized');
  }

  const deal = await Deal.create({
    title,
    value,
    stage: stage || 'prospecting',
    probability: probability || 0,
    expectedCloseDate,
    contact,
    notes,
    owner: req.user._id,
  });

  const populatedDeal = await Deal.findById(deal._id)
    .populate('contact', 'firstName lastName email company');

  res.status(201).json(populatedDeal);
});

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }

  // Make sure user owns deal
  if (deal.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this deal');
  }

  // If contact is being changed, verify it exists and belongs to user
  if (req.body.contact && req.body.contact !== deal.contact.toString()) {
    const contactExists = await Contact.findOne({ 
      _id: req.body.contact, 
      owner: req.user._id 
    });

    if (!contactExists) {
      res.status(404);
      throw new Error('Contact not found or not authorized');
    }
  }

  const updatedDeal = await Deal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('contact', 'firstName lastName email company');

  res.json(updatedDeal);
});

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }

  // Make sure user owns deal
  if (deal.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this deal');
  }

  await deal.deleteOne();

  res.json({ message: 'Deal deleted successfully', id: req.params.id });
});

// @desc    Update deal stage
// @route   PUT /api/deals/:id/stage
// @access  Private
const updateDealStage = asyncHandler(async (req, res) => {
  const { stage } = req.body;

  if (!stage) {
    res.status(400);
    throw new Error('Stage is required');
  }

  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }

  // Make sure user owns deal
  if (deal.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this deal');
  }

  deal.stage = stage;
  
  // Update probability based on stage
  const probabilityMap = {
    'prospecting': 10,
    'qualification': 25,
    'proposal': 50,
    'negotiation': 75,
    'closed-won': 100,
    'closed-lost': 0,
  };

  deal.probability = probabilityMap[stage] || deal.probability;

  await deal.save();

  const updatedDeal = await Deal.findById(deal._id)
    .populate('contact', 'firstName lastName email company');

  res.json(updatedDeal);
});

// @desc    Add activity to deal
// @route   POST /api/deals/:id/activity
// @access  Private
const addActivity = asyncHandler(async (req, res) => {
  const { type, description } = req.body;

  if (!type || !description) {
    res.status(400);
    throw new Error('Type and description are required');
  }

  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }

  // Make sure user owns deal
  if (deal.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this deal');
  }

  deal.activities.push({
    type,
    description,
    date: new Date(),
  });

  await deal.save();

  res.json(deal);
});

// @desc    Get deals by stage
// @route   GET /api/deals/by-stage/:stage
// @access  Private
const getDealsByStage = asyncHandler(async (req, res) => {
  const deals = await Deal.find({ 
    owner: req.user._id, 
    stage: req.params.stage 
  })
    .populate('contact', 'firstName lastName email company')
    .sort({ createdAt: -1 });

  res.json({
    stage: req.params.stage,
    deals,
    count: deals.length,
  });
});

// @desc    Get deal statistics
// @route   GET /api/deals/stats
// @access  Private
const getDealStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Total deals
  const totalDeals = await Deal.countDocuments({ owner: userId });

  // Deals by stage
  const dealsByStage = await Deal.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
  ]);

  // Total value
  const totalValue = await Deal.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: null, total: { $sum: '$value' } } },
  ]);

  // Won deals
  const wonDeals = await Deal.find({ owner: userId, stage: 'closed-won' });
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

  // Pipeline value (all open deals)
  const pipelineDeals = await Deal.find({ 
    owner: userId, 
    stage: { $nin: ['closed-won', 'closed-lost'] } 
  });
  const pipelineValue = pipelineDeals.reduce((sum, deal) => sum + deal.value, 0);

  res.json({
    totalDeals,
    totalValue: totalValue[0]?.total || 0,
    wonDeals: wonDeals.length,
    wonValue,
    pipelineValue,
    dealsByStage,
  });
});

module.exports = {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealStage,
  addActivity,
  getDealsByStage,
  getDealStats,
};
