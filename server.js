var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var router = require('./router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('node_modules'));
app.use(express.static('www'));
router.init(app);

var port = process.env.PORT || 4000;
var host = process.env.IP;
if (host) {
	server.listen(port, host, function() {
  		console.log('Server listening on port ' + host + ":" + port);
	});
} else {
	server.listen(port, host, function() {
  		console.log('Server listening on port ' + port);
	});
}