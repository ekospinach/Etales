module.exports = function(app, io){
	// Admin process(init, run, passive, handle seminars) 
	app.post('/initialiseSeminar',                                               require('./../api/initialiseSeminar.js').initialiseSeminar(io));
	app.post('/initialiseSeminarRetailer',                                       require('./../api/initialiseSeminar.js').initialiseSeminarRetailer(io));
	app.post('/initialiseExtendedFeedbackSlides',                                require('./../api/initialiseSeminar.js').initialiseExtendedFeedbackSlides(io));
	app.post('/passiveSeminar',                                                  require('./../api/passiveSeminar.js').passiveSeminar(io));
	app.post('/getPassiveDecision',                                              require('./../api/passiveSeminar.js').getPassiveDecision(io));
	app.post('/setPassiveDecision',                                              require('./../api/passiveSeminar.js').setPassiveDecision(io));
	app.post('/importResult',                                                    require('./../api/passiveSeminar.js').importResult(io));
	app.post('/runSeminar',                                                      require('./../api/kernelSeminar.js').runSeminar(io));
	
	app.post('/addSeminar',                                                      require('./../api/models/seminar.js').addSeminars);
//	app.post('/addNewSeminar',                                                      require('./../api/models/seminar.js').addNewSeminar);

	app.post('/deleteSeminar',                                                   require('./../api/models/seminar.js').deleteSeminar);
	app.post('/duplicateSeminar',                                                require('./../api/models/seminar.js').duplicateSeminar);
	app.post('/updateSeminar',                                                   require('./../api/models/seminar.js').updateSeminar(io));
	app.post('/setCurrentPeriod',                                                require('./../api/models/seminar.js').setCurrentPeriod(io));
	app.get('/seminarList',                                                      require('./../api/models/seminar.js').getSeminarList);
	
	//getPlayerReportOrder
	app.get('/getPlayerReportOrder/:seminar/:period/:userType/:playerID',		 require('./../api/models/seminar.js').getPlayerReportOrder);
 	//getBudgetExtension
 	app.get('/budgetExtensionAndExceptionalCost/:seminar',						 require('./../api/models/seminar.js').getBudgetExtensionAndExceptionalCost);
	//export data to excel
	//app.get('/excel',                                                          require('./../api/utils/excel.js').testGet);
	app.post('/excel',                                                           require('./../api/utils/excel.js').exportExcel);


};

