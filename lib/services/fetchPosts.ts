import firebase from 'firebase/app';
import 'firebase/firestore';
import { Post } from '../types';

async function fetchPosts() {
  let posts: Post[] = [];

  try {
    let db = firebase.firestore();
    let postsCollection = db.collection('posts');
    let docs = await postsCollection.get();

    docs.forEach((d) => {
      let data = d.data();
      let { id } = d;
      let { title, description, author, assets } = data;

      posts.push({
        id,
        title,
        description,
        author,
        assets,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  } catch (e) {
    console.log(e);
  }

  return posts;
}

export default fetchPosts;
