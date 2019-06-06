/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withNamespaces } from '@self/i18n';
import { Page } from '@self/lib/types';

interface Props extends Page.Props {}

function SettingsPage(props: Props) {
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
