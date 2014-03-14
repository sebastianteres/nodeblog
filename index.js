var express = require("express"),
	routes = require("./app/routes.js"),
	app = express();

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
app.use(express.static(__dirname + '/app/public'));

function staticView(view) {
	return function(req, res){
		res.render(view);
	};
}

/*******************
 * VIEWS
 ******************/
app.get('/', staticView('index')); //Home
app.get('/blog', routes.blogHome); //Blog
app.get('/admin', routes.blogAdmin);
app.post('/admin/post/create', routes.createPost);
app.post('/admin/post/delete', routes.removePost);

app.listen(port, ipaddr, function(){
  console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);
});