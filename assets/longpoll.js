var http = require("http");
var requests = [];

http.createServer(function(request, response) {
	// store the response so we can respond later
	requests.push({
		response: response,
		timestamp: new Date().getTime()
	});
}).listen(8000);

setInterval(function() {
	// close out requests older than 30 seconds
	var expiration = new Date().getTime() - 30000;
	var response;
	
	for (var i = requests.length - 1; i >= 0; i--) {
		if (requests[i].timestamp < expiration) {
			response = requests[i].response;
			response.writeHead(200, { "Content-Type": "text/plain" });
			response.end("");
		}
	}
}, 1000);