const { sendSupportEmails } = require('../server/services/emailService');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, app_name, appName, feedback } = req.body || {};

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

    // Dispatch dual emails (Admin notification to techtornix@gmail.com + User auto-confirmation)
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

