var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_channelsProfitabilitySchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrcp_VolumeOrdered    : [categoryInfoSchema],
    scrcp_VolumeSold       : [categoryInfoSchema],
    scrcp_VolumeSoldShare  : [categoryInfoSchema],
    scrcp_SalesValue       : [categoryInfoSchema],
    scrcp_SalesValueShare  : [categoryInfoSchema],
    scrcp_CostOfGoodsSold  : [categoryInfoSchema],
    scrcp_TradeSupport     : [categoryInfoSchema],
    scrcp_TradeProfit      : [categoryInfoSchema],
    scrcp_TradeProfitShare : [categoryInfoSchema],

    scrcp_TradeSupportShare : [categoryInfoSchema],
    scrcp_ShelfSpaceShare   : [categoryInfoSchema],

})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,  //TCategoriesTotal : 1~3 
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketsTotal : 1~3
    accountInfo : [accountInfoSchema]
})

var accountInfoSchema = mongoose.Schema({
    accountID : Number, //TAccounts : 1~ 4, Two Modern Retailers + Traditional Trade + On-Line 
    value : Number,
})

var SCR_channelsProfitability=mongoose.model('SCR_channelsProfitability',SCR_channelsProfitabilitySchema);

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

          SCR_channelsProfitability.update({seminar    : singleReport.seminar, 
                                            period     : singleReport.period,
                                            producerID : singleReport.producerID},
                                {scrcp_VolumeOrdered   : singleReport.scrcp_VolumeOrdered,
                                scrcp_VolumeOrdered    : singleReport.scrcp_VolumeOrdered,
                                scrcp_VolumeSold       : singleReport.scrcp_VolumeSold,
                                scrcp_VolumeSoldShare  : singleReport.scrcp_VolumeSoldShare,
                                scrcp_SalesValue       : singleReport.scrcp_SalesValue,
                                scrcp_SalesValueShare  : singleReport.scrcp_SalesValueShare,
                                scrcp_CostOfGoodsSold  : singleReport.scrcp_CostOfGoodsSold,
                                scrcp_TradeSupport     : singleReport.scrcp_TradeSupport,
                                scrcp_TradeProfit      : singleReport.scrcp_TradeProfit,
                                scrcp_TradeProfitShare : singleReport.scrcp_TradeProfitShare, 
                                scrcp_TradeSupportShare : singleReport.scrcp_TradeSupportShare,
                                scrcp_ShelfSpaceShare   : singleReport.scrcp_ShelfSpaceShare,
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

exports.getSCR_channelsProfitability = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'producerID': req.params.producerID
    };
    SCR_channelsProfitability.find(data, function(err, docs) {
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

