import bodyParser from 'body-parser';
// import cacheableResponse from 'cacheable-response';
import compression from 'compression';
import express from 'express';
import session from 'express-session';
import firebaseAdmin from 'firebase-admin';
import http from 'http';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';
import path from 'path';
import nexti18next from '../i18n';
// import generateCacheKey from '../lib/server/generateCacheKey';

const FileStore = require('session-file-store')(session);

let rootDir = path.join(__dirname, '..', '..');
let env = process.env.NODE_ENV;
let dev = env !== 'production';
let port = parseInt(process.env.PORT!, 10) || 3000;

let app = next({ dev });
let handle = app.getRequestHandler();

let routes = {
  index: '/',
  feed: '/feed',
  settings: '/settings',
  api: {
    login: '/api/login',
    logout: '/api/logout',
  },
  serviceWorker: '/service-worker.js',
  all: '*',
} as const;

let firebase = firebaseAdmin.initializeApp(
  {
    credential: firebaseAdmin.credential.cert('service-account.json'),
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  'server'
);

// let ssrCache = cacheableResponse({
//   ttl: 1000 * 60 * 60,
//   getKey: generateCacheKey,
//   get: async (params) => {
//     let { req, res, pagePath, queryParams } = params;
//     return {
//       data: await app.renderToHTML(req, res, pagePath, queryParams),
//     };
//   },
//   send: (params) => {
//     let { data, res } = params;
//     res.send(data);
//   },
// });

app.prepare().then(() => {
  let server = express();

  if (!dev) {
    server.use(compression());
  }

  server.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: true,
      store: new FileStore({ path: '/tmp/sessions', secret: process.env.SESSION_SECRET }),
      cookie: { maxAge: 604800000 },
    })
  );

  server.use(bodyParser.json());

  server.use((req, _, next) => {
    req.firebaseServer = firebase;
    next();
  });

  server.use(nextI18NextMiddleware(nexti18next));

  server.get(routes.serviceWorker, serviceWorkerHandler(app));

  server.post(routes.api.login, async (req, res) => {
    try {
      if (!req.body || !req.session) {
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

  server.post(routes.api.logout, (req, res) => {
    if (req.session) {
      req.session.decodedToken = null;
    }
    res.json({ status: true });
  });

  server.get(routes.all, (req, res) => {
    return handle(req, res);
  });

  if (env === 'test') {
    return server;
  }

  return server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

/**
 * Creates service worker handler function with fixed path
 */
function serviceWorkerHandler(app: any) {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    let filePath = path.join(rootDir, '.next', 'service-worker.js');
    app.serveStatic(req, res, filePath);
  };
}
