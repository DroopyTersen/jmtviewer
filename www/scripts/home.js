var viewModel = {
	results: [],
	chosenTopic: {}
};
var binding = new droopyBinding.OnewayBinding("container", viewModel);

var getSearchUrl = function() {
	var url = "/api/";

	var filter = {
		msgSearch: $("#msgSearch").val(),
		author: $("#authorSearch").val(),
		topicSearch: $("#topicSearch").val(),
		dateFilter: $("#filter").val()
	};

	if (filter.topicSearch) {
		url += "topics/search/" + filter.topicSearch;
	} else {
		url += "topics/search/" + filter.msgSearch;
	}
	return $.param(filter);
};

var events = {
	search: function() {
		var text = $("#msgSearch").val();
		$.getJSON("/api/messages/search/" + text).then(function(msgs) {
			msgs.forEach(function(msg) {
				msg.numMesages = "";
				msg.postDate = (moment(msg.postDate)).format("MMM D, YYYY - h:mma");
			});
			viewModel.results = msgs;
		});
	},
	filteredSearch: function(e) {
		e.preventDefault();
		var text = $("#topicSearch").val();
		$.getJSON("/api/topics/search/" + text).then(function(topics) {
			topics.forEach(function(topic) {
				topic.postDate = (moment(topic.postDate)).format("MMM D, YYYY - h:mma");
			});
			viewModel.results = topics;
		});
	},
	resultClick: function(e) {
		var id = $(this).attr("data-id");
		$.getJSON("/api/topics/" + id).then(function(topic) {
			topic.messages.forEach(function(msg) {
				msg.numMesages = "";
				msg.postDate = (moment(msg.postDate)).format("MMM D, YYYY - h:mma");
			});
			viewModel.chosenTopic = topic;
			$("#myModal").modal("show");
			setTimeout(function() {
				$("blockquote").hide();
			}, 100)
		});
	}
};

var bindEvents = function() {
	$("#primarySearch").on("click", events.search);
	$("#filteredSearchForm").on("submit", events.filteredSearch);
	$("#container").on("click", ".result-item", events.resultClick);
};

$.getJSON("/api/topics").then(function(topics) {
	topics.forEach(function(topic) {
		topic.postDate = (moment(topic.postDate)).format("MMM D, YYYY - h:mma");
	});
	viewModel.results = topics;
});
bindEvents();