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
            author: user,
            name: doc.data().name,
            description: doc.data().description,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        );
      })
    );
    subscriptions;
  } catch (e) {
    console.log(e);
  }

  return subscriptions;
}

export default fetchSubscriptions;
