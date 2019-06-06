/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withNamespaces } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import { Page } from '@self/lib/types';

interface Props extends Page.Props {}

function FeedPage(props: Props) {
  let [auth] = useAuth();
  let { t } = props;

  if (auth.user) {
    return (
      <div>
        <h1>{t('feed')}</h1>
        <p>User: {auth.user.uid}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{t('feed')}</h1>
    </div>
  );
}

FeedPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export default withNamespaces('common')(FeedPage);
