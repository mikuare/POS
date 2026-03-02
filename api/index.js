let app;
let startupError = null;

try {
  app = require('../src/server');
} catch (error) {
  startupError = error;
  console.error('[Startup] Failed to load server:', error);
}

module.exports = (req, res) => {
  if (startupError || !app) {
    const message = startupError?.message || 'Server startup failed';
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Server startup failed',
      message
    }));
    return;
  }

  return app(req, res);
};
