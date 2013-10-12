var http = require('http'),
    util = require('util'),
    mongoose = require('mongoose'),
    _ = require('underscore');

var volReportSchema = mongoose.Schema({
      seminar : String,
      fileName : String,
      latestHistoryPeriod : Number,
      titleENG : String, 
      titleCHN : String,
      titleRUS : String,
      reportCollection : [reportCollectionSchema]
})

var reportCollectionSchema = mongoose.Schema({
      role: String, //Producer or Retailer 
      dataCollection : [dataCollectionSchema]
})

var dataCollectionSchema = mongoose.Schema({
      market : String,
      roleID : String, //producer 1,2,3
      category : String, 
      detail : String,  
      data : {
        cols : [colsSchema],
        rows : [rowsSchema]
      }  
})

var colsSchema = mongoose.Schema({
      id : String, 
      label: String, 
      labelENG: String,
      labelCHN: String,
      labelRUS: String,
      type: String,
      color : Number
})

var rowsSchema = mongoose.Schema({
      c : [{ 
        v: String,
        f: String,
        vRUS : String, 
        vCHN : String
      }],
})

var volReportModel = mongoose.model('volReport', volReportSchema);

exports.addVolReports = function(options){
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
              next(new Error('JSON.parse failed'));
              console.log(e);
            }
          }           
          if (!reportGroup ) return; 
          
          (function singleReportUpdate(idx){
              volReportModel.update({fileName: req.body.fileName, 
                                    latestHistoryPeriod: reportGroup[idx].latestHistoryPeriod,
                                    titleENG : reportGroup[idx].titleENG},
                                    {reportCollection : reportGroup[idx].reportCollection,
                                    seminar : reportGroup[idx].Seminar,
                                    titleRUS : reportGroup[idx].titleRUS,
                                    titleCHN : reportGroup[idx].titleCHN},
                                    {upsert: true},
                                    function(err, numberAffected, raw){ 
                                      if (err) next(new Error(err));
                                      console.log('volReports generated: the number of updated documents was %d', numberAffected);
                                      idx--;
                                      if(idx >=0 ){
                                        singleReportUpdate(idx);
                                      } else {
                                        currentPeriod--;
                                        if (currentPeriod >= startFrom) {
                                           sendRequest(currentPeriod);
                                        } else {
                                           console.log('VolReports  generate done. from period' + startFrom + ' to ' + endWith);
                                           res.statusCode = 200;
                                           res.setHeader('Content-Type', 'text/html');
                                           res.end('all done.');             
                                        }                                        
                                      }
                                    });            
          })(reportGroup.length-1);      

        });

      }).on('error', function(e){
        next(new Error('errorFrom add volReport' + e.message));
      });
    })(endWith);
  }
}

exports.getVolReport = function(req, res, next){
  var queryCondition = {
    fileName : req.query.fileName,
    period : req.query.period,
    titleENG : req.query.titleENG,
    role : req.query.role
  }

  volReportModel.findOne({fileName : queryCondition.fileName,
                          latestHistoryPeriod : queryCondition.period,
                          titleENG : queryCondition.titleENG},
                          function(err, doc){
                             if(!err){
                                if(doc){
                                  var singleReport = _.find(doc.reportCollection, function(report){ return report.role == queryCondition.role });                                
                                  res.header("Content-Type", "application/json; charset=UTF-8");                                
                                  res.statusCode = 200;
                                  res.send(singleReport);                                  
                                } else {
                                  next(new Error(queryCondition + ": doc doesn't exist"));                                        
                                }
                             } else {
                                next(new Error(err));
                             }
                          });
}