import { DynamicRoute, ID, Route, UID } from '@self/lib/types';

const routes = {
  user: ((uid: UID) => ({
    url: `/users/[uid]`,
    as: `/users/${uid}`,
  })) as DynamicRoute,

  posts: {
    new: { url: '/posts/new' },
  },
  post: ((id: ID) => ({
    url: `/posts/[pid]`,
    as: `/posts/${id}`,
  })) as DynamicRoute,

  // main routes
  index: { url: '/' } as Route,
  feed: { url: '/feed' } as Route,
  settings: { url: '/settings' } as Route,
  login: { url: '/login' } as Route,
  // assets
  img: ((name: string) => ({ url: `/static/img/${name}` })) as DynamicRoute,
  // experimental routes
  test: { url: '/test' } as Route,
  testItem: { url: '/test/[pid]' } as Route,
  testPage: ((index: number) => ({ url: `/test/${index}` })) as DynamicRoute,
};

export default routes;
