var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

//New Schema, 2014-Apr-17th
var RCR_keyPerformanceIndicatorsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    
    rcrkpi_VolumeRotationIndex        : [quarterInfoSchema],
    rcrkpi_ValueRotationIndex         : [quarterInfoSchema],
    rcrkpi_ProfitabilityIndex         : [quarterInfoSchema],
    rcrkpi_StockCover                 : [quarterInfoSchema],
    rcrkpi_ShoppersShare              : [shoperInfoSchema],
})

var quarterInfoSchema = mongoose.Schema({
    categoryID : Number,
    marketID : Number, //1-Urban, 2-Rural, 3-Total
    value : Number, 
})

var shoperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS})
    categoryInfo : [quarterInfoSchema]
})

var RCR_keyPerformanceIndicators=mongoose.model('RCR_keyPerformanceIndicators',RCR_keyPerformanceIndicatorsSchema);

exports.addReports = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar + '&retailerID=' + options.retailerID
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404||500 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else {
            try {
              var singleReport = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!singleReport) return; 

          RCR_keyPerformanceIndicators.update({seminar    : singleReport.seminar, 
                                            period     : singleReport.period,
                                            retailerID : singleReport.retailerID},
                                {
                                rcrkpi_VolumeRotationIndex        : singleReport.rcrkpi_VolumeRotationIndex,
                                rcrkpi_ValueRotationIndex         : singleReport.rcrkpi_ValueRotationIndex, 
                                rcrkpi_ProfitabilityIndex         : singleReport.rcrkpi_ProfitabilityIndex, 
                                rcrkpi_StockCover                 : singleReport.rcrkpi_StockCover,         
                                rcrkpi_ShoppersShare              : singleReport.rcrkpi_ShoppersShare
                                },      
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg: options.schemaName + ' (seminar:' + options.seminar + ', retailer:' + options.retailerID+ ') import done. from period ' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   

        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom add ' + options.schemaName + ': ' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.getRCR_keyPerformanceIndicators = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'retailerID': req.params.retailerID
    };
    RCR_keyPerformanceIndicators.find(data, function(err, docs) {
        if (err) {
            return next(new Error(err));
        }
        if (docs) {
            res.send(200, docs);
        } else {
            res.send(404, 'failed');
        }
    })
}

