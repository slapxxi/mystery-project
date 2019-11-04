import { AuthUser, Post } from '@self/lib/types';
import { ChangeEvent, FormEvent } from 'react';
import { EventObject, Machine } from 'xstate';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

interface Context {
  value: string;
  post: Post;
  user: AuthUser;
  error: Error;
}

interface Schema {
  states: {
    idle: {};
    sending: {};
    error: {};
  };
}

type MachineEvent =
  | { type: 'POST'; payload: string }
  | { type: 'RETRY' }
  | { type: 'CHANGE'; payload: string };

let formMachine = Machine<Context, Schema, MachineEvent>({
  initial: 'idle',
  context: { value: null, post: null, user: null, error: null },
  states: {
    idle: {
      on: {
        POST: 'sending',
        CHANGE: { actions: 'setValue' },
      },
    },
    sending: {
      invoke: {
        src: 'upload',
        onDone: { target: 'idle', actions: ['setPost', 'resetValue'] },
        onError: { target: 'error', actions: 'setError' },
      },
    },
    error: {
      on: {
        RETRY: 'sending',
        CHANGE: { actions: 'setValue' },
      },
    },
  },
});

function CommentForm(props: Props) {
  let { value, onChange, onSubmit } = props;

  function handlePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <form action="" onSubmit={handlePost}>
      <textarea
        name=""
        id=""
        cols={30}
        rows={10}
        onChange={handleChange}
        value={value}
      ></textarea>
      <button type="submit">Post</button>
    </form>
  );
}

function assignPayload(_: never, event: EventObject) {
  return event.payload;
}

function assignData(_: never, event: EventObject) {
  return event.data;
}

function uploadComment(post: Post, user: AuthUser, comment: string) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      rej(new Error('it does not work'));
    }, 2000);
  });
}

export default CommentForm;
