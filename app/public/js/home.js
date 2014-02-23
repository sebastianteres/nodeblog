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

	$(".info-sm .project .project-logo").click(function(){
		$(".project-details").removeClass("active");
		$(this).next(".project-details").addClass("active");
	});

	router = {
		"#skills" : function(){
			$("#info").attr("class", "info active-skills");
			$("#info-sm").attr("class", "info-sm active-skills");
		},
		"#projects" : function(){
			$("#info").attr("class", "info active-projects");
			$("#info-sm").attr("class", "info-sm active-projects");
		},
		"#about" : function(){
			$("#info").attr("class", "info active-about");
			$("#info-sm").attr("class", "info-sm active-about");
		}
	}

	eventsCallbacks.hashChange();

})();