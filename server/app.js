const path = require('path');
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', contactRoutes);

// Static frontend files from 'printable' directory
const staticPath = path.join(__dirname, '..', 'printable');
app.use(express.static(staticPath));
app.use('/printable', express.static(staticPath));

// Clean URL route mappings & rewrites
const sendPage = (pageName) => (req, res) => res.sendFile(path.join(staticPath, pageName));

app.get(['/', '/index', '/index.html', '/printable/index.html'], sendPage('index.html'));
app.get(['/about', '/about.html', '/printable/about.html'], sendPage('about.html'));
app.get(['/contact', '/contact.html', '/printable/contact.html', '/support', '/printable/support'], sendPage('contact.html'));
app.get(['/privacy', '/privacy.html', '/printable/privacy.html'], sendPage('privacy.html'));
app.get(['/terms', '/terms.html', '/printable/terms.html'], sendPage('terms.html'));
app.get(['/thanks', '/thanks.html', '/printable/thanks.html'], sendPage('thanks.html'));
app.get(['/admin', '/admin.html', '/printable/admin.html'], sendPage('admin.html'));

// 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

module.exports = app;
