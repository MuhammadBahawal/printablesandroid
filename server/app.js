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

// Clean URL route mappings
app.get('/', (req, res) => res.sendFile(path.join(staticPath, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(staticPath, 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(staticPath, 'contact.html')));
app.get('/support', (req, res) => res.sendFile(path.join(staticPath, 'contact.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(staticPath, 'privacy.html')));
app.get('/terms', (req, res) => res.sendFile(path.join(staticPath, 'terms.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(staticPath, 'admin.html')));

// 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

module.exports = app;
