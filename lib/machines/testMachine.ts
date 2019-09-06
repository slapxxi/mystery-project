import { Machine } from 'xstate';

let testMachine = Machine({
  id: 'test-machine',
  initial: 'idle',
  states: { idle: {} },
});

export default testMachine;
