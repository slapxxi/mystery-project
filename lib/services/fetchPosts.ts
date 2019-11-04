import firebase from 'firebase/app';
import 'firebase/firestore';
import { Post } from '../types';
import parsePostData from './parsePostData';

// fix: posts with comments do not appear in popular category
async function fetchPosts() {
  let posts: Post[] = [];

  try {
    let db = firebase.firestore();
    let postsCollection = db.collection('posts').orderBy('likes', 'desc');
    let docs = await postsCollection.get();

    docs.forEach(async (d) => {
      let data = d.data();
      let { id } = d;
      posts.push(await parsePostData(id, data));
    });
  } catch (e) {
    throw e;
  }

  return posts;
}

function toDate(seconds: number) {
  let date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date;
}

export default fetchPosts;
