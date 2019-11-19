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
    hist: {};
    signingIn: {};
    signingOut: {};
    error: {};
  };
}

type Event = { type: 'SIGN_IN' } | { type: 'SIGN_OUT' } | { type: 'RETRY' };

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
          actions: 'setError',
        },
      },
    },
    signingOut: {
      invoke: {
        src: 'signOut',
        onDone: { target: 'anonymous', actions: assign({ user: () => null }) },
        onError: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    hist: {
      type: 'history',
    },
    error: {
      entry: ['notify'],
      on: {
        RETRY: 'signingIn',
      },
    },
  },
});

function AuthProvider(props: Props) {
  let { user, children } = props;
  let [state, send] = useMachine(providerMachine, {
    context: { user },
    services: {
      signIn: () => {
        return signInWithPopup();
      },
      signOut: () => {
        return signOutService();
      },
    },
    actions: {
      notify: (context) => toast({ message: context.error.message }),
      setError: assign<Context>({ error: (context, event) => event.data }),
    },
  });
  let toast = useToast();

  return <Provider value={{ state, send }}>{children}</Provider>;
}

async function signIn(context: any, event: any) {
  let result = await signInWithPopup();
  return result;
}

async function signOut() {
  let result = await signOutService();
  return result;
}

export { context as authContext, Consumer as AuthConsumer, Provider as AuthProvider };
export default AuthProvider;
