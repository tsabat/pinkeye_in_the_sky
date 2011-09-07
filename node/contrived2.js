var http = require('http'); 
var server = http.createServer(function(req, response){
  setInterval ( fetchMedia, 2000 );
  fs.readFile(__dirname+'/index.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'}); 
    response.write(data); 
    response.end();
  });
});

server.listen(3000);

var fetchMedia = function(){

  console.log('fetching media');
    
}