const app = require('../server/index');

module.exports = (req, res) => {
  // Guarantee Express route matching whether Vercel strips /api or keeps it
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
