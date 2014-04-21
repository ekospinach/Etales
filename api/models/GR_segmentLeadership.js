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
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
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


exports.addSegmentLeadership=function(req,res,next){
    var newSegmentLeadership= segmentLeadership({
        period : 0,
        seminar : 'MAY',
        categoryInfo : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            }]
        }]       
    });
    newSegmentLeadership.save(function(err) {
        if(!err){
            res.send(200,newSegmentLeadership);
            console.log("created new GeneralReport:"+newSegmentLeadership);
        } else {
            res.send(400,"failed.");
        }
    });    
}

exports.getSegmentLeadership=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    segmentLeadership.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })
}
