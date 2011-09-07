var http = require("http");
var redis = require("redis");
var url = require('url');

client = redis.createClient();
var requests = [];
var strings = [];

http.createServer(
    function(request, response) {
        if (request.url === '/favicon.ico') {
            response.writeHead(200, {'Content-Type': 'image/x-icon'});
            response.end();
            console.log('favicon requested');
        } else {
            requests.push([request, response]);
        }

    }).listen(8000);

function foo() {
    var d = new Date();
    var key = "pink-eye-p-" + d.getMinutes();
    console.log('reading key into array from ' + key);
    client.smembers(key, function(err, obj) {
        if (obj) {
            for (var i = 0; i < obj.length; i++) {
                strings.push(JSON.parse(obj[i]));
            }
        }
    });
}

setInterval(function() {
	foo();
    while (requests.length) {
        console.log('sending requests back.');
        out = requests.shift();
        out[1].writeHead(200, { "Content-Type": "text/json" });
		var lVars = url.parse(out[0].url, true);
		var wrap = lVars.query.callback;
		var s = wrap+'({"coordinates":'+JSON.stringify(strings)+'})';
        out[1].end(s);
    }
    strings = [];

}, 5000);
