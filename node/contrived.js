var http = require("http");
var requests = [];

http.createServer(function(request, response) {
    //store the response so we can respond later
    requests.push(response);
    }).listen(8000);
    
setInterval(function() {
    // respond to each request
    while (requests.length) {
    	response = requests.shift();
    	response.writeHead(200, { "Content-Type": "text/plain" });
    	response.end("Hello, World!");
    }
}, 5000);
