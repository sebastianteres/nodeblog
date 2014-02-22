var express = require("express"),
	app = express();

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

app.listen(3000);
console.log('Listening on port 3000...');