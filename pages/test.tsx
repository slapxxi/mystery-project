import { Link } from '@self/i18n';
import routes from '@self/lib/routes';

function TestingPage(props: any) {
  return (
    <div>
      <h1>Testing Page</h1>
      <Link href={routes.testItem.url} as={routes.testPage(2).url}>
        <a>Dynamic Page</a>
      </Link>
    </div>
  );
}

export default TestingPage;
