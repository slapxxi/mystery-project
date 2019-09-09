import useToast from '@self/lib/hooks/useToast';
import signInWithPopup from '@self/lib/services/signInWithPopup';
import signOutService from '@self/lib/services/signOut';
import { AuthUser, Maybe } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import 'firebase/auth';
import { createContext, ReactNode } from 'react';
import { assign, Machine, State as XState } from 'xstate';

export interface AuthProviderContext {
  state: XState<Context, Event>;
  send: (...params: any) => void;
}

interface Props {
  children: ReactNode;
  user: Maybe<AuthUser>;
}

interface Context {
  user: AuthUser;
  error: Error;
}

interface State {
  states: {
    init: {};
    anonymous: {};
    auth: {};
    signingIn: {};
    signingOut: {};
    error: {};
  };
}

type Event = { type: 'SIGN_IN' } | { type: 'SIGN_OUT' };

let context = createContext({} as AuthProviderContext);
let { Provider, Consumer } = context;

let providerMachine = Machine<Context, State, Event>({
  id: 'auth-provider',
  initial: 'init',
  context: {
    user: null,
    error: null,
  },
  states: {
    init: {
      on: {
        '': [
          { target: 'auth', cond: (context) => !!context.user },
          { target: 'anonymous' },
        ],
      },
    },
    anonymous: { on: { SIGN_IN: 'signingIn' } },
    auth: { on: { SIGN_OUT: 'signingOut' } },
    signingIn: {
      invoke: {
        src: 'signIn',
        onDone: { target: 'auth', actions: assign({ user: (_, event) => event.data }) },
        onError: {
          target: 'error',
          actions: assign({ error: (_, event) => event.data }),
        },
      },
    },
    signingOut: {
      invoke: {
        src: 'signOut',
        onDone: { target: 'anonymous', actions: assign({ user: () => null }) },
        onError: {
          target: 'error',
          actions: assign({ error: (_, event) => event.data }),
        },
      },
    },
    error: { entry: ['notify'] },
  },
});

function AuthProvider(props: Props) {
  let { user, children } = props;
  let [state, send] = useMachine(providerMachine, {
    context: { user },
    services: { signIn, signOut },
    actions: { notify: (context) => toast({ message: context.error.message }) },
  });
  let toast = useToast();

  return <Provider value={{ state, send }}>{children}</Provider>;
}

async function signIn() {
  let result = await signInWithPopup();
  return result;
}

async function signOut() {
  let result = await signOutService();
  return result;
}

export { context as authContext, Consumer as AuthConsumer, Provider as AuthProvider };
export default AuthProvider;
