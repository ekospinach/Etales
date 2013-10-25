var path    = require('path'),
  mongoose = require('mongoose'),
  files    = require('./api/models/file.js'),
  express = require('express');
  http = require('http'), 
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  Config = require('./config.js');

  io.sockets.on('connection', function(socket){
    socket.emit('baseChanged',{info: 'DataBase has been update on server side!'});
    socket.on('ferret', function(name, fn){
      fn('服务器端收到:' + name);
    });
  });

  conf = new Config();
  app.use(express.favicon());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/app')));
  app.use(express.logger());

  app.get('/initializationResult');
  app.get('/passiveResult');
  app.get('/kernelResult')

  // app.post('/negotiationDecision');
  // app.post('/producerDecision',require('./api/models/producerDecision.js').addNewProductDecison);
  // app.post('/retailerDecision');

  app.get('/negotiationDecision');
  app.get('/producerDecision/:producerID/:period/:seminar',require('./api/models/producerDecision.js').getAllProducerDecision);
  app.get('/retailerDecision/:retailerID/:period/:seminar',require('./api/models/retailerDecision.js').getAllRetailerDecision); 

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
  
  app.use(express.errorHandler());
  
  port = parseInt(process.env.PORT, 10) || conf.server.port;
  mongoose.connect('mongodb://localhost/EtalesRV');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(response,request) {
        server.listen(port, function () {
            console.log('Server listening on port ' + port);
        });
  });    
