/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTranslation } from '@self/i18n';
import useTheme from '@self/lib/hooks/useTheme';
import { PagePropsWithTranslation } from '@self/lib/types';

interface Props extends PagePropsWithTranslation<'common'> {}

function SettingsPage(props: Props) {
  let { t, i18n } = props;
  let [currentTheme, changeTheme] = useTheme();

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    if (i18n) {
      if (event.target.value === 'ru') {
        i18n.changeLanguage('ru');
      } else {
        i18n.changeLanguage('en');
      }
    }
  }

  function handleSelectTheme(event: React.ChangeEvent<HTMLSelectElement>) {
    changeTheme(event.target.value);
  }

  return (
    <div>
      <h1>{t('settings')}</h1>
      {t('language')}:{' '}
      <select name="lang" id="lang" onChange={handleSelect} value={i18n.language}>
        <option value="en">{t('language-en')}</option>
        <option value="ru">{t('language-ru')}</option>
      </select>
      {t('theme')}:{' '}
      <select
        name="theme"
        id="theme"
        onChange={handleSelectTheme}
        value={currentTheme.type}
      >
        <option value="light">{t('light theme')}</option>
        <option value="dark">{t('dark theme')}</option>
      </select>
    </div>
  );
}

SettingsPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export default withTranslation('common')(SettingsPage);
