const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.from - Sender email (must be verified domain)
 * @param {string} options.replyTo - Reply-to email
 * @returns {Promise<Object>} - Email send result
 */
const sendEmail = async ({ to, subject, html, from, replyTo }) => {
  try {
    // Use verified domain or default from address
    const fromAddress = process.env.RESEND_FROM_EMAIL || from || 'onboarding@resend.dev';

    const result = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
      replyTo: replyTo || from,
    });

    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error(error.message || 'Failed to send email');
  }
};

/**
 * Send templated email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.template - Template name
 * @param {Object} options.data - Template data
 * @returns {Promise<Object>} - Email send result
 */
const sendTemplatedEmail = async ({ to, template, data }) => {
  // Define email templates
  const templates = {
    welcome: {
      subject: 'Welcome to CRM MVP!',
      html: `
        <h1>Welcome ${data.name}!</h1>
        <p>Thank you for joining our CRM platform.</p>
        <p>We're excited to help you manage your customer relationships.</p>
      `,
    },
    contactAdded: {
      subject: 'New Contact Added',
      html: `
        <h2>New Contact Added</h2>
        <p>Contact: ${data.contactName}</p>
        <p>Email: ${data.email}</p>
      `,
    },
    dealWon: {
      subject: 'Deal Closed - Congratulations! 🎉',
      html: `
        <h2>Congratulations!</h2>
        <p>You've closed a deal: ${data.dealTitle}</p>
        <p>Value: $${data.value}</p>
      `,
    },
  };

  const selectedTemplate = templates[template];

  if (!selectedTemplate) {
    throw new Error(`Template '${template}' not found`);
  }

  return sendEmail({
    to,
    subject: selectedTemplate.subject,
    html: selectedTemplate.html,
    from: process.env.RESEND_FROM_EMAIL,
  });
};

module.exports = {
  sendEmail,
  sendTemplatedEmail,
};
