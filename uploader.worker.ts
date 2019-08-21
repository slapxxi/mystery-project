declare let self: DedicatedWorkerGlobalScope;

let fileReader = new FileReader();

fileReader.addEventListener('load', (event) => {
  let result = (event.target as any).result;
  self.postMessage({ type: 'result', payload: result });
});

self.addEventListener('message', (message) => {
  let { data } = message;

  if (data.type === 'process') {
    self.postMessage({ type: 'processing' });
    fileReader.readAsDataURL(data.payload);
  }
});

export default null;
