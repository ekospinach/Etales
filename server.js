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
// var path    = require('path'),

// <<<<<<< HEAD
// mongoose = require('mongoose'),
// files    = require('./api/models/file.js'),
// express = require('express');
// http = require('http'), 
// app = express(),
// server = http.createServer(app),
// io = require('socket.io').listen(server),
// Config = require('./config.js'),
// passport = require('passport'),
// flash = require('connect-flash'),
// userRoles = require('./app/js/routingConfig').userRoles,
// accessLevels = require('./app/js/routingConfig').accessLevels,
// util = require('util');

// //process.env.NODE_ENV = 'production';
// conf = new Config();

// //backend view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(express.cookieParser());
// app.use(express.favicon());
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());

// app.use(express.cookieSession({
//   secret : process.env.COOKIE_SECRET || "Superdupersecret"
// }));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(app.router);
// app.use(express.static(path.join(__dirname, '/app')));
// app.use(express.logger());


// app.get('/feedbackENG', function(req, res, next){
// 	res.render('feedbackENG.ejs', {seminar : req.query.seminar, 
// 								   period : req.query.period});
// });

// //user authenticate
// passport.use(require('./api/models/seminar').localStrategy);
// passport.serializeUser(require('./api/models/seminar').serializeUser);
// passport.deserializeUser(require('./api/models/seminar').deserializeUser);
// app.post('/login', require('./api/auth').login);
// app.post('/logout', require('./api/auth').logout);

// app.post('/initialiseSeminar', require('./api/initialiseSeminar.js').initialiseSeminar(io));
// app.post('/initialiseSeminarRetailer',require('./api/initialiseSeminar.js').initialiseSeminarRetailer(io));
// app.post('/passiveSeminar', require('./api/passiveSeminar.js').passiveSeminar(io));
// app.post('/getPassiveDecision', require('./api/passiveSeminar.js').getPassiveDecision(io));
// app.post('/setPassiveDecision', require('./api/passiveSeminar.js').setPassiveDecision(io));
// app.post('/importResult', require('./api/passiveSeminar.js').importResult(io));
// app.post('/runSeminar', require('./api/kernelSeminar.js').runSeminar(io));

// app.post('/producerDecision',require('./api/models/producerDecision.js').updateProducerDecision(io));
// app.post('/retailerDecision',require('./api/models/retailerDecision.js').updateRetailerDecision(io));
// //app.post('/setContractLock',require('./api/models/contract.js').setContractLock(io));

// //app.post('/updateContractDetails',require('./api/models/contract.js').updateContractDetails(io));

// //add Seminar
// app.post('/addSeminar',require('./api/models/seminar.js').addSeminar);
// app.post('/submitOrder',require('./api/models/seminar.js').submitOrder);
// app.post('/deleteSeminar',require('./api/models/seminar.js').deleteSeminar);
// app.post('/duplicateSeminar', require('./api/models/seminar.js').duplicateSeminar);
// app.post('/setCurrentPeriod', require('./api/models/seminar.js').setCurrentPeriod);

// app.get('/producerDecision/:producerID/:period/:seminar',require('./api/models/producerDecision.js').getAllProducerDecision);
// app.get('/producerProducts/:producerID/:period/:seminar/:categoryID',require('./api/models/producerDecision.js').getProducerProductList);
// app.get('/producerBrands/:producerID/:period/:seminar',require('./api/models/producerDecision.js').getProducerBrandList);
// //getProducer variants Info by brandName
// app.get('/getProductInfo/:producerID/:period/:seminar/:brandName',require('./api/models/producerDecision.js').getProductInfo);

// app.get('/retailerDecision/:retailerID/:period/:seminar',require('./api/models/retailerDecision.js').getAllRetailerDecision); 

// app.get('/retailerProducts/:retailerID/:period/:seminar/:categoryID',require('./api/models/retailerDecision.js').getRetailerProductList);
// //seminar List
// app.get('/seminarList',require('./api/models/seminar.js').getSeminarList);
// //update seminar
// app.post('/updateSeminar',require('./api/models/seminar.js').updateSeminar);

// //app.get('/contracts/:seminar/:period/:contractUserID',require('./api/models/contract.js').getContractList);
// //get contractDetail
// //app.get('/contractDetail/:contractCode/:userType/:negotiationItem/:brandName',require('./api/models/contract.js').getContractDetail);
// //app.post('/compareContractDetailsAndUpdateIsVerified', require('./api/models/contract.js').compareContractDetailsAndUpdateIsVerified);
// //app.post('/copyProposal', require('./api/models/contract.js').copyProposal);
// //add new contract
// app.post('/addContract',require('./api/models/contract.js').addContract(io));
// app.post('/addContractDetails',require('./api/models/contract.js').addContractDetails(io));
// app.get('/getContractDetails/:contractCode',require('./api/models/contract.js').getContractDetails);
// app.get('/getNegotiationExpend/:contractCode/:parentBrandName/:variantName',require('./api/models/contract.js').getNegotiationExpend);
// app.get('/checkContractDetails/:contractCode/:parentBrandName/:variantName/:location',require('./api/models/contract.js').checkContractDetails);
// app.get('/checkVolume/:contractCode/:parentBrandName/:variantName',require('./api/models/contract.js').checkVolume);
// app.get('/checkSalesTargetVolume/:contractCode/:parentBrandName/:variantName',require('./api/models/contract.js').checkSalesTargetVolume);


// app.post('/updateContractDetails',require('./api/models/contract.js').updateContractDetails(io));

// app.post('/removeContract', require('./api/models/contract.js').removeContract(io));
// app.post('/removeContractDetailsByContractCode', require('./api/models/contract.js').removeContractDetailsByContractcode(io));
// //duplicate
// //app.post('/duplicateContract',require('./api/models/contract.js').duplicateContract(io));
// app.get('/variantHistoryInfo/:seminar/:period/:parentBrandName/:varName',require('./api/models/variantHistoryInfo').getVariantHistory);
// //get brandHistory getPeriodBrandHistory
// app.get('/brandHistoryInfo/:seminar/:period/:brandName',require('./api/models/brandHistoryInfo.js').getBrandHistory);
// app.get('/brandHistoryInfo/:seminar/:period',require('./api/models/brandHistoryInfo.js').getPeriodBrandHistory);

// app.get('/producerBrandDecision/:producerID/:period/:seminar/:brandName',require('./api/models/producerDecision.js').getBrandHistory);
// //retailer get producerDecision
// app.get('/getProducerDecisionByVar/:producerID/:period/:seminar/:brandName/:varName',require('./api/models/producerDecision.js').retailerGetProducerDecision);
// //retailer get retailerDecision
// app.get('/getRetailerDecisionByVar/:retailerID/:period/:seminar/:brandName/:varName',require('./api/models/retailerDecision.js').retailerGetRetailerDecision);
// app.get('/companyHistoryInfo/:seminar/:period/:userType/:userID',require('./api/models/companyHistoryInfo.js').getCompanyHistory);
// //get companyHistory
// app.get('/producerCompanyDecision/:producerID/:period/:seminar/:categoryID',require('./api/models/producerDecision.js').getCompanyHistory)
// app.get('/quarterHistoryInfo/:seminar/:period',require('./api/models/quarterHistoryInfo.js').getQuarterHistory);

// app.get('/marketReport', require('./api/models/marketReport.js').getMarketReport);
// app.get('/lineChart', require('./api/models/lineChart.js').getLineChart);
// app.get('/perceptionMaps/:seminar/:period',require('./api/models/perceptionMap.js').getMapByParams);
// app.get('/finReport', require('./api/models/finReport.js').getFinReport);
// app.get('/volReport', require('./api/models/volReport.js').getVolReport);

// //export data to excel
// //app.get('/excel',require('./api/utils/excel.js').testGet);
// app.post('/excel',require('./api/utils/excel.js').exportExcel);

// //producer check
// app.get('/productionResult/:seminar/:period/:producerID/:brandName/:varName',require('./api/models/producerDecision.js').getProductionResult);
// app.get('/producerCurrentDecision/:seminar/:period/:producerID/:brandName/:varName',require('./api/models/producerDecision.js').getProducerCurrentDecision);
// app.get('/checkProducerProduct/:seminar/:period/:producerID/:categoryID/:checkType/:brandName/:varName',require('./api/models/producerDecision.js').checkProducerProduct);
// app.get('/producerExpend/:seminar/:period/:producerID/:brandName/:location/:additionalIdx',require('./api/models/producerDecision.js').getProducerExpend);

// app.get('/checkContract/:contractCode',require('./api/models/contract.js').checkContract);
// app.get('/producerVariantBM/:seminar/:period/:producerID/:categoryID/:brandName/:varName',require('./api/models/producerDecision.js').getProducerVariantBM);
// //retailer check
// app.get('/retailerExpend/:seminar/:period/:retailerID/:marketID/:location/:additionalIdx',require('./api/models/retailerDecision.js').getRetailerExpend);
// app.get('/retailerShelfSpace/:seminar/:period/:retailerID/:marketID/:categoryID/:brandName/:varName',require('./api/models/retailerDecision.js').getRetailerShelfSpace);
// app.get('/checkRetailerProduct/:seminar/:period/:retailerID/:categoryID/:checkType/:brandName/:varName',require('./api/models/retailerDecision.js').checkRetailerProduct);
// app.get('/retailerCurrentDecision/:seminar/:period/:retailerID/:brandName/:varName',require('./api/models/retailerDecision.js').getRetailerCurrentDecision);

// //special calculate API
// app.post('/getCurrentUnitCost', require('./api/utils/unitCost').getCurrentUnitCost);
// app.get('/currentPeriod/:seminar',require('./api/models/seminar.js').getCurrentPeriod);
// app.get('/getScrplSales/:seminar/:period/:producerID/:categoryID',require('./api/models/SCR_consolidatedProfitAndLoss.js').getScrplSales);

// app.get('/RCR-consolidatedProfitAndLoss/:seminar/:period/:retailerID',require('./api/models/RCR_consolidatedProfitAndLoss.js').getRCR_consolidatedProfitAndLoss);

// app.get('/getRcrplSales/:seminar/:period/:retailerID/:categoryID/:marketID',require('./api/models/RCR_consolidatedProfitAndLoss.js').getRcrplSales);
// app.get('/getSalesVolume/:seminar/:period/:retailerID/:categoryID',require('./api/models/RCR_consolidatedProfitAndLoss.js').getSalesVolume);
// app.get('/getMarketSize/:seminar/:period/:retailerID/:categoryID',require('./api/models/RCR_consolidatedProfitAndLoss.js').getMarketSize);

// //seminar 
// app.get('/checkProducerDecision/:seminar/:period/:producerID',require('./api/models/seminar.js').checkProducerDecision);
// app.post('/submitPortfolioDecision',require('./api/models/seminar.js').submitPortfolioDecision(io));
// app.post('/submitFinalDecision',require('./api/models/seminar.js').submitFinalDecision(io));
// app.post('/deleteOrderData',require('./api/models/retailerDecision.js').deleteOrderData(io));

// //add generalReport record
// app.get('/addCrossSegmentSales',require('./api/models/GR_crossSegmentSales.js').addCrossSegmentSales);
// app.get('/addEmallPrices',require('./api/models/GR_emallPrices.js').addEmallPrices);
// app.get('/addMarketSales',require('./api/models/GR_marketSales.js').addMarketSales);
// app.get('/addMarketShare',require('./api/models/GR_marketShare.js').addMarketShare);
// app.get('/addPerformanceHighlights',require('./api/models/GR_performanceHighlights.js').addPerformanceHighlights);
// app.get('/addProductPortfolio',require('./api/models/GR_productPortfolio.js').addProductPortfolio);
// app.get('/addSegmentLeadership',require('./api/models/GR_segmentLeadership.js').addSegmentLeadership);

// //get generalReport record
// app.get('/crossSegmentSales/:seminar/:period',require('./api/models/GR_crossSegmentSales.js').getCrossSegmentSales);
// app.get('/emallPrices/:seminar/:period',require('./api/models/GR_emallPrices.js').getEmallPrices);
// app.get('/marketSales/:seminar/:period',require('./api/models/GR_marketSales.js').getMarketSales);
// app.get('/marketShare/:seminar/:period',require('./api/models/GR_marketShare.js').getMarketShare);
// app.get('/performanceHighlights/:seminar/:period',require('./api/models/GR_performanceHighlights.js').getPerformanceHighlights);
// app.get('/productPortfolio/:seminar/:period',require('./api/models/GR_productPortfolio.js').getProductPortfolio);
// app.get('/segmentLeadership/:seminar/:period',require('./api/models/GR_segmentLeadership.js').getSegmentLeadership);

// //add producer report record
// app.get('/addSCR-consolidatedProfitAndLoss',require('./api/models/SCR_consolidatedProfitAndLoss.js').addSCR_consolidatedProfitAndLoss);
// app.get('/addSCR-channelsProfitability',require('./api/models/SCR_channelsProfitability.js').addSCR_channelsProfitability);
// app.get('/addSCR-inventoryVolumes',require('./api/models/SCR_inventoryVolumes.js').addSCR_inventoryVolumes);
// app.get('/addSCR-keyPerformanceIndicators',require('./api/models/SCR_keyPerformanceIndicators.js').addSCR_keyPerformanceIndicators);
// app.get('/addSCR-negotiations',require('./api/models/SCR_negotiations.js').addSCR_negotiations);
// app.get('/addSCR-sharesCrossSegment',require('./api/models/SCR_sharesCrossSegment.js').addSCR_sharesCrossSegment);

// //get producer report record 
// app.get('/SCR-consolidatedProfitAndLoss/:seminar/:period/:producerID',require('./api/models/SCR_consolidatedProfitAndLoss.js').getSCR_consolidatedProfitAndLoss);
// app.get('/SCR-channelsProfitability/:seminar/:period/:producerID',require('./api/models/SCR_channelsProfitability.js').getSCR_channelsProfitability);
// app.get('/SCR-inventoryVolumes/:seminar/:period/:producerID',require('./api/models/SCR_inventoryVolumes.js').getSCR_inventoryVolumes);
// app.get('/SCR-keyPerformanceIndicators/:seminar/:period/:producerID',require('./api/models/SCR_keyPerformanceIndicators.js').getSCR_keyPerformanceIndicators);
// app.get('/SCR-negotiations/:seminar/:period/:producerID',require('./api/models/SCR_negotiations.js').getSCR_negotiations);
// app.get('/SCR-sharesCrossSegment/:seminar/:period/:producerID',require('./api/models/SCR_sharesCrossSegment.js').getSCR_sharesCrossSegment);

// //add retailer report record
// app.get('/addRCR-consolidatedProfitAndLoss',require('./api/models/RCR_consolidatedProfitAndLoss.js').addRCR_consolidatedProfitAndLoss);
// app.get('/addRCR-inventoryVolumes',require('./api/models/RCR_inventoryVolumes.js').addRCR_inventoryVolumes);
// app.get('/addRCR-keyPerformanceIndicators',require('./api/models/RCR_keyPerformanceIndicators.js').addRCR_keyPerformanceIndicators);
// app.get('/addRCR-negotiations',require('./api/models/RCR_negotiations.js').addRCR_negotiations);
// app.get('/addRCR-profitabilityBySupplier',require('./api/models/RCR_profitabilityBySupplier.js').addRCR_profitabilityBySupplier);
// app.get('/addRCR-sharesCrossSegment',require('./api/models/RCR_sharesCrossSegment.js').addRCR_sharesCrossSegment);

// //get retailer report record
// app.get('/RCR-consolidatedProfitAndLoss/:seminar/:period/:retailerID',require('./api/models/RCR_consolidatedProfitAndLoss.js').getRCR_consolidatedProfitAndLoss);
// app.get('/RCR-inventoryVolumes/:seminar/:period/:retailerID',require('./api/models/RCR_inventoryVolumes.js').getRCR_inventoryVolumes);
// app.get('/RCR-keyPerformanceIndicators/:seminar/:period/:retailerID',require('./api/models/RCR_keyPerformanceIndicators.js').getRCR_keyPerformanceIndicators);
// app.get('/RCR-negotiations/:seminar/:period/:retailerID',require('./api/models/RCR_negotiations.js').getRCR_negotiations);
// app.get('/RCR-profitabilityBySupplier/:seminar/:period/:retailerID',require('./api/models/RCR_profitabilityBySupplier.js').getRCR_profitabilityBySupplier);
// app.get('/RCR-sharesCrossSegment/:seminar/:period/:retailerID',require('./api/models/RCR_sharesCrossSegment.js').getRCR_sharesCrossSegment);

// app.get('/addOneQuarterExogenousData',require('./api/models/BG_oneQuarterExogenousData.js').addOneQuarterExogenousData);
// app.get('/getOneQuarterExogenousData/:seminar/:period/:categoryID/:marketID',require('./api/models/BG_oneQuarterExogenousData.js').getOneQuarterExogenousData);
// //add market report
// app.get('/addMR-awarenessEvolution',require('./api/models/MR_awarenessEvolution.js').addMR_awarenessEvolution);
// app.get('/addMR-sharesCrossSegment',require('./api/models/MR_sharesCrossSegment.js').addMR_sharesCrossSegment);
// app.get('/addMR-salesCrossSegment',require('./api/models/MR_salesCrossSegment.js').addMR_salesCrossSegment);
// app.get('/addMR-netMarketPrices',require('./api/models/MR_netMarketPrices.js').addMR_netMarketPrices);
// app.get('/addMR-pricePromotions',require('./api/models/MR_pricePromotions.js').addMR_pricePromotions);
// app.get('/addMR-suppliersIntelligence',require('./api/models/MR_suppliersIntelligence.js').addMR_suppliersIntelligence);
// app.get('/addMR-variantPerceptionEvolution',require('./api/models/MR_variantPerceptionEvolution.js').addMR_variantPerceptionEvolution);
// app.get('/addMR-retailerPerceptionEvolution',require('./api/models/MR_retailerPerceptionEvolution.js').addMR_retailerPerceptionEvolution);
// app.get('/addMR-retailersIntelligence',require('./api/models/MR_retailersIntelligence.js').addMR_retailersIntelligence);
// app.get('/addMR-forecasts',require('./api/models/MR_forecasts.js').addMR_forecasts);
// //get market report
// app.get('/getMR-awarenessEvolution/:seminar/:period',require('./api/models/MR_awarenessEvolution.js').getMR_awarenessEvolution);
// app.get('/getMR-sharesCrossSegment/:seminar/:period',require('./api/models/MR_sharesCrossSegment.js').getMR_sharesCrossSegment);
// app.get('/getMR-salesCrossSegment/:seminar/:period',require('./api/models/MR_salesCrossSegment.js').getMR_salesCrossSegment);
// app.get('/getMR-netMarketPrices/:seminar/:period',require('./api/models/MR_netMarketPrices.js').getMR_netMarketPrices);
// app.get('/getMR-pricePromotions/:seminar/:period',require('./api/models/MR_pricePromotions.js').getMR_pricePromotions);
// app.get('/getMR-suppliersIntelligence/:seminar/:period',require('./api/models/MR_suppliersIntelligence.js').getMR_suppliersIntelligence);
// app.get('/getMR-variantPerceptionEvolution/:seminar/:period',require('./api/models/MR_variantPerceptionEvolution.js').getMR_variantPerceptionEvolution);
// app.get('/getMR-retailerPerceptionEvolution/:seminar/:period',require('./api/models/MR_retailerPerceptionEvolution.js').getMR_retailerPerceptionEvolution);
// app.get('/getMR-retailersIntelligence/:seminar/:period',require('./api/models/MR_retailersIntelligence.js').getMR_retailersIntelligence);
// app.get('/getMR-forecasts/:seminar/:period',require('./api/models/MR_forecasts.js').getMR_forecasts);


// app.use(express.errorHandler());

// port = parseInt(process.env.PORT, 10) || conf.server.port;
// mongoose.connect('mongodb://localhost/Etales');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function(response,request) {
//       server.listen(port, function () {
//           console.log('Server listening on port ' + port);
//       });
// });    
// =======
// 	mongoose = require('mongoose'),
// 	express = require('express'),
// 	http = require('http'), 
// 	app = express(),
// 	server = http.createServer(app),
// 	io = require('socket.io').listen(server),
// 	Config = require('./config.js'),
// 	passport = require('passport'),
// 	flash = require('connect-flash'),
// 	userRoles = require('./app/js/routingConfig').userRoles,
// 	accessLevels = require('./app/js/routingConfig').accessLevels,
// 	util = require('util');

// 	//process.env.NODE_ENV = 'production';
// 	conf = new Config();

// 	//backend view engine setup
// 	app.set('views', path.join(__dirname, 'views'));
// 	app.set('view engine', 'ejs');

// 	app.use(express.cookieParser());
// 	app.use(express.favicon());
// 	app.use(express.json());
// 	app.use(express.urlencoded());
// 	app.use(express.methodOverride());

// 	app.use(express.cookieSession({
// 	  secret : process.env.COOKIE_SECRET || "Superdupersecret"
// 	}));
// 	app.use(flash());
// 	app.use(passport.initialize());
// 	app.use(passport.session());

// 	app.use(app.router);
// 	app.use(express.static(path.join(__dirname, '/app')));
// 	app.use(express.logger());

// 	app.get('/feedbackENG', function(req, res, next){
// 		res.render('feedbackENG.ejs', {seminar : req.query.seminar, 
// 									   period : req.query.period});
// 	});

// 	//user authenticate
// 	passport.use(require('./api/models/seminar').localStrategy);
// 	passport.serializeUser(require('./api/models/seminar').serializeUser);
// 	passport.deserializeUser(require('./api/models/seminar').deserializeUser);
// 	app.post('/login', require('./api/auth').login);
// 	app.post('/logout', require('./api/auth').logout);

// 	require('./routes/routesDecision')(app, io);
// 	require('./routes/routesAdmin')(app, io);
// 	require('./routes/routesReport')(app, io);

// 	app.use(express.errorHandler());

// 	port = parseInt(process.env.PORT, 10) || conf.server.port;
// 	mongoose.connect('mongodb://localhost/Etales');
// 	var db = mongoose.connection;
// 	db.on('error', console.error.bind(console, 'connection error:'));
// 	db.once('open', function(response,request) {
// 	      server.listen(port, function () {
// 	          console.log('Server listening on port ' + port);
// 	      });
// 	});    
// >>>>>>> 10b75d09c21208900580865cfde0ff096feff588
