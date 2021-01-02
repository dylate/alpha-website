const Server = require('./server/Server');
const path = require('path');
const port = process.env.port || 3000;
const db = require('./data/db');

const server = new Server(path.join(__dirname, "./_site"));

server.addRoute("/users", (request, response) => {
  if (request.method === "POST") {
    const post = {
        body: "",
        isValid: false,
        appendBody: function() {
          const newData = request.read();
          if (newData) {
            this.body += newData;
          }
        },
        bodyToJson: function() {
          return JSON.parse(this.body);
        },
        setUpResponse: function() {
          response.writeHead("200", {
            "Content-Type": "application/json"
          });
        },
        respond: function(status, body) {
          response.writeHead(status.toString(), {
            "Content-Type": "application/json",
            "Accept": "application/json"
          });
          let bodyAsString = JSON.stringify(body);
          response.end(bodyAsString);
        },
        verifyData: function() {
          let json = this.bodyToJson();
          if (!json.hasOwnProperty("name") || !json.hasOwnProperty("email")) {
            throw new Error("Post data does not follow the pattern: { name: string, email: string }");
          }
        }
      };
      request.on("readable", () => post.appendBody());
      request.on("end", () => {
        try {
          post.verifyData();
          const user = post.bodyToJson();
          db.createUser(user.name, user.email);
          post.respond(200, { success: true, message: `The user ${user.name} was successfully created!` });
        } catch(e) {
          console.log(e);
          post.respond(500, { success: false, message: e.message });
        }
      })
    } else {
      response.writeHead(200, {
        "Content-Type": "text/plain",
      });
      response.end("Make a post request to this endpoint to add a user.");
    }
});

server.serve(port);