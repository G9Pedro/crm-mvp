const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, sortBy = 'createdAt', order = 'desc' } = req.query;

  const query = { owner: req.user._id };

  // Filter by status if provided
  if (status) {
    query.status = status;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: order === 'desc' ? -1 : 1 },
  };

  const contacts = await Contact.find(query)
    .sort(options.sort)
    .limit(options.limit)
    .skip((options.page - 1) * options.limit);

  const total = await Contact.countDocuments(query);

  res.json({
    contacts,
    page: options.page,
    limit: options.limit,
    total,
    pages: Math.ceil(total / options.limit),
  });
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  // Make sure user owns contact
  if (contact.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this contact');
  }

  res.json(contact);
});

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, company, position, status, tags, notes } = req.body;

  // Check if contact with email already exists for this user
  const contactExists = await Contact.findOne({ email, owner: req.user._id });
  if (contactExists) {
    res.status(400);
    throw new Error('Contact with this email already exists');
  }

  const contact = await Contact.create({
    firstName,
    lastName,
    email,
    phone,
    company,
    position,
    status: status || 'lead',
    tags: tags || [],
    notes,
    owner: req.user._id,
  });

  res.status(201).json(contact);
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  // Make sure user owns contact
  if (contact.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this contact');
  }

  // If email is being changed, check if it's already in use
  if (req.body.email && req.body.email !== contact.email) {
    const emailExists = await Contact.findOne({ 
      email: req.body.email, 
      owner: req.user._id,
      _id: { $ne: contact._id }
    });
    if (emailExists) {
      res.status(400);
      throw new Error('Contact with this email already exists');
    }
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedContact);
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  // Make sure user owns contact
  if (contact.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this contact');
  }

  await contact.deleteOne();

  res.json({ message: 'Contact deleted successfully', id: req.params.id });
});

// @desc    Search contacts
// @route   GET /api/contacts/search?q=searchTerm
// @access  Private
const searchContacts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const searchRegex = new RegExp(q, 'i');

  const query = {
    owner: req.user._id,
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { company: searchRegex },
      { phone: searchRegex },
    ],
  };

  const contacts = await Contact.find(query)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Contact.countDocuments(query);

  res.json({
    contacts,
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// @desc    Export contacts
// @route   GET /api/contacts/export
// @access  Private
const exportContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ owner: req.user._id })
    .select('-owner -__v')
    .lean();

  res.json({
    contacts,
    exportedAt: new Date().toISOString(),
    count: contacts.length,
  });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  exportContacts,
};
