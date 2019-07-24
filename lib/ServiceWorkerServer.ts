function ServiceWorkerServer<T extends ServiceWorkerGlobalScope>(serviceWorker: T) {
  let cacheNames = {
    scripts: '_scripts',
    images: '_images',
    styles: '_styles',
    documents: '_docs',
  };

  let precacheName = '_precache';

  let precachedResources: RequestInfo[] = [];

  return {
    precache(resources: RequestInfo[]) {
      precachedResources = [...precachedResources, ...resources];
    },

    serve() {
      serviceWorker.addEventListener('install', (event) => {
        console.log('Installing...');
        event.waitUntil(precache());
      });

      serviceWorker.addEventListener('activate', (event) => {
        console.log('Activating...');
        event.waitUntil(cleanup());
      });

      serviceWorker.addEventListener('fetch', () => {
        console.log('Fetching...');
      });
    },
  };

  async function precache() {
    console.log('Precaching...');

    await caches.delete(precacheName);

    let cache = await caches.open(precacheName);
    return cache.addAll(precachedResources);
  }

  async function cleanup() {
    let keys = await caches.keys();

    let deleteOperations = keys.map((key) => {
      if (Object.values(cacheNames).includes(key)) {
        console.log('Deleting', key);
        return caches.delete(key);
      }
    });

    return Promise.all<boolean | undefined>(deleteOperations);
  }
}

export default ServiceWorkerServer;
