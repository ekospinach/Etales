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
var crossSegmentSalesSchema = mongoose.Schema({
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
    segmentID : Number, //TSegmentsTotal : 1~(4+1)
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    grcss_CrossSegmentsNetValues : Number,
    grcss_CrossSegmentsVolumes : Number
})

var crossSegmentSales=mongoose.model('gr_crossSegmentSales',crossSegmentSalesSchema);

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

         crossSegmentSales.update({seminar: singleReport.seminar, 
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


exports.addCrossSegmentSales=function(req,res,next){
    var newCrossSegmentSales=new crossSegmentSales({
        period:0,
        seminar:'MAY',
        categoryInfo:[{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:2,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:3,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:4,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                },{
                    segmentID:5,
                    shopperInfo: [{
                        shoperKind:'BMS',
                        grcss_CrossSegmentsNetValues:10,
                        grcss_CrossSegmentsVolumes:11
                    },{
                        shoperKind:'NETIZENS',
                        grcss_CrossSegmentsNetValues:20,
                        grcss_CrossSegmentsVolumes:21
                    },{
                        shoperKind:'MIXED',
                        grcss_CrossSegmentsNetValues:30,
                        grcss_CrossSegmentsVolumes:31
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grcss_CrossSegmentsNetValues:40,
                        grcss_CrossSegmentsVolumes:41
                    }]
                }]
            }]
        }]
    });
    newCrossSegmentSales.save(function(err) {
        if(!err){
            res.send(200,newCrossSegmentSales);
            console.log("created new GeneralReport:"+newCrossSegmentSales);
        } else {
            res.send(400,"failed.");
        }
    });
}

exports.getCrossSegmentSales=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    crossSegmentSales.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })
}

