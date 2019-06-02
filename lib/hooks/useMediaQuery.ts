import { useEffect, useState } from 'react';

function useMediaQuery(mediaQuery: string) {
  let [matches, setMatches] = useState(false);

  useEffect(() => {
    let mq = window.matchMedia(mediaQuery);
    setMatches(mq.matches);
    mq.addListener(handler);

    return () => mq.removeListener(handler);
  }, [mediaQuery]);

  function handler(mq: MediaQueryListEvent) {
    setMatches(mq.matches);
  }

  return matches;
}

export default useMediaQuery;
