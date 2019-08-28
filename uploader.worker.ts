declare let self: DedicatedWorkerGlobalScope;

let fileReader = new FileReader();

fileReader.addEventListener('load', (event) => {
  let result = (event.target as any).result;
  self.postMessage({ type: 'result', payload: result });
});

self.addEventListener('message', (message) => {
  let { data } = message;

  if (data.type === 'process') {
    let file = data.payload as File;

    self.postMessage({ type: 'processing' });

    setTimeout(() => {
      fileReader.readAsDataURL(file);
    }, 2000);
  }
});

export default null;
