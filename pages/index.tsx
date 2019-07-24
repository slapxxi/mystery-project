/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Image from '@self/components/Image';
import { withTranslation } from '@self/i18n';
import routes from '@self/lib/routes';
import { PagePropsWithTranslation } from '@self/lib/types';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {}

function IndexPage(props: Props) {
  let { t } = props;

  return (
    <div>
      <h1 data-testid="title">{t('index')}</h1>
      <h2>Following</h2>
      <Image
        css={css`
          width: 100%;
        `}
        src={routes.img('camping.jpg').url}
      />
      <h2>Popular</h2>
    </div>
  );
}

IndexPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export { IndexPage };
export default withTranslation('common')(IndexPage);
