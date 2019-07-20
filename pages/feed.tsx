/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import useToast from '@self/lib/hooks/useToast';
import { PageProps } from '@self/lib/types';
import { useState } from 'react';

interface Props extends PageProps {}

function FeedPage(props: Props) {
  let [count, setCount] = useState(0);
  let [auth] = useAuth();
  let toast = useToast();
  let { t } = props;

  function handleToast() {
    toast({ message: `${count}`, delay: count * 100, timeout: 2000 });
    setCount((count) => count + 1);
  }

  if (auth.user) {
    return (
      <div>
        <h1>{t('feed')}</h1>
        <p>User: {auth.user.uid}</p>
        <button onClick={handleToast}>Test</button>
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

export default withTranslation('common')(FeedPage);
