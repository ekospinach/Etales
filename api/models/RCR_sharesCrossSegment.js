var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//New schema, 2014-Apr-17th
var RCR_sharesCrossSegmentSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    absoluteValue     : [variantCrossSegmentDetail],
    valueChange       : [variantCrossSegmentDetail],
    absoluteVolume    : [variantCrossSegmentDetail],
    volumeChange      : [variantCrossSegmentDetail]
})

var variantCrossSegmentDetail = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID  : Number,
    parentCompanyID   : Number,
    marketID : Number, //TMarkets : 1~2
    segmentInfo : [segmentInfoSchema]
})
/*
    Elecssories:
    1-PriceSensitive
    2-Value for Money
    3-Fashion
    4-Freaks
    5-Total

    HealthBeauties:
    1-PriceSensitive
    2-Value for Money
    3-Health Conscious
    4-Impatient      
    5-Total
*/
var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1),
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    value : Number,
})

var RCR_sharesCrossSegment=mongoose.model('RCR_sharesCrossSegment',RCR_sharesCrossSegmentSchema);

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

          RCR_sharesCrossSegment.update({seminar    : singleReport.seminar, 
                                   period     : singleReport.period,
                                   retailerID : singleReport.retailerID},
                                {
                                absoluteValue     : singleReport.absoluteValue, 
                                valueChange       : singleReport.valueChange,   
                                absoluteVolume    : singleReport.absoluteVolume,
                                volumeChange      : singleReport.volumeChange, 
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


exports.getRCR_sharesCrossSegment = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'retailerID': req.params.retailerID
    };
    RCR_sharesCrossSegment.find(data, function(err, docs) {
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
