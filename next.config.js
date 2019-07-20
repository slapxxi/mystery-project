const path = require('path');
const dotenv = require('dotenv');

const withCSS = require('@zeit/next-css');
const withTranspileModules = require('next-transpile-modules');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

const ServiceWorkerPlugin = require('serviceworker-webpack-plugin');

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
    HOST: process.env.HOST,
  },

  publicRuntimeConfig: {
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

  webpack(config, options) {
    let { isServer } = options;

    config.resolve.alias = {
      ...config.resolve.alias,
      '@self': path.resolve(__dirname),
    };

    // todo: write your own fucking plugin to generate a service fucking worker
    // because i'm fucking tired of going nowhere trying to find a way to make polyfills
    // worker-compatible

    if (!isServer) {
      config.plugins.push(
        new ServiceWorkerPlugin({
          entry: path.join(__dirname, 'service-worker.ts'),
          filename: 'service-worker.js',
        })
      );
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(withCSS(withTranspileModules(baseConfig)));
