var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_keyPerformanceIndicatorsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrkpi_TradeSpendingEffectiveness : [categoryInfoSchema],
    scrkpi_MarketingEffectiveness     : [categoryInfoSchema],
    scrkpi_ChannelSalesValueShare     : [categoryInfoSchema],
    scrkpi_ChannelSalesVolumeShare    : [categoryInfoSchema],
    scrkpi_ShoppersShare              : [categoryInfoSchema],
    scrkpi_PortfolioStrength          : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,
    value : [Number], ////0-traditional, 1-Internet, 2-Total
})

var SCR_keyPerformanceIndicators=mongoose.model('SCR_keyPerformanceIndicators',SCR_keyPerformanceIndicatorsSchema);

exports.addReports = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar + '&producerID=' + options.producerID
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

          SCR_keyPerformanceIndicators.update({seminar    : singleReport.seminar, 
                                            period     : singleReport.period,
                                            producerID : singleReport.producerID},
                                {
                                scrkpi_TradeSpendingEffectiveness : singleReport.scrkpi_TradeSpendingEffectiveness,
                                scrkpi_MarketingEffectiveness     : singleReport.scrkpi_MarketingEffectiveness,    
                                scrkpi_ChannelSalesValueShare     : singleReport.scrkpi_ChannelSalesValueShare,    
                                scrkpi_ChannelSalesVolumeShare    : singleReport.scrkpi_ChannelSalesVolumeShare,   
                                scrkpi_ShoppersShare              : singleReport.scrkpi_ShoppersShare,             
                                scrkpi_PortfolioStrength          : singleReport.scrkpi_PortfolioStrength            
                                },
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg: options.schemaName + ' (seminar:' + options.seminar + ', producer:' + options.producerID+ ') import done. from period ' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   

        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom add ' + options.schemaName + ': ' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.getSCR_keyPerformanceIndicators = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'producerID': req.params.producerID
    };
    SCR_keyPerformanceIndicators.find(data, function(err, docs) {
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

