import firebase from 'firebase/app';
import 'firebase/firestore';
import { Post } from '../types';

async function fetchRecent() {
  let posts: Post[] = [];

  try {
    let db = firebase.firestore();
    let postsCollection = db.collection('posts').orderBy('createdAt', 'desc');
    let docs = await postsCollection.get();

    docs.forEach((d) => {
      let data = d.data();
      let { id } = d;
      let { title, description, author, assets, createdAt, likes } = data;

      posts.push({
        id,
        title,
        description,
        author,
        assets,
        likes,
        createdAt: toDate(createdAt.seconds),
        updatedAt: new Date(),
      });
    });
  } catch (e) {
    console.log(e);
  }

  return posts;
}

function toDate(seconds: number) {
  let date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date;
}

export default fetchRecent;
