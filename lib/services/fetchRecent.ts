import firebase from 'firebase/app';
import 'firebase/firestore';
import { Post } from '../types';
import parsePostData from './parsePostData';

async function fetchRecent(): Promise<Post[]> {
  try {
    let db = firebase.firestore();
    let postsCollection = db
      .collection('posts')
      .limit(3)
      .orderBy('createdAt', 'desc');
    let snapshot = await postsCollection.get();
    let docs = snapshot.docs.map((doc) => {
      return parsePostData(doc.id, doc.data());
    });
    return Promise.all(docs);
  } catch (e) {
    throw e;
  }
}

export default fetchRecent;
