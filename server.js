const { createServer } = require('http');
const { createReadStream } = require('fs');
const { parse } = require('url');
const path = require('path');

const express = require('express');
const compression = require('compression');
const next = require('next');

let dev = process.env.NODE_ENV !== 'production';
let port = parseInt(process.env.PORT, 10) || 3000;

let app = next({ dev });
let handle = app.getRequestHandler();

app.prepare().then(() => {
  let server = express();

  if (!dev) {
    server.use(compression());
  }

  server.get('/service-worker.js', ServiceWorker(app));

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

function ServiceWorker(app) {
  return (req, res) => {
    let filePath = path.join(__dirname, '.next', 'static', 'service-worker.js');
    app.serveStatic(req, res, filePath);
  };
}
