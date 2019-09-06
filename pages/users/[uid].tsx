import { withTranslation } from '@self/i18n';
import fetchUser from '@self/lib/services/fetchUser';
import { AuthUser, PageContext } from '@self/lib/types';

interface Props {
  user: AuthUser;
}

function UserPage(props: Props) {
  let { user } = props;

  return (
    <div>
      <h1>@{user.handle}</h1>
    </div>
  );
}

UserPage.getInitialProps = async (context: PageContext) => {
  let { uid } = context.query;
  let user = await fetchUser(uid as string);
  return { requiredNamespaces: ['common'], user };
};

// @ts-ignore
export default withTranslation('common')(UserPage);
