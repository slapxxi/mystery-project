import { authContext } from '@self/components/AuthStore';
import { useContext } from 'react';

function useAuth() {
  let state = useContext(authContext);

  return [state];
}

export default useAuth;
