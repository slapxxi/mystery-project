/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTranslation } from '@self/i18n';
import { PagePropsWithTranslation } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { assign, Machine } from 'xstate';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {}

let testMachine = Machine({
  initial: 'idle',
  context: { title: 'Empty' },
  states: {
    idle: {
      entry: 'setTitle',
      // on: { UPDATE: { actions: 'setTitle' } },
    },
  },
});

function IndexPage(props: Props) {
  let { t } = props;
  let [state, send] = useMachine(testMachine, {
    actions: { setTitle: assign({ title: () => 'hello' }) },
  });

  return (
    <div>
      <h1 data-testid="title">{t('index')}</h1>
      <h2 data-testid="second-title">{state.context.title}</h2>
      <button onClick={() => send('UPDATE')}>Update</button>
    </div>
  );
}

IndexPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export { IndexPage };
// @ts-ignore
export default withTranslation('common')(IndexPage);
