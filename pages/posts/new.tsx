/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import useForm from '@self/lib/hooks/useForm';
import useToast from '@self/lib/hooks/useToast';
import isClient from '@self/lib/isClient';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import routes from '@self/lib/routes';
import createPost from '@self/lib/services/createPost';
import { PageContext, PagePropsWithTranslation } from '@self/lib/types';
import userAuthenticated from '@self/lib/universal/userAuthenticated';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { imageStyles } from './new.styles';

interface Props extends PagePropsWithTranslation<'common'> {}

let worker: Worker;

if (isClient()) {
  worker = new Worker('@self/uploader.worker', { type: 'module' });
}

// todo: save form data between visits of the page so the user could
// continue working
function NewPostPage(props: Props) {
  let { t } = props;
  let [processing, setProcessing] = useState(false);
  let [authState] = useAuth();
  let toast = useToast();
  // todo: finish useForm hook
  let [formState, formActions] = useForm();
  let [imagePreview, setImagePreview] = useState('');
  let router = useRouter();

  useEffect(() => {
    if (worker) {
      worker.addEventListener('message', (message) => {
        let { data } = message;

        if (data.type === 'processing') {
          setProcessing(true);
        }

        if (data.type === 'result') {
          let result = data.payload;

          setProcessing(false);
          setImagePreview(result);
        }
      });
    }
  }, []);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    let { files } = event.target;

    if (worker && files.length > 0) {
      formActions.setField('assets', files);
      worker.postMessage({ type: 'process', payload: files[0] });
    }
  }

  function handleCreatePost() {
    createPost(authState.user, {
      title: formState.values.title,
      description: formState.values.description,
      assets: formState.values.assets,
    })
      .then((postID) => {
        router.push(routes.post(postID).url, routes.post(postID).as);
      })
      .catch((e: Error) => {
        toast({ message: e.message });
      });
  }

  function handleChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    formActions.setField('title', value);
  }

  function handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    formActions.setField('description', value);
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
          value={formState.values.title}
          onChange={handleChangeTitle}
        />
      </div>
      <div>
        <label htmlFor="description">{t('description')}</label>
        <input
          id="description"
          type="text"
          name="description"
          value={formState.values.description}
          onChange={handleChangeDescription}
        />
      </div>
      {processing ? (
        <div>Processing files...</div>
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
          <img src={imagePreview} alt="Image Preview" css={imageStyles} />
        </div>
      )}
      <button>{t('preview')}</button>
      <button onClick={handleCreatePost} disabled={processing}>
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

export default withTranslation('common')(NewPostPage);
