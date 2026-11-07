module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    emailRecipient: process.env.ADMIN_EMAIL || 'techtornix@gmail.com',
  });
};

