var viewModel = {
	subject: "",
	messages: []
};
var binding = new droopyBinding.OnewayBinding("container", viewModel);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var topicId = getParameterByName("id");

$.getJSON("/api/topics/" + topicId).then(function(topic){
	viewModel.subject = topic.subject;
	viewModel.messages = topic.messages;
	setTimeout(function(){
		$("blockquote").hide();
	}, 100)
});