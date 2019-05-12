let babelConfiguration = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
};

module.exports = require('babel-jest').createTransformer(babelConfiguration);
