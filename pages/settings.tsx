/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withNamespaces } from '@self/i18n';

function SettingsPage(props) {
  let { t } = props;

  return (
    <div>
      <h1>{t('settings')}</h1>
    </div>
  );
}

SettingsPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export default withNamespaces('common')(SettingsPage);
