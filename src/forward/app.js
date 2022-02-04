const { setupServer } = require('./setupServer');
const { monkeyPatchConsole } = require('./util');

monkeyPatchConsole({ disableLogging: process.env.DISABLE_LOGGING === 'true' });

process.on('uncaughtException', (e) => {
  console.log(null, e);
});
process.on('unhandledRejection', (e) => {
  console.log(null, e);
});

async function index() {
  const httpsOnly = process.env.HTTPS_ONLY === 'true';
  const host = process.env.HOST;
  const port = Number(process.env.PORT) || process.env.PORT;
  const remoteProxyHost = process.env.REMOTE_PROXY_HOST;
  const remoteProxyPort = Number(process.env.REMOTE_PROXY_PORT) || process.env.REMOTE_PROXY_PORT;

  console.dir({ httpsOnly, host, port, remoteProxyHost, remoteProxyPort });

  setupServer({
    httpsOnly,
    host,
    port,
    remoteProxyHost,
    remoteProxyPort,
  });
}

index();
