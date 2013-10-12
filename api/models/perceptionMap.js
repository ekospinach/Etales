var mongoose = require('mongoose'),
	http = require('http'),
  config = require('../../config.js');

var perceptionMapSchema = mongoose.Schema({
	seminar : String,
	fileName : String,
	latestHistoryPeriod : Number,
	pageCollection : [pageCollectionSchema]
})

var pageCollectionSchema = mongoose.Schema({
		titleENG : String,
		titleCHN : String,
		titleRUS : String,
		category : String,
		market : String,
		brandCollection : [brandCollectionSchema]	
})

var brandCollectionSchema = mongoose.Schema({
		brandName : String,
		color : Number,
		easeOfUsePerception : {
			labelENG : String,
			labelCHN : String,
			Value : String,
		},
		qualityPerception : {
			labelENG : String,
			labelCHN : String,
			Value : String,
		},
		pricePerception : {
			labelENG : String,
			labelCHN : String,
			Value : String,
		},
		marketShare : {
			labelENG : String,
			labelCHN : String,
			Value : String,
		},
		brandAwareness : {
			labelENG : String,
			labelCHN : String,
			Value : String,
		},
		visibilityShare : {
			labelENG : String,
			labelCHN : String,
			Value : String,
		}
})

var perceptionMapModel = mongoose.model('perceptionMap', perceptionMapSchema);

exports.addPerceptionMaps = function(options){
  return function(req, res, next){
    var startFrom = req.body.startFrom,
        endWith = req.body.endWith;
        fileName = req.body.fileName; 

    (function sendRequest(currentPeriod){        
      if (options.uploadFileAbsDir === '') fileName = ''; 
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + options.uploadFileAbsDir + fileName
      };
      http.get(reqOptions, function(response) {
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
          console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
          if ( response.statusCode === (404 || 500) ) next(new Error('Read beyound result file, data of period ' + currentPeriod + ' do not exist.'));
          else{
            try {
              var perceptionMap = JSON.parse(data);
            } catch(e) {
              next(new Error('JSON.parse failed'));
              console.log(e);
            }
          }           
          if (!perceptionMap) return; 
   
          perceptionMapModel.update({fileName: req.body.fileName, 
                                latestHistoryPeriod: perceptionMap.latestHistoryPeriod},
                                {pageCollection : perceptionMap.pageCollection,
                                seminar : perceptionMap.Seminar},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) next(new Error(err));
                                  console.log('PerceptionMap generated: the number of updated documents was %d', numberAffected);
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     console.log('PerceptionMap generate done. from period' + startFrom + ' to ' + endWith);
                                     res.statusCode = 200;
                                     res.setHeader('Content-Type', 'text/html');
                                     res.end('All done.');             
                                  }
                                });   
        });

      }).on('error', function(e){
        next(new Error('errorFrom addPerceptionMaps: ' + e.message));
      });
    })(endWith);
  }
}

exports.getPerceptionMap = function(req, res, next){
  var queryCondition = {
    fileName : req.query.fileName,
    period : req.query.period,
  }
  console.log(queryCondition);
  perceptionMapModel.findOne({fileName : queryCondition.fileName,
                          latestHistoryPeriod : queryCondition.period},
                          function(err, doc){
                             if(!err){
                                res.header("Content-Type", "application/json; charset=UTF-8");
                                res.statusCode = 200;
                                res.send(doc);
                             } else {
                                next(new Error(err));
                             }
                          });
}

exports.getMapByParams = function(req, res, next){
  var queryCondition = {
    fileName : req.params.fileName,
    period : req.params.period,
  }
  perceptionMapModel.findOne({fileName : queryCondition.fileName,
                          latestHistoryPeriod : queryCondition.period},
                          function(err, doc){
                             if(!err){
                                res.header("Content-Type", "application/json; charset=UTF-8");
                                res.statusCode = 200;
                                //console.log(doc)
                                res.send(doc);
                             } else {
                                next(new Error(err));
                             }
                          });
}