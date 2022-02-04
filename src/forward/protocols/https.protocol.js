const { noProxyChain, proxyChain } = require('./https/index.js');

// PROXY HTTPS
function setupHttps({ server, remoteProxySettings }) {
  server.on('connect', (request, clientSocket, head) => {
    if (remoteProxySettings !== undefined) proxyChain(request, clientSocket, remoteProxySettings);
    else noProxyChain(request, clientSocket, head);
  });
}

module.exports = setupHttps;
