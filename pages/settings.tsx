/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTranslation } from '@self/i18n';
import { PageProps } from '@self/lib/types';

interface Props extends PageProps {}

function SettingsPage(props: Props) {
  let { t, i18n } = props;

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    if (i18n) {
      if (event.target.value === 'ru') {
        i18n.changeLanguage('ru');
      } else {
        i18n.changeLanguage('en');
      }
    }
  }

  return (
    <div>
      <h1>{t('settings')}</h1>
      {t('language')}:{' '}
      <select name="lang" id="lang" onInput={handleSelect} defaultValue={i18n.language}>
        <option value="en">{t('language-en')}</option>
        <option value="ru">{t('language-ru')}</option>
      </select>
    </div>
  );
}

SettingsPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export default withTranslation('common')(SettingsPage);
