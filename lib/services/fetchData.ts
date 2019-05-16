import firebaseConfig from '@self/lib/services/firebaseConfig';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

try {
  firebase.initializeApp(firebaseConfig);
} catch {}

async function fetchData() {
  let database = firebase.firestore();

  try {
    let query = await database.collection('users').get();
    query.forEach((doc) => console.log(doc.data()));
  } catch (e) {
    console.log('Error occurred');
    throw e;
  }
}

export default fetchData;
