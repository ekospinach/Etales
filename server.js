require('newrelic');

var path    = require('path'),

mongoose = require('mongoose'),
files    = require('./api/models/file.js'),
express = require('express');
http = require('http'), 
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server),
Config = require('./config.js'),
passport = require('passport'),
flash = require('connect-flash'),
userRoles = require('./app/js/routingConfig').userRoles,
accessLevels = require('./app/js/routingConfig').accessLevels;


conf = new Config();
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

//user authenticate
passport.use(require('./api/models/seminar').localStrategy);
passport.serializeUser(require('./api/models/seminar').serializeUser);
passport.deserializeUser(require('./api/models/seminar').deserializeUser);
app.post('/login', require('./api/auth').login);
app.post('/logout', require('./api/auth').logout);

app.post('/initialiseSeminar', require('./api/initialiseSeminar.js').initialiseSeminar(io));
app.post('/passiveSeminar', require('./api/passiveSeminar.js').passiveSeminar(io));
//app.post('/kernelResult')

app.post('/contract');
app.post('/contractDetails');
app.post('/producerDecision',require('./api/models/producerDecision.js').updateProducerDecision(io));
app.post('/retailerDecision',require('./api/models/retailerDecision.js').updateRetailerDecision(io));

app.get('/negotiationDecision');
app.post('/updateContractDetails',require('./api/models/contract.js').updateContractDetails(io));


//add Seminar
app.post('/addSeminar',require('./api/models/seminar.js').addSeminar);

app.get('/producerDecision/:producerID/:period/:seminar',require('./api/models/producerDecision.js').getAllProducerDecision);
app.get('/producerProducts/:producerID/:period/:seminar/:categoryID',require('./api/models/producerDecision.js').getProducerProductList);
app.get('/producerBrands/:producerID/:period/:seminar',require('./api/models/producerDecision.js').getProducerBrandList);

app.get('/retailerDecision/:retailerID/:period/:seminar',require('./api/models/retailerDecision.js').getAllRetailerDecision); 

app.get('/retailerProducts/:retailerID/:period/:seminar/:categoryID',require('./api/models/retailerDecision.js').getRetailerProductList);
//seminar List
app.get('/seminarList',require('./api/models/seminar.js').getSeminarList);
//update seminar
app.post('/updateSeminar',require('./api/models/seminar.js').updateSeminar);

app.get('/contracts/:seminar/:contractUserID',require('./api/models/contract.js').getContractList);
app.get('/contractDetails/:contractCode',require('./api/models/contract.js').getContractDetails);

//add new contract
app.post('/addContract',require('./api/models/contract.js').addContract(io));

app.get('/variantHistoryInfo');
app.get('/brandHistoryInfo');
app.get('/companyHistoryInfo');
app.get('/quarterHistoryInfo');

app.get('/marketReport', require('./api/models/marketReport.js').getMarketReport);
app.get('/lineChart', require('./api/models/lineChart.js').getLineChart);
app.get('/perceptionMaps/:fileName/:period',require('./api/models/perceptionMap.js').getMapByParams);
app.get('/finReport', require('./api/models/finReport.js').getFinReport);
app.get('/volReport', require('./api/models/volReport.js').getVolReport);

//special calculate API
app.get('/productionCost');

app.get('/proNewDoc', require('./api/models/producerDecision.js').newDoc);
app.get('/retNewDoc', require('./api/models/retailerDecision.js').newDoc);
app.get('/conNewDoc', require('./api/models/contract.js').newDoc);
app.get('/conDetNewDoc',require('./api/models/contract.js').newDetail);
app.get('/variantHistoryNewDoc',require('./api/models/variantHistoryInfo.js').newDoc);
app.get('/brandHistoryNewDoc',require('./api/models/brandHistoryInfo.js').newDoc);
app.get('/companyHistoryNewDoc',require('./api/models/companyHistoryInfo.js').newDoc);
app.get('/quarterHistoryNewDoc',require('./api/models/quarterHistoryInfo.js').newDoc);

app.get('/seminarNewDoc',require('./api/models/seminar.js').newDoc);

// app.use(require('./api/errorHandlers.js').logErrors);
// app.use(require('./api/errorHandlers.js').)
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
