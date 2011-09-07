var redis = require("redis"),
    client = redis.createClient();

    client.on("error", function (err) {
            console.log("Error " + err);
    });

    client.set("string key", "string val", redis.print);

	console.log('hi');
    client.smembers("pink-eye-p-36", function(err, obj) {
        console.log('inside');
        console.dir(obj);
    });

	setInterval(function() {
	  console.log('hey der!');
	}, 2000);
	
    
