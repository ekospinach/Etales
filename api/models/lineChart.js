var mongoose = require('mongoose'),
    http = require('http'),
    _ = require('underscore'),
    util = require('util');

var lineChartSchema = mongoose.Schema({
    seminar : String,
    fileName : String,
    latestHistoryPeriod : Number,
    chartGroup : [chartGroupSchema]
})

var chartGroupSchema = mongoose.Schema({
        groupTitleENG : String,
        groupTitleCHN : String,
        groupTitleRUS : String,
        chartSetCollection : [chartSetCollectionSchema]  
})

var chartSetCollectionSchema = mongoose.Schema({
              titleENG : String,
              titleCHN : String,
              titleRUS : String,
              chartCollection : [chartCollectionSchema]
})

var chartCollectionSchema = mongoose.Schema({
            market : String,
            category : String,
            seriesRole : String,
            data : {
              cols : [colsSchema],
              rows : [rowsSchema]
            }
})

var colsSchema = mongoose.Schema({
    id : String, 
    label: String, 
    type: String  
})

var rowsSchema = mongoose.Schema({
      c : [{ 
        v: String,
        f: String
      }],
})

var lineChartModel = mongoose.model('LineChart',lineChartSchema);

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
          lineChartModel.update({seminar: singleInfo.seminar, 
                                latestHistoryPeriod: singleInfo.latestHistoryPeriod},
                                {chartGroup : singleInfo.chartGroup},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                    
                                    currentPeriod--;
                                    if (currentPeriod >= startFrom) {
                                       sendRequest(currentPeriod);
                                    } else {
                                       deferred.resolve({msg:'Line charts(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                    }
                                });   

         
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom Line charts import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.addLineCharts = function(options) {
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
              var charts= JSON.parse(data);
            } catch(e) {
              next(new Error('JSON.parse failed'));
              console.log(e);
            }
          }           
          if (!charts) return; 
                
          lineChartModel.update({fileName: req.body.fileName, 
                                latestHistoryPeriod: charts.latestHistoryPeriod},
                                {chartGroup : charts.chartGroup,
                                seminar : charts.seminar},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) next(new Error(err));
                                  console.log('LineCharts generated: the number of updated documents was %d', numberAffected);
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     console.log('charts generate done. from period' + startFrom + ' to ' + endWith);
                                     res.statusCode = 200;
                                     res.setHeader('Content-Type', 'text/html');
                                     res.end('all done.');             
                                  }
                                });   
        });

      }).on('error', function(e){
        next(new Error('errorFrom add linearketReport' + e.message));
      });
    })(endWith);
  }
}

exports.getLineChart = function(req, res, next){
  var queryCondition = {
    seminar : req.query.seminar,
    period : req.query.period,
    groupTitleENG : req.query.groupTitleENG
  }
  lineChartModel.findOne({seminar : queryCondition.seminar,
                          latestHistoryPeriod : queryCondition.period},
                          function(err, doc){
                             if(!err){
                                var singleGroup = _.find(doc.chartGroup, function(group){ return group.groupTitleENG == queryCondition.groupTitleENG });                                
                                res.header("Content-Type", "application/json; charset=UTF-8");                                
                                res.statusCode = 200;
                                res.send(singleGroup);
                             } else {
                                next(new Error(err));
                             }
                          });
}


