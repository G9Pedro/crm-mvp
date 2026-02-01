const Contact = require('../models/Contact');
const EmailLog = require('../models/EmailLog');
const asyncHandler = require('../middleware/asyncHandler');
const emailService = require('../services/emailService');

// @desc    Send email to contact
// @route   POST /api/emails/send
// @access  Private
const sendEmail = asyncHandler(async (req, res) => {
  const { contactId, subject, message, template } = req.body;

  // Get contact
  const contact = await Contact.findOne({ 
    _id: contactId, 
    owner: req.user._id 
  });

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found or not authorized');
  }

  // Send email using Resend
  try {
    const result = await emailService.sendEmail({
      to: contact.email,
      subject,
      html: message,
      from: req.user.email,
      replyTo: req.user.email,
    });

    // Log email
    const emailLog = await EmailLog.create({
      contact: contactId,
      sender: req.user._id,
      recipient: contact.email,
      subject,
      message,
      status: 'sent',
      provider: 'resend',
      providerId: result.id,
    });

    res.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.id,
      log: emailLog,
    });
  } catch (error) {
    // Log failed email
    await EmailLog.create({
      contact: contactId,
      sender: req.user._id,
      recipient: contact.email,
      subject,
      message,
      status: 'failed',
      error: error.message,
    });

    res.status(500);
    throw new Error(`Failed to send email: ${error.message}`);
  }
});

// @desc    Send bulk email
// @route   POST /api/emails/bulk
// @access  Private
const sendBulkEmail = asyncHandler(async (req, res) => {
  const { contactIds, subject, message } = req.body;

  if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
    res.status(400);
    throw new Error('Contact IDs array is required');
  }

  // Get contacts
  const contacts = await Contact.find({ 
    _id: { $in: contactIds },
    owner: req.user._id 
  });

  if (contacts.length === 0) {
    res.status(404);
    throw new Error('No valid contacts found');
  }

  const results = {
    success: [],
    failed: [],
  };

  // Send emails
  for (const contact of contacts) {
    try {
      const result = await emailService.sendEmail({
        to: contact.email,
        subject,
        html: message,
        from: req.user.email,
        replyTo: req.user.email,
      });

      // Log success
      await EmailLog.create({
        contact: contact._id,
        sender: req.user._id,
        recipient: contact.email,
        subject,
        message,
        status: 'sent',
        provider: 'resend',
        providerId: result.id,
      });

      results.success.push({
        contactId: contact._id,
        email: contact.email,
        emailId: result.id,
      });
    } catch (error) {
      // Log failure
      await EmailLog.create({
        contact: contact._id,
        sender: req.user._id,
        recipient: contact.email,
        subject,
        message,
        status: 'failed',
        error: error.message,
      });

      results.failed.push({
        contactId: contact._id,
        email: contact.email,
        error: error.message,
      });
    }
  }

  res.json({
    message: 'Bulk email process completed',
    total: contacts.length,
    successCount: results.success.length,
    failedCount: results.failed.length,
    results,
  });
});

// @desc    Get email history
// @route   GET /api/emails/history
// @route   GET /api/emails/history/:contactId
// @access  Private
const getEmailHistory = asyncHandler(async (req, res) => {
  const { contactId } = req.params;
  const { page = 1, limit = 20, status } = req.query;

  const query = { sender: req.user._id };

  // Filter by contact if provided
  if (contactId) {
    query.contact = contactId;
  }

  // Filter by status if provided
  if (status) {
    query.status = status;
  }

  const emails = await EmailLog.find(query)
    .populate('contact', 'firstName lastName email company')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await EmailLog.countDocuments(query);

  res.json({
    emails,
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / parseInt(limit)),
  });
});

module.exports = {
  sendEmail,
  sendBulkEmail,
  getEmailHistory,
};
