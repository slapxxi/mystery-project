import { LinkProps } from 'next/link';
import { withRouter, WithRouterProps } from 'next/router';
import { Children, cloneElement } from 'react';
import Link from './Link';

interface Props extends LinkProps, WithRouterProps {
  activeClassName?: string;
}

function ActiveLink(props: Props) {
  let { children, router, activeClassName = 'active', ...rest } = props;
  let child = Children.only(children);

  if (router && router.pathname === props.href) {
    return <Link {...rest}>{cloneElement(child, { className: activeClassName })}</Link>;
  }

  return <Link {...rest}>{children}</Link>;
}
export default withRouter(ActiveLink);
