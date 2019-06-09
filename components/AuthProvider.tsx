import useToast from '@self/lib/hooks/useToast';
import signInWithPopup from '@self/lib/services/signInWithPopup';
import signOut from '@self/lib/services/signOut';
import { Auth, AuthAction, AuthState, AuthUser, Maybe } from '@self/lib/types';
import 'firebase/auth';
import { createContext, ReactNode, useEffect, useReducer } from 'react';

let context = createContext({} as Auth.Context);
let { Provider, Consumer } = context;

interface Props {
  children: ReactNode;
  user: Maybe<AuthUser>;
}

function AuthProvider(props: Props) {
  let { user, children } = props;
  let toast = useToast();
  let [state, dispatch] = useReducer(authReducer, {
    user,
    status: user ? 'active' : 'anonymous',
  });

  useEffect(() => {
    if (state.status === 'pending') {
      signInWithPopup()
        .then((result) => {
          if (result) {
            dispatch({ type: 'SIGN_IN', payload: result });
          }
        })
        .catch((error) => {
          toast({ message: error.message });
          dispatch({ type: 'ERROR' });
        });
      return;
    }

    if (state.status === 'signout') {
      signOut().then(() => {
        dispatch({ type: 'SIGN_OUT' });
      });
      return;
    }
  }, [state.status]);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'REQUEST_SIGN_IN':
      return { ...state, status: 'pending' };
    case 'REQUEST_SIGN_OUT':
      return { ...state, status: 'signout' };
    case 'SIGN_IN':
      return { user: action.payload, status: 'active' };
    case 'SIGN_OUT':
      return { ...state, status: 'anonymous', user: null };
    case 'ERROR':
      return { ...state, status: 'anonymous', user: null };
    default:
      return state;
  }
}

export { context as authContext, Consumer as AuthConsumer, Provider as AuthProvider };
export default AuthProvider;
