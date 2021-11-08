
const http = require("http");

/**
 * Launch http serveur on expressEndPointManager
 */
const expressEndPointManager = require("./expressEndPointManager");
expressEndPointManager.set("port",3000);
const server= http.createServer(expressEndPointManager);
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const port = 3000;
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
const startedHandler = () => {
    const address = server.address();
    const port = 3000;
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
};
server.on("error", errorHandler);
server.on("listening", startedHandler);
server.listen(3000);
