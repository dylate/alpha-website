/** @abstract */
class Route {
    /** 
     * @final
     * @type {string}
     */
    path;

    /**
     * A route used for custom functionality for any given route
     * @abstract
     * @param {http.IncomingMessage} request The HTTP request sent from the client.
     * @param {http.ServerResponse} response The HTTP response that will be sent back to the client.
     */
    serve(request, response) {}
}