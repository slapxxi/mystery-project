module.exports = {
  browserContext: 'incognito',
  launch: {
    headless: true,
    debug: true,
  },
  server: {
    command: 'node server.js',
    port: 3000,
    launchTimeout: 15000,
  },
};
