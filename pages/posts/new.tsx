import { withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import isClient from '@self/lib/isClient';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import routes from '@self/lib/routes';
import createPost from '@self/lib/services/createPost';
import { PageContext, PagePropsWithTranslation } from '@self/lib/types';
import userAuthenticated from '@self/lib/universal/userAuthenticated';
import { useEffect, useState } from 'react';

interface Props extends PagePropsWithTranslation<'common'> {}

let worker: Worker;

if (isClient()) {
  worker = new Worker('@self/uploader.worker', { type: 'module' });
}

// todo: save form data between visits of the page so the user could
// continue working
function NewPostPage(props: Props) {
  let { t } = props;
  let [authState] = useAuth();
  let [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (worker) {
      worker.addEventListener('message', (message) => {
        let { data } = message;

        if (data.type === 'processing') {
          setProcessing(true);
        }

        if (data.type === 'result') {
          setProcessing(false);
          console.log(data.payload);
        }
      });
    }
  }, []);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    let { files } = event.target;

    if (worker && files.length > 0) {
      worker.postMessage({ type: 'process', payload: files[0] });
    }
  }

  function handleCreatePost() {
    createPost(authState.user, {
      name: 'User Created Post',
      description: 'empty',
    }).then((result) => console.log(result));
  }

  return (
    <div>
      <h1>{t('new post')}</h1>
      <div>
        <label htmlFor="title">{t('title')}</label>
        <input id="title" type="text" />
      </div>
      <div>
        <label htmlFor="description">{t('description')}</label>
        <input id="description" type="text" />
      </div>
      {processing ? (
        <div>Processing files...</div>
      ) : (
        <div>
          <label htmlFor="assets">{t('assets')}</label>
          <input
            id="assets"
            type="file"
            accept="image/*, video/*"
            multiple
            value=""
            onChange={handleUpload}
          />
        </div>
      )}
      <button>{t('preview')}</button>
      <button onClick={handleCreatePost}>{t('create post')}</button>
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
