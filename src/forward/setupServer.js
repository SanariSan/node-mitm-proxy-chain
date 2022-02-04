const http = require('http');
const httpProxy = require('http-proxy');
const { setupHttp, setupHttps } = require('./protocols/index.js');

function setupServer({
  httpsOnly,
  host = '127.0.0.1',
  port = 3000,
  remoteProxyHost,
  remoteProxyPort,
}) {
  let remoteProxy;
  let remoteProxySettings;

  if (remoteProxyHost !== undefined && remoteProxyPort !== undefined) {
    remoteProxySettings = {
      target: {
        host: remoteProxyHost,
        port: remoteProxyPort,
      },
      toProxy: true,
      prependPath: false,
    };
    remoteProxy = new httpProxy.createProxyServer(remoteProxySettings);
    remoteProxy.on('error', function (err) {
      console.log('ERR:', err);
    });
  }

  const server = http.createServer();
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE' || e.code === 'EADDRNOTAVAIL') {
      console.log('Address in use or not available, retrying...');
      setTimeout(() => {
        server.close();
        server.listen(port, host);
      }, 5000);
    }
  });

  setupHttp({ server, remoteProxy, remoteProxySettings, httpsOnly });
  setupHttps({ server, remoteProxySettings });

  server.listen(port, host, () => {
    console.log(`Listening: ${host}:${port}`);
  });
}

module.exports = {
  setupServer,
};
