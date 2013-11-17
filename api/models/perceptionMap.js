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

exports.addInfos = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
          console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else {
            try {
              var singleInfo = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!singleInfo) return; 
//          console.log(util.inspect(singleInfo, {depth:null}));            
          perceptionMapModel.update({seminar: singleInfo.Seminar, 
                                latestHistoryPeriod: singleInfo.latestHistoryPeriod},
                                {pageCollection : singleInfo.pageCollection},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                    
                                    currentPeriod--;
                                    if (currentPeriod >= startFrom) {
                                       sendRequest(currentPeriod);
                                    } else {
                                       deferred.resolve({msg:'Perception Map(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                    }
                                });   

         
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom Perception Map import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

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
    seminar : req.params.seminar,
    period : req.params.period,
  }
  perceptionMapModel.findOne({seminar : queryCondition.seminar,
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