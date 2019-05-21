const path = require('path');
const dotenv = require('dotenv');
const pipe = require('pipeline.macro');

const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const withTranspileModules = require('next-transpile-modules');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withOffline = require('next-offline');

let activeEnv = process.env.NODE_ENV;

dotenv.config();

const baseConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),

  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },

  env: {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    },
  },

  cssModules: true,

  cssLoaderOptions: {
    modules: true,
    camelCase: true,
    namedExport: true,
    importLoaders: 1,
    localIdentName: '[local]__[hash:base64:5]',
  },

  transpileModules: ['lodash-es'],

  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /.png$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /.jpg$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },

  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@self': path.resolve(__dirname),
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(
  withTypescript(withCSS(withTranspileModules(withOffline(baseConfig))))
);
