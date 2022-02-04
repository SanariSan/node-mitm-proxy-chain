const net = require('net');

function noProxyChain(request, clientSocket, head) {
  const { port, hostname } = new URL(`http://${request.url}`);

  console.log(`[+] HTTPS: ${hostname}:${port || '443'}`);

  const serverSocket = net.connect(port || 443, hostname, () => {
    // send head to the server
    serverSocket.write(head);
    // tell client the tunnel is set up
    clientSocket.write('HTTP/1.1 200 Connection established\r\n\r\n');
  });

  // Tunnel between proxy and server, sending data backward to client
  serverSocket.on('data', (chunk) => {
    clientSocket.write(chunk);
  });
  serverSocket.on('end', () => {
    clientSocket.end();
  });
  serverSocket.on('error', () => {
    clientSocket.write('HTTP/1.1 500 Connection error\r\n\r\n');
    clientSocket.end();
  });

  // Tunnel between proxy and client, sending data forward to server
  clientSocket.on('data', (chunk) => {
    serverSocket.write(chunk);
  });
  clientSocket.on('end', () => {
    serverSocket.end();
  });
  clientSocket.on('error', () => {
    serverSocket.end();
  });
}

module.exports = noProxyChain;
