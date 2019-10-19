/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Spinner from '@self/components/Spinner';
import { withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import useToast from '@self/lib/hooks/useToast';
import isClient from '@self/lib/isClient';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import routes from '@self/lib/routes';
import createPost from '@self/lib/services/createPost';
import { PageContext, PagePropsWithTranslation } from '@self/lib/types';
import userAuthenticated from '@self/lib/universal/userAuthenticated';
import { useMachine } from '@xstate/react';
import { useRouter } from 'next/router';
import { assign, Machine } from 'xstate';

interface Props extends PagePropsWithTranslation<'common'> {}

let worker: Worker;

if (isClient()) {
  worker = new Worker('@self/uploader.worker', { type: 'module' });
}

let createMachine = Machine({
  initial: 'idle',
  context: {
    title: '',
    description: '',
    files: null,
    preview: null,
    error: null,
    progress: 0,
  },
  states: {
    idle: { on: { UPLOAD: { target: 'processing', actions: 'setFiles' } } },
    processing: {
      invoke: {
        id: 'uploader',
        src: 'uploader',
      },
      on: {
        PROGRESS: { actions: 'setProgress', internal: false },
        FINISH: { target: 'uploaded', actions: 'setPreview' },
      },
    },
    uploaded: {
      on: {
        UPLOAD: { target: 'processing', actions: 'setFiles' },
        CREATE: 'create',
      },
    },
    create: {
      invoke: {
        src: 'uploadPost',
        onDone: 'success',
        onError: { target: 'error', actions: ['notify', 'setError'] },
      },
    },
    success: {},
    error: {},
    hist: { type: 'history' },
  },
  on: {
    UPDATE_TITLE: { target: 'hist', actions: 'setTitle' },
    UPDATE_DESCRIPTION: { target: 'hist', actions: 'setDescription' },
  },
});

// todo: upload post preview as well
// todo: save form data between visits of the page so the user could
// continue working
function NewPostPage(props: Props) {
  let { t } = props;
  let [authState] = useAuth();
  let toast = useToast();
  let router = useRouter();
  let [state, send] = useMachine(createMachine, {
    actions: {
      setFiles: assignFromEvent('files', 'payload'),
      setPreview: assignPayload('preview'),
      setTitle: assignPayload('title'),
      setDescription: assignPayload('description'),
      setProgress: assignFromEvent('progress', 'payload'),
      setError: assignFromEvent('error', 'data'),
      notify: (context) => toast({ message: context.error.message }),
    },
    services: {
      uploadPost: (context) =>
        createPost(authState.context.user, {
          title: context.title,
          description: context.description,
          assets: context.files,
        }),
      uploader: (context) => (sendInternal) => {
        function listener(event: MessageEvent) {
          sendInternal(event.data);
        }

        worker.addEventListener('message', listener);

        worker.postMessage({ type: 'process', payload: context.files.item(0) });

        return () => worker.removeEventListener('message', listener);
      },
    },
  });

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    let { files } = event.target;

    if (worker && files.length > 0) {
      send({ type: 'UPLOAD', payload: files });
    }
  }

  function handleCreatePost() {
    send('CREATE');
  }

  function handleChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    send({ type: 'UPDATE_TITLE', payload: value });
  }

  function handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    send({ type: 'UPDATE_DESCRIPTION', payload: value });
  }

  if (state.matches('success')) {
    return <div>Successfully created. Redirecting...</div>;
  }

  if (state.matches('create')) {
    return (
      <div>
        <Spinner></Spinner>
      </div>
    );
  }

  return (
    <div>
      <h1>{t('new post')}</h1>
      <div>
        <label htmlFor="title">{t('title')}</label>
        <input
          id="title"
          type="text"
          name="title"
          value={state.context.title}
          onChange={handleChangeTitle}
        />
      </div>
      <div>
        <label htmlFor="description">{t('description')}</label>
        <input
          id="description"
          type="text"
          name="description"
          value={state.context.description}
          onChange={handleChangeDescription}
        />
      </div>
      {state.matches('processing') ? (
        <div>
          <p>Progress: {state.context.progress * 100}%</p>
          <div>Processing files...</div>
        </div>
      ) : (
        <div>
          <label htmlFor="assets">{t('assets')}</label>
          <input
            id="assets"
            type="file"
            name="assets"
            accept="image/*, video/*"
            onChange={handleUpload}
            multiple
          />
        </div>
      )}
      {state.matches('uploaded') && (
        <div>
          <img src={state.context.preview} alt="Image Preview" css={imageStyles} />
        </div>
      )}
      <button>{t('preview')}</button>
      <button onClick={handleCreatePost} disabled={state.matches('processing')}>
        {t('create post')}
      </button>
    </div>
  );
}

NewPostPage.getInitialProps = async (context: PageContext) => {
  if (isServer(context) && !userAuthenticated(context)) {
    redirectTo(context, routes.login.url);
  }

  return { namespacesRequired: ['common'] };
};

interface ValidationResult {
  result: boolean;
  errors?: string[];
}

function validateTitle(value: string): ValidationResult {
  if (value.length === 0) {
    return { result: false, errors: ['Must not be empty'] };
  }

  return { result: true };
}

function assignData(fieldName: string) {
  return assign({ [fieldName]: (_: any, event: any): any => event.data });
}

function assignFromEvent(fieldName: string, eventFieldName: string) {
  return assign({ [fieldName]: (_: any, event: any): any => event[eventFieldName] });
}

function assignPayload(fieldName: string) {
  // @ts-ignore
  return assign({ [fieldName]: (_: any, event: any) => event.payload });
}

const imageStyles = css`
  width: 200px;
`;

export default withTranslation('common')(NewPostPage);
