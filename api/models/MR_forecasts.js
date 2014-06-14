var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_forecastsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    //Importance means Size in (%), saved in file as a decimal
    minConsumerSegmentsImportance : [categorySegmentInfoSchema], 
    maxConsumerSegmentsImportance : [categorySegmentInfoSchema],

    minShopperSegmentsImportance  : [categoryShopperInfoSchema],
    maxShopperSegmentsImportance  : [categoryShopperInfoSchema],

    minTotalVolume                : [categoryInfoSchema],
    maxTotalVolume                : [categoryInfoSchema],

    minInternetPenetrationRate    : [periodInfoSchema],
    maxInternetPenetrationRate    : [periodInfoSchema],
})


var categorySegmentInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    segmentInfo : [segmentInfoSchema]
})

var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1)x,
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
    periodInfo : [periodInfoSchema],
})


var categoryShopperInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    periodInfo : [periodInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    periodInfo : [periodInfoSchema],    
})

var periodInfoSchema = mongoose.Schema({
    period : Number, //-2,-1,0,1,2
    value : [Number] //0-Urban, 1-Rural        
})

var MR_forecasts=mongoose.model('MR_forecasts',MR_forecastsSchema);


exports.addReports = function(options){
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
          //console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
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
         // console.log(util.inspect(singleReport, {depth:null}));

         MR_forecasts.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {
                                minConsumerSegmentsImportance : singleReport.minConsumerSegmentsImportance,
                                maxConsumerSegmentsImportance : singleReport.maxConsumerSegmentsImportance,                                
                                minShopperSegmentsImportance  : singleReport.minShopperSegmentsImportance,
                                maxShopperSegmentsImportance  : singleReport.maxShopperSegmentsImportance,                                
                                minTotalVolume                : singleReport.minTotalVolume,
                                maxTotalVolume                : singleReport.maxTotalVolume,                                
                                minInternetPenetrationRate    : singleReport.minInternetPenetrationRate,
                                maxInternetPenetrationRate    : singleReport.maxInternetPenetrationRate,
                              },
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg: options.schemaName + ' (seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom add ' + options.schemaName + ': ' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}


exports.getMR_forecasts=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_forecasts.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

