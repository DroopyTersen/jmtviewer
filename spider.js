var http = require("request-promise");
var mongo = require("droopy-mongo");
var mongoUrl = "mongodb://droopytersen:rival5sof@ds030827.mongolab.com:30827/jmt";
var dao = new mongo.MongoDao(mongoUrl);
var topics = dao.collection("topics");
var messages = dao.collection("messages");

var maxCount = 15000;
var currentCount = 0;
var done = false;
var yahooGroupUrls = {
    topicById: "https://groups.yahoo.com/api/v1/groups/johnmuirtrail/topics/"
};

var saveTopic = function (topicId) {
    var url = yahooGroupUrls.topicById + topicId;
    console.log(url);
    return http.get(url, { json: true, timeout: 120000 })
        .then(transformTopicResponse, function(){
            console.log("Uh OH!!!");
            crawlTopic(topicId);
        })
        .then(insertTopic);
};

var insertTopic = function(data) {
    console.log("saving topic...");
    return topics.insert(data.topic).then(function(results){
        console.log("saving messages...");
        return messages.insert(data.messages).then(function(messageResults){
            return (results.length) ? results[0] : results;
        });
    });
};
var transformTopicResponse = function(json) {

    //var json = JSON.parse(data);
    var messages = json.ygData.messages.map(function(message) {
        var msg = {
            userId: message.userId,
            author: message.authorName || message.profile,
            msgId: message.msgId,
            topicId: message.topicId,
            snippet: message.msgSnippet,
            body: message.messageBody,
            subject: message.subject
        };
        msg.postDate = new Date(parseInt(message.postDate + "000", 10));
        return msg;
    });

    var mainMsg = messages.filter(function(message){
        return message.msgId === message.topicId;
    })[0];

    if (!mainMsg) {
        mainMsg = {
            topicId: -99
        };
    }
    var topic = {
        topicId: mainMsg.topicId,
        postDate: mainMsg.postDate,
        author: mainMsg.author,
        snippet: mainMsg.snippet,
        subject: mainMsg.subject,
        numMesages: messages.length,
        prevTopic: json.ygData.prevTopicId,
        nextTopic: json.ygData.nextTopicId
    };
    return {topic: topic, messages: messages};
};


var crawlTopic = function(id) {
    saveTopic(id).then(function(topic){
        //console.log(topic);
        var nextId = topic.prevTopic;
        currentCount++;
        console.log(nextId);
        if ((currentCount < maxCount) && nextId) {
            crawlTopic(nextId);
        } else {
            console.log("ALL DONE");
        }
    });
};

crawlTopic(29629);
// crawlTopic(51557);


// (function wait () {
//    if (!done) setTimeout(wait, 1000);
// })();