/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTranslation } from '@self/i18n';
import { PagePropsWithTranslation } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { Machine, sendParent } from 'xstate';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {}

let childMachine = Machine({
  initial: 'init',
  states: {
    init: {
      entry: [sendParent('PING')],
      after: {
        1000: 'setup',
      },
    },
    setup: {
      entry: [sendParent('PING')],
      after: {
        1000: 'finish',
      },
    },
    finish: {
      entry: [sendParent('PING')],
      type: 'final',
    },
  },
});

let testMachine = Machine({
  initial: 'idle',
  context: { title: 'Empty' },
  states: {
    idle: {
      on: { UPDATE: 'updating' },
    },
    updating: {
      invoke: {
        src: 'childMachine',
        onDone: 'finish',
      },
      on: {
        PING: { actions: 'log' },
      },
    },
    finish: {},
  },
});

function IndexPage(props: Props) {
  let { t } = props;
  let [state, send] = useMachine(testMachine, {
    actions: {
      log(context, event) {
        console.log(context, event);
      },
    },
    services: {
      childMachine,
    },
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
