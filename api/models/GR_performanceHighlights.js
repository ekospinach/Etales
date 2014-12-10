var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)

//TActors : 1~(4+3)
//TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)
//TAllProducer : 1~4 (ProsMaxPlus)
var performanceHighlightsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    actorInfo : [actorInfoSchema],	
    storeInfo : [storeInfoSchema],
})	

var storeInfoSchema = mongoose.Schema({
    storeID : Number,  
    // AllStoresMax = BMRetsMax + ProsMaxPlus; { all B&M and four E-malls }
    // 1 ~ (3 + 4)
    // 1 - Retailer 1
    // 2 - Retailer 2
    // 3 - Retailer 3 (Tradition Trade)
    // 4 - Supplier 1 Online 
    // 5 - Supplier 2 Online 
    // 6 - Supplier 3 Online 
    // 7 ...
    storeCategoryInfo : [storeCategoryInfoSchema],
})

var storeCategoryInfoSchema = mongoose.Schema({
    categoryID : Number, //TCategories: 1~2 
    grph_ConsumersOffTakeVolume      : [Number], // 0 - Urban, 1 - Rural, 3 - Total
    grph_ConsumersOffTakeVolumeShare : [Number], // 0 - Urban, 1 - Rural, 3 - Total
    grph_ConsumersOffTakeValue       : [Number], // 0 - Urban, 1 - Rural, 3 - Total
    grph_ConsumersOffTakeValueShare  : [Number], // 0 - Urban, 1 - Rural, 3 - Total
})

var actorInfoSchema = mongoose.Schema({
	actorID 					 : Number, //TActors : 1~(4+3)
    /*
        1 - Supplier 1
        2 - Supplier 2
        3 - Supplier 3
        4 - Supplier 4
        5 - Retailer 1
        6 - Retailer 2
        7 - Traditional Trade         
    */
    grph_OperatingProfit         : Number,
    grph_OperatingProfitChange   : Number,
    grph_CumulativeInvestment    : Number,
    actorCategoryInfo : [actorCategoryInfoSchema]
})

var actorCategoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    //Performance Highlights 
    grph_SalesVolume             : [Number], //CategoryID : 1~2, ** 0-BM 1-Online 3-Retailer **
    grph_NetSalesValue           : [Number], //CategoryID : 1~3, ** 0-BM 1-Online 3-Retailer **
    grph_SalesVolumeChange       : [Number], //CategoryID : 1~3, ** 0-BM 1-Online 3-Retailer **
    grph_NetSalesValueChange     : [Number], //CategoryID : 1~2, ** 0-BM 1-Online 3-Retailer **

    grph_ValueMarketShare        : Number, //CategoryID : 1~2
    grph_VolumeMarketShare       : Number, //CategoryID : 1~3    
    grph_ValueMarketShareChange  : Number, //CategoryID : 1~2
    grph_VolumeMarketShareChange : Number, //CategoryID : 1~3
})

var performanceHighlights=mongoose.model('GR_performanceHighlights',performanceHighlightsSchema);

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

          performanceHighlights.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {actorInfo: singleReport.actorInfo,
                               storeInfo: singleReport.storeInfo},
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

exports.getPerformanceHighlights = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period
    };
    performanceHighlights.find(data, function(err, docs) {
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

exports.getBrandPerspective = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period
    };
    performanceHighlights.findOne(data, function(err, doc) {
        if (err) {
            return next(new Error(err));
        }
        if (doc) {
            var result = {
                operatingProfits: [],
                cumulativeInvestments: [],
                salesVolumes: [],
                salesValues: [],
                volumeShares: [],
                valueShares: []
            };
            doc.actorInfo.forEach(function(singleData) {
                result.operatingProfits.push({
                    'value': singleData.grph_OperatingProfit
                });
                result.cumulativeInvestments.push({
                    'value': singleData.grph_CumulativeInvestment
                });

                for (j = 0; j < 2; j++) {
                    result.salesVolumes.push({
                        'categoryID': singleData.actorCategoryInfo[j].categoryID,
                        'value': singleData.actorCategoryInfo[j].grph_SalesVolume
                    });
                    result.salesValues.push({
                        'categoryID': singleData.actorCategoryInfo[j].categoryID,
                        'value': singleData.actorCategoryInfo[j].grph_NetSalesValue
                    });

                    result.valueShares.push({
                        'value': singleData.actorCategoryInfo[j].grph_ValueMarketShare
                    });
                    result.volumeShares.push({
                        'value': singleData.actorCategoryInfo[j].grph_VolumeMarketShare
                    });
                }
            });
            res.send(200, {
                result: result
            });

        } else {
            res.send(404, 'failed');
        }
    })
}

exports.getChannelPerspective = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period
    };
    performanceHighlights.findOne(data, function(err, doc) {
        if (err) {
            return next(new Error(err));
        }
        if (doc) {
            var result = {
                players: []
            };
            var categories = [];
            for (var i = 0; i < 6; i++) {
                doc.storeInfo[i].storeCategoryInfo.forEach(function(singleData) {
                    categories.push({
                        'storeID': doc.storeInfo[i].storeID,
                        'categoryID': singleData.categoryID,
                        'salesVolume': singleData.grph_ConsumersOffTakeVolume,
                        'salesValue': singleData.grph_ConsumersOffTakeValue,
                        'shareVolume': singleData.grph_ConsumersOffTakeVolumeShare,
                        'shareValue': singleData.grph_ConsumersOffTakeValueShare
                    });
                });
                result.players.push({
                    'category': categories
                });
            }

            res.send(200, {
                result: result
            });
        } else {
            res.send(404, 'failed');
        }
    })
}