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
var segmentLeadershipSchema = mongoose.Schema({
	  period : Number,
    seminar : String,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    marketInfo : [marketInfoSchema],
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketTotal : 1~(2+1)
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

        HealthBeauties:
        1-PriceSensitive
        2-Value for Money
        3-Health Conscious
        4-Impatient      
    */
    divisionInfo : [divisionInfoSchema]
})

var divisionInfoSchema = mongoose.Schema({
    divisionKind : String, // TRADITIONAL, INTERNET, CORPORATE
    grsl_ValueLeaders : [segmentVariantLeadersSchema],
    grsl_VolumeLeaders : [segmentVariantLeadersSchema]
})

var segmentVariantLeadersSchema = mongoose.Schema({
    varID              : Number,
    varName            : String,
    parentBrandID      : Number,
    parentBrandName    : String,
    share              : Number 
})

var segmentLeadership=mongoose.model('gr_segmentLeadership',segmentLeadershipSchema);

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

         segmentLeadership.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {categoryInfo: singleReport.categoryInfo},
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

var setData = function(data,kind){
    var result=[];
    data.forEach(function(singleDivision){
        if(singleDivision.divisionKind==kind){
            singleDivision.grsl_ValueLeaders.forEach(function(singleValue){
                result.push({
                    //name:singleValue.parentBrandName+singleValue.varName,
                    name:singleValue.varName,
                    value:singleValue.share,
                    parentID:parseInt(singleValue.parentBrandID/10)

                });
            })
        }
    });
    return result;
}

exports.getSegmentLeadership = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period
    };
    segmentLeadership.findOne(data, function(err, doc) {
        if (err) {
            return next(new Error(err));
        }
        if (!doc) {
            res.send(404, 'failed');
        } else {
            var result = {
                priceSensitive:{
                    CORPORATE: {},
                    TRADITIONAL: {},
                    INTERNET: {}
                },
                value:{
                    CORPORATE: {},
                    TRADITIONAL: {},
                    INTERNET: {}
                },
                fashion:{
                    CORPORATE: {},
                    TRADITIONAL: {},
                    INTERNET: {}
                },
                freaks:{
                    CORPORATE: {},
                    TRADITIONAL: {},
                    INTERNET: {}
                }
                
            };
            doc.categoryInfo.forEach(function(singleCate) {
                if (singleCate.categoryID == req.params.categoryID) {
                    singleCate.marketInfo.forEach(function(singleMarket) {
                        if (singleMarket.marketID == 3) {
                            singleMarket.segmentInfo.forEach(function(singleSegment) {
                                switch (singleSegment.segmentID) {
                                    case 1:
                                        result.priceSensitive.CORPORATE = setData(singleSegment.divisionInfo, 'CORPORATE');
                                        result.priceSensitive.TRADITIONAL = setData(singleSegment.divisionInfo, 'TRADITIONAL');
                                        result.priceSensitive.INTERNET = setData(singleSegment.divisionInfo, 'INTERNET');
                                        break;
                                    case 2:
                                        result.value.CORPORATE = setData(singleSegment.divisionInfo, 'CORPORATE');
                                        result.value.TRADITIONAL = setData(singleSegment.divisionInfo, 'TRADITIONAL');
                                        result.value.INTERNET = setData(singleSegment.divisionInfo, 'INTERNET');
                                        break;
                                    case 3:
                                        result.fashion.CORPORATE = setData(singleSegment.divisionInfo, 'CORPORATE');
                                        result.fashion.TRADITIONAL = setData(singleSegment.divisionInfo, 'TRADITIONAL');
                                        result.fashion.INTERNET = setData(singleSegment.divisionInfo, 'INTERNET');
                                        break;
                                    case 4:
                                        result.freaks.CORPORATE = setData(singleSegment.divisionInfo, 'CORPORATE');
                                        result.freaks.TRADITIONAL = setData(singleSegment.divisionInfo, 'TRADITIONAL');
                                        result.freaks.INTERNET = setData(singleSegment.divisionInfo, 'INTERNET');
                                        break;
                                }
                            })
                        }
                    })
                }
            });
            res.send(200, result);
        }
    })
}
