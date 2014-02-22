var express = require("express"),
	app = express();

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

function staticView(view) {
	return function(req, res){
		res.render(view);
	};
}



/*******************
 * VIEWS
 ******************/
app.get('/', staticView('index')); //Home
//app.get('/dashboard', staticView('dashboard'));

app.listen(port);
console.log("Server running at http://" + ipaddr + ":" + port + "/");