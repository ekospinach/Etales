var path    = require('path'),

	mongoose = require('mongoose'),
	express = require('express'),
	http = require('http'), 
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	Config = require('./config.js'),
	passport = require('passport'),
	flash = require('connect-flash'),
	userRoles = require('./app/js/routingConfig').userRoles,
	accessLevels = require('./app/js/routingConfig').accessLevels,
	util = require('util');

	//process.env.NODE_ENV = 'production';
	conf = new Config();

	//backend view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.use(express.cookieParser());
	app.use(express.favicon());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());

	app.use(express.cookieSession({
	  secret : process.env.COOKIE_SECRET || "Superdupersecret"
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(app.router);
	app.use(express.static(path.join(__dirname, '/app')));
	app.use(express.logger());

	app.get('/feedbackENG', function(req, res, next){
		res.render('feedbackENG.ejs', {seminar : req.query.seminar, 
									   period : req.query.period});
	});

	//user authenticate
	passport.use(require('./api/models/seminar').localStrategy);
	passport.serializeUser(require('./api/models/seminar').serializeUser);
	passport.deserializeUser(require('./api/models/seminar').deserializeUser);
	app.post('/login', require('./api/auth').login);
	app.post('/logout', require('./api/auth').logout);

	require('./routes/routesDecision')(app, io);
	require('./routes/routesAdmin')(app, io);
	require('./routes/routesReport')(app, io);

	app.use(express.errorHandler());

	port = parseInt(process.env.PORT, 10) || conf.server.port;
	mongoose.connect('mongodb://localhost/Etales');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function(response,request) {
	      server.listen(port, function () {
	          console.log('Server listening on port ' + port);
	      });
	});