import { authContext, AuthProviderContext } from '@self/components/AuthProvider';
import { useContext } from 'react';
import { AuthUser } from '../types';

interface ActionCreators {
  signOut: () => void;
  signIn: (user?: AuthUser) => void;
}

function useAuth(): [AuthProviderContext['state'], ActionCreators] {
  let { state, send } = useContext(authContext);

  let actions: ActionCreators = {
    signIn: (user) => {
      send({ type: 'SIGN_IN', payload: user });
    },
    signOut: () => {
      send({ type: 'SIGN_OUT' });
    },
  };

  return [state, actions];
}

export default useAuth;
