import { LinkProps } from 'next/dist/client/link';
import { useRouter } from 'next/router';
import { Children, cloneElement, isValidElement } from 'react';
import Link from './Link';

interface Props extends LinkProps {
  children?: React.ReactNode;
  activeClassName?: string;
}

function ActiveLink(props: Props) {
  let { children, activeClassName = 'active', ...rest } = props;
  let child = Children.only(children);
  let router = useRouter();

  if (router.pathname === props.href && isValidElement(child)) {
    return <Link {...rest}>{cloneElement(child, { className: activeClassName })}</Link>;
  }

  return <Link {...rest}>{children}</Link>;
}

export default ActiveLink;
