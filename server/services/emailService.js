const nodemailer = require('nodemailer');

/**
 * Creates and returns Nodemailer transporter based on .env config.
 * Supports Gmail, Outlook, Hostinger, or standard SMTP.
 */
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  let pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  // Strip spaces, dashes, or underscores (e.g. from Google 16-character App Passwords)
  if (typeof pass === 'string') {
    pass = pass.replace(/[\s_-]/g, '');
  }

  // If using standard host & port
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }

  // Default to standard service (e.g. Gmail)
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user, pass },
  });
};

/**
 * Sends both Admin notification email and User confirmation auto-reply.
 */
const sendSupportEmails = async ({ name, email, appName, feedback, id }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(
      '\x1b[36mℹ [EmailService] Email sending skipped: EMAIL_USER and EMAIL_PASS are not configured in .env.\x1b[0m'
    );
    return { sent: false, reason: 'unconfigured' };
  }

  const senderAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'techtornix@gmail.com';
  const adminRecipient = process.env.ADMIN_EMAIL || 'techtornix@gmail.com';

  try {
    // 1. Email to Admin
    const adminMailPromise = transporter.sendMail({
      from: `"Printable Support System" <${senderAddress}>`,
      to: adminRecipient,
      replyTo: `"${name}" <${email}>`,
      subject: `🚨 New Support Inquiry from ${name} [${appName}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fafafa;">
          <h2 style="color: #072b1d; margin-top: 0;">New Support &amp; Feedback Inquiry</h2>
          <p style="color: #555;">A user has submitted a message via the Printable website support form.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
          <p><strong>Sender Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>App:</strong> ${escapeHtml(appName)}</p>
          <p><strong>Submission ID:</strong> <code>${id || 'N/A'}</code></p>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #9ef8ad; border-radius: 4px; margin-top: 15px;">
            <p style="margin: 0; white-space: pre-wrap; color: #222;">${escapeHtml(feedback)}</p>
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">You can reply directly to this email to respond to the sender.</p>
        </div>
      `,
    });

    // 2. Email to User (Auto Confirmation)
    const userMailPromise = transporter.sendMail({
      from: `"Printable Support" <${senderAddress}>`,
      to: email,
      subject: `We've received your request - Printable Support`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #213830; border-radius: 12px; background-color: #08110e; color: #f3f8f5;">
          <h2 style="color: #9ef8ad; margin-top: 0;">Hi ${escapeHtml(name)},</h2>
          <p style="color: #c0d4cb; line-height: 1.6;">
            Thank you for reaching out to <strong>Printable AI 3D Model Generator</strong> support. We have received your inquiry and our engineering team will review it shortly.
          </p>
          <div style="background-color: #101c17; border: 1px solid #294038; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: #9ef8ad; font-weight: bold;">Your Submitted Message:</p>
            <p style="margin: 0; color: #e0ece5; font-size: 14px; white-space: pre-wrap;">${escapeHtml(feedback)}</p>
          </div>
          <p style="color: #a4bbb0; font-size: 14px; line-height: 1.6;">
            If you have additional attachments, crash logs, or reference screenshots, please reply directly to this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #213830; margin: 20px 0;">
          <p style="font-size: 12px; color: #6e867b; margin: 0;">
            &copy; 2026 Printable AI 3D Model Generator &bull; TechTornix
          </p>
        </div>
      `,
    });

    await Promise.all([adminMailPromise, userMailPromise]);
    console.log(`\x1b[32m✔ [EmailService] Emails dispatched successfully to Admin (${adminRecipient}) and User (${email}).\x1b[0m`);
    return { sent: true };
  } catch (error) {
    console.error(`\x1b[31m✖ [EmailService] Failed to send email:\x1b[0m`, error.message);
    return { sent: false, error: error.message };
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { sendSupportEmails };

