module.exports = function(app, io){
	// Admin process(init, run, passive, handle seminars) 
	app.post('/initialiseSeminar',                                               require('./../api/initialiseSeminar.js').initialiseSeminar(io));
	app.post('/initialiseSeminarRetailer',                                       require('./../api/initialiseSeminar.js').initialiseSeminarRetailer(io));
	app.post('/passiveSeminar',                                                  require('./../api/passiveSeminar.js').passiveSeminar(io));
	app.post('/getPassiveDecision',                                              require('./../api/passiveSeminar.js').getPassiveDecision(io));
	app.post('/setPassiveDecision',                                              require('./../api/passiveSeminar.js').setPassiveDecision(io));
	app.post('/importResult',                                                    require('./../api/passiveSeminar.js').importResult(io));
	app.post('/runSeminar',                                                      require('./../api/kernelSeminar.js').runSeminar(io));
	
	app.post('/addSeminar',                                                      require('./../api/models/seminar.js').addSeminar);
	app.post('/submitOrder',                                                     require('./../api/models/seminar.js').submitOrder);
	app.post('/deleteSeminar',                                                   require('./../api/models/seminar.js').deleteSeminar);
	app.post('/duplicateSeminar',                                                require('./../api/models/seminar.js').duplicateSeminar);
	app.post('/setCurrentPeriod',                                                require('./../api/models/seminar.js').setCurrentPeriod);
	app.post('/updateSeminar',                                                   require('./../api/models/seminar.js').updateSeminar);
	app.get('/seminarList',                                                      require('./../api/models/seminar.js').getSeminarList);
	
	app.get('/addOneQuarterExogenousData',                                       require('./../api/models/BG_oneQuarterExogenousData.js').addOneQuarterExogenousData);
	app.get('/getOneQuarterExogenousData/:seminar/:period/:categoryID/:marketID',require('./../api/models/BG_oneQuarterExogenousData.js').getOneQuarterExogenousData);
	
	//seminar 
	app.get('/checkProducerDecision/:seminar/:period/:producerID',               require('./../api/models/seminar.js').checkProducerDecision);
	app.post('/submitPortfolioDecision',                                         require('./../api/models/seminar.js').submitPortfolioDecision(io));
	app.post('/submitFinalDecision',                                             require('./../api/models/seminar.js').submitFinalDecision(io));
	app.post('/deleteOrderData',                                                 require('./../api/models/retailerDecision.js').deleteOrderData(io));
	
	//export data to excel
	//app.get('/excel',                                                          require('./../api/utils/excel.js').testGet);
	app.post('/excel',                                                           require('./../api/utils/excel.js').exportExcel);


};
