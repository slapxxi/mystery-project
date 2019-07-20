import { Link as LocaleLink } from '@self/i18n';
import { LinkProps } from 'next/dist/client/link';

interface Props extends LinkProps {
  children?: React.ReactElement;
}

function Link(props: Props) {
  return <LocaleLink {...props} />;
}
export default Link;
