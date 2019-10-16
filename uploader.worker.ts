declare let self: DedicatedWorkerGlobalScope;

let fileReader = new FileReader();

fileReader.addEventListener('load', (event) => {
  let result = event.target.result as string;
  self.postMessage({ type: 'FINISH', payload: result });
});

fileReader.addEventListener('progress', (event) => {
  self.postMessage({ type: 'PROGRESS', payload: event.total / event.loaded });
});

self.addEventListener('message', (message) => {
  let { data } = message;

  console.log('worker', data);

  if (data.type === 'process') {
    let file = data.payload as File;

    self.postMessage({ type: 'PROCESSING' });
    fileReader.readAsDataURL(file);
  }
});

export default null;
