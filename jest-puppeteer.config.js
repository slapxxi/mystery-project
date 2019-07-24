module.exports = {
  browserContext: 'incognito',
  launch: {
    headless: true,
    debug: true,
  },
  server: {
    command: 'yarn run build:server && node build/server.js',
    port: 3000,
    launchTimeout: 15000,
  },
};
