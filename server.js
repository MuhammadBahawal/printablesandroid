require('dotenv').config();
const http = require('http');
const app = require('./server/app');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Printable Server running at: http://localhost:${PORT}`);
  console.log(`   - Home:     http://localhost:${PORT}/index.html`);
  console.log(`   - About:    http://localhost:${PORT}/about.html`);
  console.log(`   - Support:  http://localhost:${PORT}/contact.html`);
  console.log(`   - Privacy:  http://localhost:${PORT}/privacy.html`);
  console.log(`   - Terms:    http://localhost:${PORT}/terms.html`);
  console.log(`   - Health:   http://localhost:${PORT}/api/health`);
  console.log(`   - Emails:   Forwarding to techtornix@gmail.com`);
  console.log(`=================================================\n`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
