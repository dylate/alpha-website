
module.exports = {
    path = "/users",
    serve: function (request, response) {
        request.on("readable", () => this.appendBody());
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
        });
    }
}