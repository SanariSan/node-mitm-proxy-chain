const httpProxy = require('http-proxy');

// PROXY HTTP
function setupHttp({ server, remoteProxy, remoteProxySettings, httpsOnly }) {
  server.on(
    'request',
    httpsOnly
      ? (req, res) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('No http allowed');
        }
      : (request, response) => {
          const { protocol, port, hostname, pathname } = new URL(request.url);

          console.log(`[+] HTTP: ${hostname}:${port || '80'}${pathname || ''}`);

          if (remoteProxy !== undefined && remoteProxySettings !== undefined) {
            remoteProxy.web(request, response, remoteProxySettings);
            return;
          }

          const proxy = httpProxy.createProxyServer({});
          proxy.web(request, response, {
            target: `${protocol}//${hostname}:${port || '80'}`,
          });
        },
  );
}

module.exports = setupHttp;
