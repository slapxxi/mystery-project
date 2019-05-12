const path = require('path');
const dotenv = require('dotenv');

const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const withTranspileModules = require('next-transpile-modules');

dotenv.config();

const baseConfig = {
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

  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@self': path.resolve(__dirname),
    };

    return config;
  },
};

module.exports = withTypescript(withCSS(withTranspileModules(baseConfig)));
