/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Image from '@self/components/Image';
import { withNamespaces } from '@self/i18n';
import { Page } from '@self/lib/types';

const URL = '/static/img/camping.jpg';

interface Props extends Page.Props {}

function IndexPage(props: Props) {
  let { t } = props;

  return (
    <div>
      <h1 data-testid="title">{t('index')}</h1>
      <Image
        css={css`
          width: 100%;
        `}
        src={URL}
      />
    </div>
  );
}

IndexPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export default withNamespaces('common')(IndexPage);
