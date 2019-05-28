const NextI18Next = require('next-i18next/dist/commonjs');

module.exports = new NextI18Next({
  otherLanguages: ['ru'],
  localeSubpaths: 'foreign',
});
