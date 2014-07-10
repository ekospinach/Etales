var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

//New Schema
var MR_salesByChannelSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    absoluteValue     : [variantDetailSchema],
    valueChange       : [variantDetailSchema],
    absoluteVolume    : [variantDetailSchema],
    volumeChange      : [variantDetailSchema],

    owner_absoluteValue     : [ownerDetailSchema];
    owner_valueChange       : [ownerDetailSchema];
    owner_absoluteVolume    : [ownerDetailSchema];
    owner_volumeChange      : [ownerDetailSchema];    
})

var ownerDetailSchema = mongoose.Schema({
    ownerID : Number, //1~6
    // Prod_1_ID           = 1;
    // Prod_2_ID           = 2;
    // Prod_3_ID           = 3;
    // Prod_4_ID           = 4;
    // Ret_1_ID            = 5;
    // Ret_2_ID            = 6;    
    categoryID : Number,
    marketID : Number,
    value : [Number] //1~5, 1-Retailer 1, 2-Retailer 2, 3-Traditional Trade, 4-Online, 5-Total 
})

var variantDetailSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID  : Number,
    parentCompanyID   : Number,
    marketID : Number, //TMarkets : 1~2
    value : [Number] //1~5, 1-Retailer 1, 2-Retailer 2, 3-Traditional Trade, 4-Online, 5-Total 
})

var MR_salesByChannel=mongoose.model('MR_salesByChannel',MR_salesByChannelSchema);

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

         MR_salesByChannel.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {
                                absoluteValue        : singleReport.absoluteValue, 
                                valueChange          : singleReport.valueChange,   
                                absoluteVolume       : singleReport.absoluteVolume,
                                volumeChange         : singleReport.volumeChange,  
                                owner_absoluteValue  : singleReport.owner_absoluteValue,
                                owner_valueChange    : singleReport.owner_valueChange,
                                owner_absoluteVolume : singleReport.owner_absoluteVolume,
                                owner_volumeChange   : singleReport.owner_volumeChange,
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


exports.getMR_salesByChannel=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_salesByChannel.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}