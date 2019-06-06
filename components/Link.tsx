import { Link as LocaleLink } from '@self/i18n';
import { LinkProps } from 'next/link';

interface Props extends LinkProps {}

function Link(props: Props) {
  return <LocaleLink {...props} />;
}
export default Link;
