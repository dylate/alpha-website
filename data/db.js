const fs = require('fs');
const path = require('path');

const db = {
    storageFilePath: path.join(__dirname, "users.json"),
    hasStorageFile: function() {
        return fs.existsSync(this.storageFilePath);
    },
    getUsers: function() {
        if (this.hasStorageFile()) {
            const fileContents = fs.readFileSync(this.storageFilePath);
            return JSON.parse(fileContents);
        } else {
            return [];
        }
    },
    createUser: function(name, email) {
        if (this.hasStorageFile()) {
            this.insertUser(name, email);
        } else {
            this.createStorageFile(() => {
                insertUser(name, email);
            });
        }
    },
    insertUser: function(name, email) {
        fs.readFile(this.storageFilePath, (error, data) => {
            if (error) throw error;
            let users = JSON.parse(data);
            users.push({ name, email });
            let usersAsString = JSON.stringify(users);
            fs.writeFile(this.storageFilePath, usersAsString, (error) => {if (error) throw error;});
        });
    },
    createStorageFile: function(callback) {
        let users = [];
        let fileData = JSON.stringify(users);
        fs.writeFile(this.storageFilePath, fileData, (error) => {
            if (error) throw error;
            callback();
        });
    }
};

module.exports = db;