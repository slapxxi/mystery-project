import NextI18Next from 'next-i18next';

let nexti18Next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['ru'],
  ignoreRoutes: ['/api', '/_next', '/static'],
  localeSubpaths: 'foreign',
});

let { Link, withNamespaces, appWithTranslation, Router, i18n } = nexti18Next;

export { Link, withNamespaces, appWithTranslation, Router, i18n };
export default nexti18Next;
