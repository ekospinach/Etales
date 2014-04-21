var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_sharesCrossSegmentSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    absoluteValue     : [variantInfoSchema],
    valueChange       : [variantInfoSchema],
    absoluteVolume    : [variantInfoSchema],
    volumeChange      : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID  : Number,
    parentCompanyID   : Number,
    marketInfo: [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarkets : 1~2
    segmentInfo : [segmentInfoSchema]
})

var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1),
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
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    value : Number,
})

//New Schema
// var MR_sharesCrossSegmentSchema = mongoose.Schema({
//     period : Number,
//     seminar : String,
//     absoluteValue     : [variantCrossSegmentDetailSchema],
//     valueChange       : [variantCrossSegmentDetailSchema],
//     absoluteVolume    : [variantCrossSegmentDetailSchema],
//     volumeChange      : [variantCrossSegmentDetailSchema],
// })

// var variantCrossSegmentDetailSchema = mongoose.Schema({
//     variantName       : String,
//     parentBrandName   : String,
//     parentCategoryID  : Number,
//     parentCompanyID   : Number,
//     marketID : Number, //TMarkets : 1~2
//     segmentInfo : [segmentInfoSchema]
// })

// var segmentInfoSchema = mongoose.Schema({
//     segmentID : Number, //TSegmentsTotal : 1~(4+1)x,
//     /*
//         Elecssories:
//         1-PriceSensitive
//         2-Value for Money
//         3-Fashion
//         4-Freaks
//         5-Total

//         HealthBeauties:
//         1-PriceSensitive
//         2-Value for Money
//         3-Health Conscious
//         4-Impatient      
//         5-Total
//     */
//     shopperInfo : [shopperInfoSchema]
// })

// var shopperInfoSchema = mongoose.Schema({
//     shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
//     value

var MR_sharesCrossSegment=mongoose.model('MR_sharesCrossSegment',MR_sharesCrossSegmentSchema);

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

         MR_sharesCrossSegment.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
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


exports.addMR_sharesCrossSegment=function(req,res,next){
    var newMR_sharesCrossSegment=MR_sharesCrossSegment({
        period : 0,
        seminar : 'MAY',
        absoluteValue     : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },
        {
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        }],
        valueChange       : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },
        {
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        }],
        absoluteVolume    : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },
        {
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        }],
        volumeChange      : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:1,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },
        {
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketID:2,
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 10
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 20
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 30
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 40
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1),
                shopperInfo : [{
                    shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                },{
                    shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                    value : 50
                }]
            }]
        }]
    });
    newMR_sharesCrossSegment.save(function(err) {
        if(!err){
            res.send(200,newMR_sharesCrossSegment);
            console.log("created new GeneralReport:"+newMR_sharesCrossSegment);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_sharesCrossSegment=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_sharesCrossSegment.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}