const http = require('http');

// credits to https://gist.github.com/regevbr/de3f5e0475aedd9081608663241bee10
function proxyChain(request, clientSocket, remoteProxySettings) {
  const connectOptions = {
    host: remoteProxySettings.target.host,
    port: remoteProxySettings.target.port,
    headers: request.headers,
    method: 'CONNECT',
    path: request.url,
    agent: false,
  };
  // from TunnelingAgent.prototype.createSocket
  const connectReq = http.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false;
  connectReq.once('response', onResponse);
  connectReq.once('upgrade', onUpgrade);
  connectReq.once('connect', onConnect);
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    res.upgrade = true;
  }

  function onUpgrade(res, remoteProxySocket, head) {
    process.nextTick(function () {
      onConnect(res, remoteProxySocket);
    });
  }

  function onConnect(res, remoteProxySocket) {
    remoteProxySocket.removeAllListeners();

    console.log(`[+] HTTPS: ${request.url}`);

    if (res.statusCode === 200) {
      clientSocket.write('HTTP/1.1 200 OK\r\n\r\n');

      // Tunnel between proxy and client, sending data forward to server
      clientSocket.on('data', (chunk) => {
        remoteProxySocket.write(chunk);
      });
      clientSocket.on('end', () => {
        remoteProxySocket.end();
      });
      clientSocket.on('error', () => {
        remoteProxySocket.end();
      });

      // Tunnel between proxy and server, sending data backward to client
      remoteProxySocket.on('data', (chunk) => {
        clientSocket.write(chunk);
      });
      remoteProxySocket.on('end', () => {
        clientSocket.end();
      });
      remoteProxySocket.on('error', () => {
        clientSocket.write('HTTP/1.1 500 Connection error\r\n\r\n');
        clientSocket.end();
      });
    } else {
      clientSocket.write('HTTP/1.1 500 SERVER ERROR\r\n\r\n');
      clientSocket.end();
      clientSocket.destroy();
    }
  }

  function onError() {
    clientSocket.write('HTTP/1.1 500 SERVER ERROR\r\n\r\n');
    clientSocket.end();
    clientSocket.destroy();
  }
}

module.exports = proxyChain;
