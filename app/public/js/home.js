(function(){
	"use strict";

	var eventsCallbacks = {}, router;

	eventsCallbacks.hashChange = function() {
		if (typeof router[location.hash] == "function") {
			router[location.hash].call();
		} else {
			$("#info").attr("class", "info active-about");
		}
	};

	//EVENTS
	
	if ("onhashchange" in window) {
		console.log("Hurray!");
	    window.onhashchange = eventsCallbacks.hashChange;
	} else {
		//TODO
		throw "No hashChange support";
	}
	$(".info .projects,.info .skills,.info .about").click(function(){
		location.hash = "#" + this.getAttribute("data-target");
	});

	router = {
		"#skills" : function(){
			$("#info").attr("class", "info active-skills");
		},
		"#projects" : function(){
			$("#info").attr("class", "info active-projects");
		},
		"#about" : function(){
			$("#info").attr("class", "info active-about");
		}
	}

	eventsCallbacks.hashChange();

})();