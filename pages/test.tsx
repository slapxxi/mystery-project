import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';

interface Context {
  ts: number;
}

interface State {
  states: {
    idle: {};
    activating: {};
    active: {};
  };
}

type Events = { type: 'INIT' };

let testMachine = Machine<Context, State, Events>({
  id: 'test-machine',
  initial: 'idle',
  context: { ts: null },
  states: {
    idle: {
      entry: ['log'],
      activities: ['beeping'],
      on: {
        INIT: { target: 'activating', cond: 'requirementsMet' },
      },
    },
    activating: { invoke: { src: 'fetchData', onDone: 'active' } },
    active: { type: 'final' },
  },
});

function TestingPage(_props: any) {
  let [state, send] = useMachine(testMachine, {
    context: { ts: Date.now() },
    guards: {
      requirementsMet: (context, event) => Date.now() - context.ts > 3000,
    },
    actions: { log: console.log },
    activities: {
      beeping: () => {
        let id = setInterval(() => console.log('beep'), 1000);
        return () => clearInterval(id);
      },
    },
    services: {
      fetchData,
    },
  });

  console.log(state.event);
  console.log(state.value);

  return (
    <div>
      <h1>{state.matches('active') ? 'Active' : 'Inactive'}</h1>
      <button onClick={() => send('INIT')}>Activate</button>
    </div>
  );
}

function fetchData() {
  return new Promise((res) => {
    setTimeout(() => res(), 3000);
  });
}

export default TestingPage;
