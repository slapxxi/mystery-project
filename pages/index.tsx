/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTranslation } from '@self/i18n';
import { PagePropsWithTranslation } from '@self/lib/types';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {}

function IndexPage(props: Props) {
  let { t } = props;

  return (
    <div>
      <h1 data-testid="title">{t('index')}</h1>
    </div>
  );
}

IndexPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export { IndexPage };
export default withTranslation('common')(IndexPage);
