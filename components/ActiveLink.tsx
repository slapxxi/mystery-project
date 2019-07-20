import { WithRouterProps } from 'next-server/router';
import { LinkProps } from 'next/dist/client/link';
import { withRouter } from 'next/router';
import { Children, cloneElement, ReactElement } from 'react';
import Link from './Link';

interface Props extends LinkProps, WithRouterProps {
  activeClassName?: string;
  children: ReactElement;
}

function ActiveLink(props: Props) {
  let { children, router, activeClassName = 'active', ...rest } = props;
  let child = Children.only(children);

  if (router && router.pathname === props.href) {
    return <Link {...rest}>{cloneElement(child, { className: activeClassName })}</Link>;
  }

  return <Link {...rest}>{children}</Link>;
}

// @ts-ignore
export default withRouter(ActiveLink);
