/**
 * connection.js
 * An object for a connection to the server
 */

function Connection(c) {
    this.conn = c;
}

Connection.prototype = {
    name: function(n) {
        if(n === "") { return n; }
        else { this.n = n; }
    },
    connection: function() {
        return this.conn
    }
}

module.exports = Connection