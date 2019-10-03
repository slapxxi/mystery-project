import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthUser, ID, Subscription } from '../types';

async function fetchSubscriptions(user: AuthUser) {
  let subscriptions: Subscription[] = [];

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
          match.docs.map((doc) => ({
            id: doc.id,
            author: doc.data().author,
            title: doc.data().title,
            description: doc.data().description,
            assets: doc.data().assets,
            createdAt: doc.data().createdAt,
            updatedAt: new Date(),
          }))
        );
      })
    );
  } catch (e) {
    throw e;
  }

  return subscriptions;
}

export default fetchSubscriptions;
