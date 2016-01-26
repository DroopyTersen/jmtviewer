var data = require("./data");

var init = function(app) {
	app.get("/api/topics", function(req, res){
		data.getTopics().then(function(results){
			res.send(results);
		});
	});

	app.get("/api/topics/:id", function(req, res){
		data.getTopic(req.params.id).then(function(results){
			res.send(results);
		});
	});

	app.get("/api/topics/search/:searchText", function(req, res){
		data.searchTopics(req.params.searchText).then(function(results){
			res.send(results);
		}, function(){
			res.send(arguments);
		});
	});

	app.get("/api/messages/search/:searchText", function(req, res){
		data.searchMessages(req.params.searchText).then(function(results){
			res.send(results);
		}, function(){
			res.send(arguments);
		});
	});
};
exports.init = init;