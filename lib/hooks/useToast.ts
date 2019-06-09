import { toastContext } from '@self/components/Toast';
import { useContext } from 'react';

function useToast() {
  let { dispatch } = useContext(toastContext);

  return dispatch;
}

export default useToast;
