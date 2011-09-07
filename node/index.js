var http = require("http");
var requests = [];

http.createServer(function(request, response) {
        requests.push(response);
}).listen(8000);

setInterval(function() {
        while (requests.length) {
            response = requests.shift();
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("Hello, World!");
         }
}, 2000);
