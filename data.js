var config = require("./config");
var mongo = require("droopy-mongo");
var dao = new mongo.MongoDao(config.mongo.url);
var topics = dao.collection("topics");
var messages = dao.collection("messages");

var thinMessageFields = {
	postDate: 1,
	topicId: 1
};
var data = function() {
	var getTopics = function() {
		var query = { topicId: { "$ne": null }};
		var options = { sort: { postDate: -1 }, limit: 1000};

		return messages.find(query, thinMessageFields, options).then(function(results){
			var ids = results.map(function(result){
				return result.topicId;
			});
			var query = { topicId: {$in: ids}};
			return topics.find(query).then(function(topics){
				topics.forEach(function(topic){
					//var d = new Date(topic.postDate);
					//topic.postDate = d.toDateString() + " - " + d.toLocaleTimeString();
				});
				return topics;
			});
		});
	};

	var getTopic = function(topicId) {
		var id = parseInt(topicId + "", 10);
		var query = { topicId: id };
		var options = { sort: { postDate: 1 }};
		var topic = {};
		return topics.findOne(query)
		.then(function(result){
			topic = result;
			return messages.find(query, null, options).then(function(results){
				topic.messages = results;
				topic.messages.forEach(function(msg){
					//var d = new Date(msg.postDate);
					//msg.postDate = d.toDateString() + " - " + d.toLocaleTimeString();
				});
				return topic;
			}, function() { console.log("HERE"); console.log(arguments)});
		});
	};

	var searchTopics = function(searchText) {
		searchText = "\"" + searchText + "\"";
		var query =  { $text: { $search: searchText } };
		var options = { sort: { postDate: -1}, limit: 150 };
		return topics.find(query, null, options).then(function(results) { return results;}, function(){ console.log(arguments);});
	};

	var searchMessages = function(searchText) {
		searchText = "\"" + searchText + "\"";
		var query =  { $text: { $search: searchText } };
		var options = { sort: { postDate: -1 }, limit: 150 };
		return messages.find(query, null, options).then(function(results) { 
			results.forEach(function(msg){
				//var d = new Date(msg.postDate);
				//msg.postDate = d.toDateString() + " - " + d.toLocaleTimeString();
			});
			return results;
		}, function(){ console.log(arguments);});
	};

	return {
		getTopics: getTopics,
		getTopic: getTopic,
		searchTopics: searchTopics,
		searchMessages: searchMessages
	};


};

module.exports = data();

//indexes
// {"body": "text"}
// {"subject": "text"}