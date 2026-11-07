const { sendSupportEmails } = require('../services/emailService');

// @desc    Submit new contact/support feedback & dispatch emails
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, app_name, appName, feedback } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ success: false, error: 'Feedback message is required' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const selectedAppName = (appName || app_name || 'Printable AI 3D model Generator').trim();
    const trimmedFeedback = feedback.trim();
    const submissionId = 'PRT-' + Date.now().toString(36).toUpperCase();

    // Send emails (Admin notification to techtornix@gmail.com + User auto-confirmation)
    const emailResult = await sendSupportEmails({
      name: trimmedName,
      email: trimmedEmail,
      appName: selectedAppName,
      feedback: trimmedFeedback,
      id: submissionId,
    });

    if (!emailResult.sent && emailResult.error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to dispatch email. Please verify SMTP credentials.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent directly to our support team at techtornix@gmail.com. We have also sent a confirmation to your email.',
      data: {
        id: submissionId,
        name: trimmedName,
        email: trimmedEmail,
        appName: selectedAppName,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process message submission.',
    });
  }
};

// @desc    Health check endpoint
// @route   GET /api/health
// @access  Public
const getHealth = (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    emailRecipient: process.env.ADMIN_EMAIL || 'techtornix@gmail.com',
  });
};

module.exports = {
  submitContact,
  getHealth,
};
