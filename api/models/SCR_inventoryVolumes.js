var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_inventoryVolumesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrviv_Initial          : [variantInfoSchema],
    scrviv_Production       : [variantInfoSchema],
    scrviv_Sales            : [variantInfoSchema],
    scrviv_Discontinued     : [variantInfoSchema],
    scrviv_Closing          : [variantInfoSchema],
    scrviv_UnitProductionCost   : [variantInfoSchema],
    scrviv_Orders           : [variantMarketInfoSchema],
    scrviv_Shipments        : [variantMarketInfoSchema], 
    scrviv_Available        : [variantInfoSchema],
    scrviv_ChannelPreference : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    value : [Number], ////0-traditional, 1-Internet, 2-Total
})

var variantMarketInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    marketID : Number, //1-Urban, 2-Rural, 3-Total
    accountID : Number, //1-Retailer1, 2-Retailer2, 3-Traditional Trade, 4-On-Line, 5-Total
    value : Number
})

var SCR_inventoryVolumes=mongoose.model('SCR_inventoryVolumes',SCR_inventoryVolumesSchema);

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

          SCR_inventoryVolumes.update({seminar    : singleReport.seminar, 
                                            period     : singleReport.period,
                                            producerID : singleReport.producerID},
                                {
                                scrviv_Initial          : singleReport.scrviv_Initial,     
                                scrviv_Production       : singleReport.scrviv_Production,  
                                scrviv_Sales            : singleReport.scrviv_Sales,       
                                scrviv_Discontinued     : singleReport.scrviv_Discontinued,
                                scrviv_Closing          : singleReport.scrviv_Closing,     
                                scrviv_Orders           : singleReport.scrviv_Orders,
                                scrviv_Shipments           : singleReport.scrviv_Shipments,                                  
                                scrviv_Available          : singleReport.scrviv_Available,

                                scrviv_UnitProductionCost   : singleReport.scrviv_UnitProductionCost,
                                scrviv_ChannelPreference : singleReport.scrviv_ChannelPreference,
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

exports.getSCR_inventoryVolumes = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'producerID': req.params.producerID
    };
    SCR_inventoryVolumes.find(data, function(err, docs) {
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

exports.getSCR_ClosingTotalInventoryVolume = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'producerID': req.params.producerID
    };
    var responseResult;
    SCR_inventoryVolumes.findOne(data, function(err, doc) {
        if (err) {
            return next(new Error(err));
        }
        if (doc) {
            for (i = 0; i < doc.scrviv_Closing.length; i++) {
                if (doc.scrviv_Closing[i].parentBrandName == req.params.brandName && doc.scrviv_Closing[i].variantName == req.params.varName) {
                    responseResult = doc.scrviv_Closing[i].value[1] + doc.scrviv_Closing[i].value[0];
                }
            }
        }

        if (responseResult) {
            res.send(200, {
                'result': responseResult
            });
        } else {
            res.send(404, 'failed');
        }
    })
}
