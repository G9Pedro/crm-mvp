const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'bounced', 'delivered', 'opened', 'clicked'],
      default: 'sent',
    },
    provider: {
      type: String,
      enum: ['resend', 'sendgrid', 'mailgun', 'other'],
      default: 'resend',
    },
    providerId: {
      type: String,
      trim: true,
    },
    error: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
emailLogSchema.index({ sender: 1, createdAt: -1 });
emailLogSchema.index({ contact: 1, createdAt: -1 });
emailLogSchema.index({ status: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
