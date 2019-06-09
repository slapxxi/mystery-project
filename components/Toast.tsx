/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import uuid from 'uuid';
import Button from './Button';
import CloseIcon from './icons/CloseIcon';

interface ToastConfig {
  message: string;
  content?: string;
  timeout?: number;
  delay?: number;
}

interface ToastInternal extends ToastConfig {
  id: string;
}

interface Context {
  dispatch: (config: ToastConfig) => void;
}

interface Props {
  children: ReactNode;
}

let toastContext = createContext({} as Context);
let { Provider } = toastContext;

function ToastProvider(props: Props) {
  let timers = useRef([]);
  let { children } = props;
  let [toasts, setToasts] = useState<ToastInternal[]>([]);

  let dispatcher = useCallback((toast: ToastConfig) => {
    let id = uuid.v4();
    let identifiedToast = { ...toast, id };

    if (toast.delay) {
      let handle = setTimeout(() => {
        setToasts((toasts) => [...toasts, identifiedToast]);
      }, toast.delay);
      timers.current.push(handle);
    } else {
      setToasts((toasts) => [...toasts, identifiedToast]);
    }
  }, []);

  useEffect(() => {
    timers.current.forEach((timer) => {
      clearTimeout(timer);
    });
  }, []);

  function handleDismiss(toast: ToastInternal) {
    setToasts((toasts) => toasts.filter((t) => t.id !== toast.id));
  }

  return (
    <Provider value={{ dispatch: dispatcher }}>
      <ToastsContainer toasts={toasts} onDismiss={handleDismiss} />
      {children}
    </Provider>
  );
}

function ToastsContainer(props: {
  toasts: ToastInternal[];
  onDismiss: (toast: ToastInternal) => void;
}) {
  let { toasts, onDismiss } = props;
  let limit = 10;

  return (
    <ul
      css={css`
        position: fixed;
        list-style: none;
        margin: -0.5rem;
        padding: 0;
        top: 0;
        right: -300px;
        z-index: 9999;
        transition: all 0.3s;
      `}
    >
      {toasts.slice(0, limit).map((item) => (
        <ToastItem toast={item} onDismiss={onDismiss} key={item.id} />
      ))}
    </ul>
  );
}

function ToastItem(props: {
  toast: ToastInternal;
  onDismiss: (toast: ToastInternal) => void;
}) {
  let { toast, onDismiss } = props;
  let [active, setActive] = useState(false);

  useEffect(() => {
    let handle = requestAnimationFrame(() => {
      setActive(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  function handleDismiss() {
    setActive(false);
    setTimeout(() => {
      onDismiss(toast);
    }, 200);
  }

  return (
    <li
      data-active={active}
      css={css`
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        width: 300px;
        align-items: center;
        padding: 1rem;
        margin: 0.5rem;
        background: white;
        transform: translateX(0);
        border-radius: 5px;
        transition: all 0.2s;
        color: black;

        &[data-active='true'] {
          transform: translateX(-100%);
          box-shadow: -1px 1px 5px 3px rgba(0, 0, 0, 0.2);
          opacity: 1;
        }
      `}
    >
      {toast.message}
      <Button onClick={handleDismiss}>
        <CloseIcon
          css={css`
            width: 10px;
            fill: black;
          `}
        />
      </Button>
    </li>
  );
}

export { toastContext, ToastConfig };

export default ToastProvider;
