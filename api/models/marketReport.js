var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var marketReportSchema = mongoose.Schema({
    seminar : String,
    fileName : String,
    latestHistoryPeriod : Number,
    titleENG : String,
    titleCHN : String,
    titleRUS : String,
    reportCollection : [reportCollectionSchema]
})

var reportCollectionSchema = mongoose.Schema({
    market : String,
    category : String,
    data : {
      cols : [colsSchema],
      rows : [rowsSchema]
    }   
})
var colsSchema = mongoose.Schema({
    id : String, 
    label: String, 
    labelENG : String,
    labelCHN : String,
    labelRUS : String,
    type: String 
})

var rowsSchema = mongoose.Schema({
     c : [{ 
      v: String,
      f: String
    }],   
})

var marketReportModel = mongoose.model('marketReport',marketReportSchema);

exports.addMarketReports = function(options){
  return function(req, res, next){
    var startFrom = req.body.startFrom,
        endWith = req.body.endWith,
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
              var reportGroup = JSON.parse(data);
            } catch(e) {
              next(new Error('Read result file failed, please only choose existed period.'));
              console.log(e);
            }
          }      
          if (!reportGroup) return; 
          
          (function singleReportUpdate(idx){
            marketReportModel.update({fileName: req.body.fileName, 
                                          latestHistoryPeriod: reportGroup[idx].latestHistoryPeriod,
                                          titleENG: reportGroup[idx].titleENG},
                                          {reportCollection : reportGroup[idx].reportCollection,
                                           titleCHN : reportGroup[idx].titleCHN,
                                           titleRUS : reportGroup[idx].titleRUS,
                                          seminar : reportGroup[idx].Seminar},
                                          {upsert: true},
                                          function(err, numberAffected, raw){
                                            if(err) next(new Error(err));
                                            console.log('MarketReport generated: The number of updated documents was %d', numberAffected);
                                            idx--;  
                                            if (idx >= 0){
                                              singleReportUpdate(idx);
                                            } else {
                                              currentPeriod--;
                                              if (currentPeriod >= startFrom) {
                                                 sendRequest(currentPeriod);
                                              } else {
                                                 console.log('Market reports generate done. from period' + startFrom + ' to ' + endWith);
                                                 res.statusCode = 200;
                                                 res.setHeader('Content-Type', 'text/html');
                                                 res.end('all done.');             
                                              }
                                            }                                               
                                          });   
          })(reportGroup.length-1);
          
        });

      }).on('error', function(e){
        next(new Error('errorFrom addmarketReport' + e.message));
      });
    })(endWith);
  }
}
  
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
              var infoGroup = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!infoGroup) return; 

//          console.log(util.inspect(infoGroup, {depth:null}));
          (function singleUpdate(idx){
            marketReportModel.update({seminar: infoGroup[idx].Seminar, 
                                          latestHistoryPeriod: infoGroup[idx].latestHistoryPeriod,
                                          titleENG: infoGroup[idx].titleENG},
                                          {reportCollection : infoGroup[idx].reportCollection,
                                           titleCHN : infoGroup[idx].titleCHN,
                                           titleRUS : infoGroup[idx].titleRUS},
                                    {upsert: true},
                                    function(err, numberAffected, raw){
                                      if(err) deferred.reject({msg:err, options: options});       
                                      idx--;
                                      if(idx >= 0){
                                        singleUpdate(idx);
                                      } else {
                                        currentPeriod--;
                                        if (currentPeriod >= startFrom) {
                                           sendRequest(currentPeriod);
                                        } else {
                                           deferred.resolve({msg:'Market reports(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                        }
                                      }                           
                                    });   

          })(infoGroup.length-1);
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom Market reports import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}


exports.getMarketReport = function(req, res, next){
  var queryCondition = {
    //fileName : req.query.fileName,
    seminar : req.query.seminar,
    period : req.query.period,
    titleENG : req.query.titleENG,
  }
  console.log(util.inspect(queryCondition, {depth : null}));
  marketReportModel.findOne({seminar : queryCondition.seminar,
                          latestHistoryPeriod : queryCondition.period,
                          titleENG : queryCondition.titleENG},
                          function(err, doc){
                             if(!err){
                                res.header("Content-Type", "application/json; charset=UTF-8");
                                res.statusCode = 200;
                                console.log("@@@@@@@@");
                                res.send(doc);
                             } else {
                                next(new Error(err));
                             }
                          });
}
