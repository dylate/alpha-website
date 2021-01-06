const Server = require('./server/Server');
const path = require('path');
const port = process.env.port || 3000;
const userRoute = require('./routes/users');

const server = new Server(path.join(__dirname, "./_site"));

server.addRoute("/users", (request, response) => {
  userRoute[request.method](request, response);
});

server.serve(port);