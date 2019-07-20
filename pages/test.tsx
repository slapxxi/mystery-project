import Link from 'next/link';
import { useEffect, useState } from 'react';

function TestingPage() {
  let [state, setState] = useState<number[]>([]);

  useEffect(() => {
    setup([1, 2, 3, 4]).then((value) => {
      setState(value);
    });
    setState([1, 2, 3]);
  }, []);

  return (
    <div>
      {state.length > 0
        ? state.map((item) => (
            <li>
              <Link href="/test/[something]" as={`/test/${item}`}>
                <a>{item}</a>
              </Link>
            </li>
          ))
        : 'nothing'}{' '}
    </div>
  );
}

async function setup<T>(value: T[]) {
  return value;
}

export default TestingPage;
