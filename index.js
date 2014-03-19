var express = require("express"),
  app = express(),
  controllers = require("./app/Controllers"),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  auth = require("./app/auth.js"),
  moment = require("moment");

/** OPENSHIFT **/
//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var session_secret = process.env.SESSION_SECRET || "Cats in the cradle";

//Passport set up
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  auth.findUser(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(username, password, done) {
  auth.authenticateUser(username, password, function (err, user){
    return done(err, user);
  });
}));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
app.use(express.session({ secret: session_secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/app/public'));

function staticView(view) {
	return function(req, res){
		res.render(view);
	};
}

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

/*******************
 * MIDDLEWARES
 *******************/
function ensureAuth (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

/*******************
 * VIEWS HELPERS
 *******************/
app.locals.helpers = {
  dateFromNow : function(date) {
    return moment(date).fromNow();
  }
};


/*******************
 * ROUTES
 ******************/
app.get('/', staticView('index')); //Home | About

app.get('/blog', controllers.BlogController.home);
app.get('/blog/:type', controllers.BlogController.home);
app.get('/blog/post/:url', controllers.BlogController.getPost);

//Admin

app.get('/login', function(req, res){
  auth.allowRegister(function(allowRegister){
    console.log("Allow Register: " + allowRegister);
    res.locals.allowRegister = allowRegister;
    res.render('login', { user: req.user, message: req.session.messages });
  });
});
//app.post("/login", controllers.AdminController.login);
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/admin');
    });
  })(req, res, next);
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post("/register", controllers.AdminController.register);

app.get('/admin', ensureAuth, controllers.AdminController.renderView);
app.post('/admin/post/create', ensureAuth, controllers.AdminController.create);
app.post('/admin/post/delete', ensureAuth, controllers.AdminController.remove);
app.get('/admin/post/edit/:id', ensureAuth, controllers.AdminController.edit);
app.post('/admin/post/update/:id', ensureAuth, controllers.AdminController.update);

app.listen(port, ipaddr, function(){
  console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);
});