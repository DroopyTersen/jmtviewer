var data = require("./data");
var api = require("./api");
module.exports = {
	init: function(app) {
		app.get('/', function(req, res) {
			res.sendFile(__dirname + "/www/home.html");
		});
		app.get('/topic', function(req, res) {
			res.sendFile(__dirname + "/www/topic.html");
		});
		api.init(app);
	}
};