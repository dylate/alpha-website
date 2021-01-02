var http = require('http');
var fs = require('fs');
var path = require('path');

class Server {
    static mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    /**
     * @param {string} directory The directory that will be used to serve static files.
     */
    constructor(directory) {
        console.log(directory);
        this.directory = directory;
        this.routes = new Array();
    }

    serve(port) {
        http.createServer((request, response) => {
            console.log(`${request.method} ${request.url}: Requested by ${request.connection.remoteAddress}.`);
            if (this.hasRoute(request.url)) {
                this.serveRoute(request, response);
            } else {
                this.serveFile(request, response);
            }
        }).listen(port);
        console.log(`Listening on port ${port}.`);
    }

    serveRoute(request, response) {
        let route = this.routes.find((value) => value.url == request.url);
        route.serve(request, response);
    }

    hasRoute(url) {
        return this.routes.some(route => route.url == url);
    }

    /**
     * Adds a route with custom functionality to the server
     * @param {string} url 
     * @param {function} callback 
     */
    addRoute(url, callback) {
        this.routes.push({
            url: url,
            serve: callback
        });
    }

    /**
     * Sends the file that was requested to the client if it can be found.
     * @param {http.IncomingMessage} request The incoming data from the client's request
     * @param {http.ServerResponse} response The object used to send the response to the client.
     */
    serveFile(request, response) {
        const filePath = this.getFilePath(request);
        fs.readFile(filePath, (error, content) => {
            if (error) {
                this.sendError(error, response);
            } else {
                this.sendFile(content, response, this.getContentType(filePath));
            }
        });
    }

    /**
     * Returns the path of the file being asked for by a user's HTTP request.
     * @return {string} the path of the file being asked for.
     * @param {http.IncomingMessage} request The HTTP request sent to the server.
     */
    getFilePath(request) {
        let filePath = path.join(this.directory, request.url);
        let fileExists = fs.existsSync(filePath);
        if (fileExists && fs.lstatSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        } else if (!fileExists && path.extname(filePath) == "") {
            filePath = filePath.replace(/\/$/, "") + ".html";
        }
        return filePath;
    }
    
    /**
     * Returns an error page to the client depending on what type of error was produced.
     * @param {NodeJS.ErrnoException} error the error produced when searching for the requested file.
     * @param {http.ServerResponse} response the response object used to return data to the client.
     */
    sendError(error, response) {
        if(error.code == 'ENOENT') {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end("The page you are looking for cannot be found.", 'utf-8');
        } else {
            console.log(error);
            response.writeHead(500);
            response.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
        }
    }

    /**
     * Returns the requested file to the client.
     * @param {Buffer} content the contents of the file to return.
     * @param {http.ServerResponse} response the response object used to return data to the client.
     */
    sendFile(content, response, contentType) {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    }
    
    /**
     * Returns the mime type of the file that is being asked for by the client.
     * @return {string} the mime type of the file being asked for.
     * @param {string} filePath the path of the file being asked for.
     */
    getContentType(filePath) {
        const extension = this.getExtensionName(filePath);
        return Server.mimeTypes[extension] || 'application/octet-stream';
    }

    /**
     * Returns the file extension of the file as a lowercase string.
     * @return {string} The file extension as a lowercase string.
     * @param {string} filePath the path of the file.
     */
    getExtensionName(filePath) {
        const extension = String(path.extname(filePath))
        return extension.toLowerCase();
    }
}

module.exports = Server;