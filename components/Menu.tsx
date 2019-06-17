/** @jsx jsx */
import { Global, jsx } from '@emotion/core';
import { PageProps } from '@self/lib/types';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import BurgerIcon from './icons/BurgerIcon';
import CloseIcon from './icons/CloseIcon';
import Link from './Link';
import styles from './Menu.styles';

interface Props extends PageProps {}

function Menu(props: Props) {
  let { t } = props;
  let [open, setOpen] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => Router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  function handleRouteChange() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen((o) => !o);
  }

  return (
    <div css={styles.container}>
      {open && <Global styles={styles.global} />}
      <button css={styles.button} onClick={handleOpen}>
        <BurgerIcon css={styles.icon} />
      </button>
      <Navigation onClose={handleOpen} t={t} open={open} />
    </div>
  );
}

function Navigation(props) {
  let { open, onClose, t } = props;

  if (!process.browser) {
    return null;
  }

  let targetElement = document.getElementById('root');

  if (!targetElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <nav css={styles.nav} className={open ? 'active' : ''}>
      <header css={styles.navHeader}>
        <button css={styles.menuButton} onClick={onClose}>
          <CloseIcon css={styles.icon} />
        </button>
      </header>

      <ul css={styles.list}>
        <li>
          <Link href="/">
            <a>{t('index')}</a>
          </Link>
        </li>
        <li>
          <Link href="/settings" prefetch>
            <a>{t('settings')}</a>
          </Link>
        </li>
      </ul>
    </nav>,
    targetElement
  );
}

export default Menu;
