import { StoreContext, StoreState } from '@self/components/StoreProvider';
import { Post, PostCategory } from '@self/lib/types';
import { useContext } from 'react';

interface StoreActions {
  like: (post: Post) => void;
  unlike: (post: Post) => void;
  changeCategory: (category: PostCategory) => void;
}

function useStore(): [StoreState, StoreActions] {
  let { state, send } = useContext(StoreContext);

  let actions = {
    like(post: Post) {
      send({ type: 'LIKE', payload: post });
    },
    unlike(post: Post) {
      send({ type: 'UNLIKE', payload: post });
    },
    changeCategory(category: PostCategory) {
      send({ type: 'CHANGE_CATEGORY', payload: category });
    },
  };

  return [state, actions];
}

export default useStore;
