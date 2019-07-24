declare let self: DedicatedWorkerGlobalScope;

self.addEventListener('message', (message) => {
  let { data } = message;
  console.log(data);
});

export default null;
