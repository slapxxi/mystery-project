import firebase from 'firebase/app';
import 'firebase/firestore';
import { Post } from '../types';
import parsePostData from './parsePostData';

// fix: posts with comments do not appear in popular category
async function fetchPosts(): Promise<Post[]> {
  try {
    let db = firebase.firestore();
    let postsCollection = db.collection('posts').orderBy('likes', 'desc');
    let snapshot = await postsCollection.get();
    let docs = snapshot.docs.map(async (doc) => {
      return parsePostData(doc.id, doc.data());
    });
    return Promise.all(docs);
  } catch (e) {
    throw e;
  }
}

export default fetchPosts;
