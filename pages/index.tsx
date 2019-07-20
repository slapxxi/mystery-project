/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Image from '@self/components/Image';
import { withTranslation } from '@self/i18n';
import { PageProps } from '@self/lib/types';

const URL = '/static/img/camping.jpg';

interface Props extends PageProps {}

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

export { IndexPage };
export default withTranslation('common')(IndexPage);
