import NextI18Next from 'next-i18next';

let nexti18Next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['ru'],
  ignoreRoutes: ['/api', '/_next', '/static', '/sw.js'],
  localeSubpaths: 'foreign',
});

let { Link, withTranslation, appWithTranslation, Router, i18n } = nexti18Next;

export { Link, withTranslation, appWithTranslation, Router, i18n };
export default nexti18Next;
