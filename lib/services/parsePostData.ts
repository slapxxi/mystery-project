import { DocumentData } from '@google-cloud/firestore';
import { ID, Post } from '../types';

function parsePostData(id: ID, data: DocumentData): Post {
  let { title, description, assets, likes, author, createdAt, updatedAt } = data;

  return {
    id,
    title,
    description,
    assets,
    likes,
    author,
    createdAt: new Date(createdAt.seconds),
    updatedAt: updatedAt && new Date(updatedAt.seconds),
  };
}

export default parsePostData;
