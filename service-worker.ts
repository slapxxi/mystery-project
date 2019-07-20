import ServiceWorkerServer from '@self/lib/ServiceWorkerServer';

declare var self: ServiceWorkerGlobalScope;

let server = ServiceWorkerServer(self);

server.precache(['/', '/login', '/settings']);

server.serve();
