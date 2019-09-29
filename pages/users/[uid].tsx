import { withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import fetchUser from '@self/lib/services/fetchUser';
import { AuthUser, PageContext } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';

interface Props {
  user: AuthUser;
}

let pageMachine = Machine({
  id: 'userpage',
  initial: 'idle',
  context: {
    user: null,
  },
  states: {
    idle: {
      on: {
        '': [{ target: 'auth', cond: 'isAuthenticated' }, { target: 'anonymous' }],
      },
    },
    auth: {
      on: {
        SIGN_OUT: { target: 'anonymous', actions: ['signOut'] },
      },
    },
    anonymous: {},
  },
});

function UserPage(props: Props) {
  let { user } = props;
  let [authState, authActions] = useAuth();
  let [pageState, send] = useMachine(pageMachine, {
    context: { user },
    guards: {
      isAuthenticated: (context) =>
        authState.matches('auth') && context.user.uid === authState.context.user.uid,
    },
    actions: { signOut: () => authActions.signOut() },
  });

  if (pageState.matches('auth')) {
    return (
      <div>
        <h1>@{user.handle}</h1>
        <button>Edit</button>
        <button onClick={() => send('SIGN_OUT')}>Sign Out</button>
      </div>
    );
  }

  if (pageState.matches('anonymous')) {
    return (
      <div>
        <h1>@{user.handle}</h1>
      </div>
    );
  }
}

UserPage.getInitialProps = async (context: PageContext) => {
  let { uid } = context.query;
  let user = await fetchUser(uid as string);
  return { requiredNamespaces: ['common'], user };
};

// @ts-ignore
export default withTranslation('common')(UserPage);
