import { PageContext } from '@self/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/router';

function TestPidPage() {
  let router = useRouter();

  return (
    <div>
      <div>
        <Link href="/test">
          <a>Back</a>
        </Link>
      </div>
      Testing a dynamic route {router.query.pid}
    </div>
  );
}

TestPidPage.getInitialProps = async (context: PageContext) => {
  let { query } = context;

  if (query) {
    console.log(query.pid);
  }

  return {};
};

export default TestPidPage;
