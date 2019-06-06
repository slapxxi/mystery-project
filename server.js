const path = require('path');
const express = require('express');
const compression = require('compression');
const next = require('next');
const nextI18NextMiddleware = require('next-i18next/middleware');
const firebaseAdmin = require('firebase-admin');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const nexti18next = require('./i18n');

let dev = process.env.NODE_ENV !== 'production';
let port = parseInt(process.env.PORT, 10) || 3000;

let app = next({ dev });
let handle = app.getRequestHandler();

let firebase = firebaseAdmin.initializeApp(
  {
    credential: firebaseAdmin.credential.cert('service-account.json'),
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  'server'
);

app.prepare().then(() => {
  let server = express();

  if (!dev) {
    server.use(compression());
  }

  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: new FileStore({ path: '/tmp/sessions', secret: process.env.SESSION_SECRET }),
      cookie: { maxAge: 604800000 },
    })
  );

  server.use(bodyParser.json());

  server.get('/service-worker.js', ServiceWorker(app));

  server.use(nextI18NextMiddleware(nexti18next));

  server.use((req, res, next) => {
    req.firebaseServer = firebase;
    next();
  });

  server.post('/api/login', async (req, res) => {
    try {
      if (!req.body) {
        return res.sendStatus(400);
      }

      let token = req.body.token;
      let decodedToken = await firebase.auth().verifyIdToken(token);

      req.session.decodedToken = decodedToken;
      res.json({ status: true, decodedToken });
    } catch (error) {
      res.json({ error });
    }
  });

  server.post('/api/logout', (req, res) => {
    req.session.decodedToken = null;
    res.json({ status: true });
  });

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

async function fetch(url) {
  return url;
}
