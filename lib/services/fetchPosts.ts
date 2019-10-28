import firebase from 'firebase/app';
import 'firebase/firestore';
import { Post } from '../types';
import parsePostData from './parsePostData';

async function fetchPosts() {
  let posts: Post[] = [];

  try {
    let db = firebase.firestore();
    let postsCollection = db.collection('posts').orderBy('likes', 'desc');
    let docs = await postsCollection.get();

    docs.forEach((d) => {
      let data = d.data();
      let { id } = d;
      posts.push(parsePostData(id, data));
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

export default fetchPosts;
