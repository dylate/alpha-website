const handler = require('serve-handler');
const http = require('http');
const port = process.env.port || 3000;

const server = http.createServer((request, response) => {
  return handler(request, response);
})

server.listen(port, () => {
  console.log(`Running on port ${port}`);
});