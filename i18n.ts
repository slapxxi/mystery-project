import NextI18Next from 'next-i18next';

let nexti18Next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['ru'],
  ignoreRoutes: ['/api', '/_next', '/static', '/sw.js'],
});

export const { Link, withTranslation, appWithTranslation, Router, i18n } = nexti18Next;
export default nexti18Next;
