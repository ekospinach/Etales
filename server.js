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


//process.env.NODE_ENV = 'production';
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
app.post('/initialiseSeminarRetailer',require('./api/initialiseSeminar.js').initialiseSeminarRetailer(io));
app.post('/passiveSeminar', require('./api/passiveSeminar.js').passiveSeminar(io));
app.post('/getPassiveDecision', require('./api/passiveSeminar.js').getPassiveDecision(io));
app.post('/setPassiveDecision', require('./api/passiveSeminar.js').setPassiveDecision(io));
app.post('/importResult', require('./api/passiveSeminar.js').importResult(io));
app.post('/runSeminar', require('./api/kernelSeminar.js').runSeminar(io));




app.post('/contract');
app.post('/contractDetails');
app.post('/producerDecision',require('./api/models/producerDecision.js').updateProducerDecision(io));
app.post('/retailerDecision',require('./api/models/retailerDecision.js').updateRetailerDecision(io));

app.post('/updateContractDetails',require('./api/models/contract.js').updateContractDetails(io));

//add Seminar
app.post('/addSeminar',require('./api/models/seminar.js').addSeminar);
app.post('/setCurrentPeriod', require('./api/models/seminar.js').setCurrentPeriod);

app.get('/producerDecision/:producerID/:period/:seminar',require('./api/models/producerDecision.js').getAllProducerDecision);
app.get('/producerProducts/:producerID/:period/:seminar/:categoryID',require('./api/models/producerDecision.js').getProducerProductList);
app.get('/producerBrands/:producerID/:period/:seminar',require('./api/models/producerDecision.js').getProducerBrandList);
//getProducer variants Info by brandName
app.get('/getProductInfo/:producerID/:period/:seminar/:brandName',require('./api/models/producerDecision.js').getProductInfo);

app.get('/retailerDecision/:retailerID/:period/:seminar',require('./api/models/retailerDecision.js').getAllRetailerDecision); 

app.get('/retailerProducts/:retailerID/:period/:seminar/:categoryID',require('./api/models/retailerDecision.js').getRetailerProductList);
//seminar List
app.get('/seminarList',require('./api/models/seminar.js').getSeminarList);
//update seminar
app.post('/updateSeminar',require('./api/models/seminar.js').updateSeminar);

app.get('/contracts/:seminar/:contractUserID',require('./api/models/contract.js').getContractList);
//get contractDetail
app.get('/contractDetail/:contractCode/:userType/:negotiationItem/:brandName',require('./api/models/contract.js').getContractDetail);
app.post('/compareContractDetailsAndUpdateIsVerified', require('./api/models/contract.js').compareContractDetailsAndUpdateIsVerified);
app.post('/copyProposal', require('./api/models/contract.js').copyProposal);
//add new contract
app.post('/addContract',require('./api/models/contract.js').addContract(io));
//duplicate
app.post('/duplicateContract',require('./api/models/contract.js').duplicateContract(io));
app.get('/variantHistoryInfo/:seminar/:period/:parentBrandName/:varName',require('./api/models/variantHistoryInfo').getVariantHistory);
//get brandHistory getPeriodBrandHistory
app.get('/brandHistoryInfo/:seminar/:period/:brandName',require('./api/models/brandHistoryInfo.js').getBrandHistory);
app.get('/brandHistoryInfo/:seminar/:period',require('./api/models/brandHistoryInfo.js').getPeriodBrandHistory);

app.get('/producerBrandDecision/:producerID/:period/:seminar/:brandName',require('./api/models/producerDecision.js').getBrandHistory);
//retailer get producerDecision
app.get('/getProducerDecisionByVar/:producerID/:period/:seminar/:brandName/:varName',require('./api/models/producerDecision.js').retailerGetProducerDecision);
//retailer get retailerDecision
app.get('/getRetailerDecisionByVar/:retailerID/:period/:seminar/:brandName/:varName',require('./api/models/retailerDecision.js').retailerGetRetailerDecision);
app.get('/companyHistoryInfo/:seminar/:period/:userType/:userID',require('./api/models/companyHistoryInfo.js').getCompanyHistory);
//get companyHistory
app.get('/producerCompanyDecision/:producerID/:period/:seminar/:categoryID',require('./api/models/producerDecision.js').getCompanyHistory)
app.get('/quarterHistoryInfo/:seminar/:period',require('./api/models/quarterHistoryInfo.js').getQuarterHistory);

app.get('/marketReport', require('./api/models/marketReport.js').getMarketReport);
app.get('/lineChart', require('./api/models/lineChart.js').getLineChart);
app.get('/perceptionMaps/:seminar/:period',require('./api/models/perceptionMap.js').getMapByParams);
app.get('/finReport', require('./api/models/finReport.js').getFinReport);
app.get('/volReport', require('./api/models/volReport.js').getVolReport);

//export data to excel
app.get('/excel',require('./api/utils/excel.js').testGet);
app.post('/excel',require('./api/utils/excel.js').testPost);

//producer check
app.get('/productionResult/:seminar/:period/:producerID/:brandName/:varName',require('./api/models/producerDecision.js').getProductionResult);
app.get('/producerCurrentDecision/:seminar/:period/:producerID/:brandName/:varName',require('./api/models/producerDecision.js').getProducerCurrentDecision);
app.get('/checkProducerProduct/:seminar/:period/:producerID/:categoryID/:checkType/:brandName/:varName',require('./api/models/producerDecision.js').checkProducerProduct);
app.get('/producerExpend/:seminar/:period/:producerID/:brandName/:location/:additionalIdx',require('./api/models/producerDecision.js').getProducerExpend);

app.get('/checkContractLock/:contractCode',require('./api/models/contract.js').checkContractLock);
app.get('/producerVariantBM/:seminar/:period/:producerID/:categoryID/:brandName/:varName',require('./api/models/producerDecision.js').getProducerVariantBM);
//retailer check
app.get('/retailerExpend/:seminar/:period/:retailerID/:marketID/:location/:additionalIdx',require('./api/models/retailerDecision.js').getRetailerExpend);
app.get('/retailerShelfSpace/:seminar/:period/:retailerID/:marketID/:categoryID/:brandName/:varName',require('./api/models/retailerDecision.js').getRetailerShelfSpace);
app.get('/checkRetailerProduct/:seminar/:period/:retailerID/:categoryID/:checkType/:brandName/:varName',require('./api/models/retailerDecision.js').checkRetailerProduct);
app.get('/retailerCurrentDecision/:seminar/:period/:retailerID/:brandName/:varName',require('./api/models/retailerDecision.js').getRetailerCurrentDecision);

//special calculate API
app.post('/getCurrentUnitCost', require('./api/utils/unitCost').getCurrentUnitCost);
app.get('/currentPeriod/:seminar',require('./api/models/seminar.js').getCurrentPeriod);

//seminar 
app.get('/checkProducerDecision/:seminar/:producerID',require('./api/models/seminar.js').checkProducerDecision);
app.post('/submitDecision',require('./api/models/seminar.js').submitDecision(io));

app.post('/deleteOrderData',require('./api/models/retailerDecision.js').deleteOrderData(io));
app.post('/deleteDetailData',require('./api/models/contract.js').deleteContractDetailData(io));

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
