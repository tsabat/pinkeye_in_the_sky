var http = require("http");
var redis = require("redis"),

    client = redis.createClient();
var requests = [];
var strings = [];

http.createServer(
    function(request, response) {
        if (request.url === '/favicon.ico') {
            response.writeHead(200, {'Content-Type': 'image/x-icon'});
            response.end();
            console.log('favicon requested');
            return;
        } else {
            requests.push(response);
        }

    }).listen(8000);

setInterval(function() {
    var d = new Date();
    var key = "pink-eye-p-" + d.getMinutes();
    console.log('reading key into array from ' + key);
    client.smembers(key, function(err, obj) {
        if (obj) {
            for (var i = 0; i < obj.length; i++) {
                strings.push(JSON.parse(obj[i]));
            }
            ;
        }
        ;
    });
}, 1000);


setInterval(function() {
    while (requests.length) {
        console.log('sending requests back.');
        response = requests.shift();
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end(JSON.stringify(strings));
    }
    strings = [];

}, 5000);