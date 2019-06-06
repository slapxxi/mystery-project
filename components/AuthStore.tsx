import auth from '@self/lib/services/auth';
import firebaseConfig from '@self/lib/services/firebaseConfig';
import { Auth, Maybe } from '@self/lib/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import { createContext, ReactNode, useEffect, useReducer } from 'react';

let context = createContext({} as Auth.State);
let { Provider, Consumer } = context;

interface Props {
  children: ReactNode;
  user: Maybe<Auth.User>;
}

function AuthStore(props: Props) {
  let { user, children } = props;
  let [state, dispatch] = useReducer(authReducer, { user });

  useEffect(() => {
    if (user) {
      return;
    }

    let app: firebase.app.App;

    try {
      app = firebase.initializeApp(firebaseConfig);
    } catch (error) {
      app = firebase.app();
    }

    let unsub = app.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let signedUser = await auth(user);
        dispatch({ type: 'SIGN_IN', payload: signedUser });
      }
    });

    return () => unsub();
  }, []);

  return <Provider value={{ ...state }}>{children}</Provider>;
}

function authReducer(state: Auth.State, action: Auth.Action) {
  switch (action.type) {
    case 'SIGN_IN':
      return { user: action.payload };
    case 'SIGN_OUT':
      return { user: null };
    default:
      return state;
  }
}

export { context as authContext, Consumer as AuthConsumer, Provider as AuthProvider };
export default AuthStore;
