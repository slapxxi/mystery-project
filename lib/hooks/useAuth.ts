import { authContext } from '@self/components/AuthProvider';
import { useContext } from 'react';
import { AuthState, AuthUser } from '../types';

interface ActionCreators {
  requestSignIn: () => void;
  requestSignOut: () => void;
  signOut: () => void;
  signIn: (user: AuthUser) => void;
}

function useAuth(): [AuthState, ActionCreators] {
  let { state, dispatch } = useContext(authContext);

  let actions: ActionCreators = {
    requestSignIn: () => {
      dispatch({ type: 'REQUEST_SIGN_IN' });
    },
    requestSignOut: () => {
      dispatch({ type: 'REQUEST_SIGN_OUT' });
    },
    signIn: (user) => {
      dispatch({ type: 'SIGN_IN', payload: user });
    },
    signOut: () => {
      dispatch({ type: 'SIGN_OUT' });
    },
  };

  return [state, actions];
}

export default useAuth;
