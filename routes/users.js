const db = require('../data/db');

const userRoute = {
    userCreator: {
        rawData: "",
        isValid: false,
        appendRawData: function(request) {
            const newData = request.read();
            if (newData) {
                this.rawData += newData;
            }
        },
        getUserData: function() {
            return JSON.parse(this.rawData);
        },
        verify: function() {
            let json = this.getUserData();
            if (!json.hasOwnProperty("name") || !json.hasOwnProperty("email")) {
                throw new Error("Post data does not follow the pattern: { name: string, email: string }");
            }
        },
        clear: function() {
            this.rawData = "";
        }
    },
    "POST": function(request, response) {
        request.on("readable", () => this.userCreator.appendRawData(request));
        request.on("end", () => {
            try {
                this.userCreator.verify();
                const userData = this.userCreator.getUserData();
                db.createUser(userData.name, userData.email);
                this.sendJson(200, { success: true, message: `The user ${userData.name} was successfully created!` }, response);
                this.userCreator.clear();
            } catch (error) {
                console.log(error);
                this.sendJson(500, { success: false, message: error.message }, response);
            }
        });
    },
    "GET": function(request, response) {
        const users = db.getUsers();
        this.sendJson(200, users, response);
    },
    "OPTIONS": function(request, response) {
        response.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "content-type, cache-control, postman-token, user-agent",
            "Access-Control-Max-Age": 86400
        });
        response.end();
    },
    sendJson: function(status, body, response) {
        response.writeHead(status.toString(), {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        let bodyAsString = JSON.stringify(body);
        response.end(bodyAsString);
    }
};

module.exports = userRoute;