/** @jsx jsx */
import { jsx } from '@emotion/core';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Link from './Link';
import styles from './Menu.styles';

interface Props extends I18nProps {}

function Menu(props: Props) {
  let { t } = props;
  let [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('mounting');
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => Router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  useEffect(() => {
    let root = document.getElementById('root');

    if (root) {
      if (open) {
        root.style.overflow = 'hidden';
      } else {
        root.style.overflow = '';
      }
    }
  }, [open]);

  function handleRouteChange() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen((o) => !o);
  }

  return (
    <div>
      <button css={styles.button} onClick={handleOpen}>
        {t('menu')}
      </button>
      {open && <Navigation onClose={handleOpen} t={t} />}
    </div>
  );
}

function Navigation(props) {
  let { t, onClose } = props;

  if (!process.browser) {
    return null;
  }

  let targetElement = document.getElementById('root');

  if (!targetElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <nav css={styles.nav}>
      <button css={styles.button} onClick={onClose}>
        {t('close')}
      </button>

      <ul css={styles.list}>
        <li>
          <Link href="/">
            <a>{t('index')}</a>
          </Link>
        </li>
        <li>
          <Link href="/posts">
            <a>{t('posts')}</a>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <a>{t('settings')}</a>
          </Link>
        </li>
      </ul>
    </nav>,
    targetElement
  );
}

export default Menu;
