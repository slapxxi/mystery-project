import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthUser, ID, Subscription } from '../types';
import parsePostData from './parsePostData';

async function fetchSubscriptions(user: AuthUser) {
  let subscriptions: Promise<Subscription>[] = [];

  try {
    let db = firebase.firestore();
    let userData = await db
      .collection('users')
      .doc(user.uid)
      .get();
    let userSubscriptions: ID[] = userData.get('subscriptions');

    await Promise.all(
      userSubscriptions.map(async (id) => {
        let match = await db
          .collection('posts')
          .where('author', '==', id)
          .get();

        subscriptions = subscriptions.concat(
          match.docs.map(async (doc) => await parsePostData(doc.id, doc.data()))
        );
      })
    );
  } catch (e) {
    throw e;
  }

  return Promise.all(subscriptions);
}

function toDate(seconds: number) {
  let date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date;
}

export default fetchSubscriptions;
