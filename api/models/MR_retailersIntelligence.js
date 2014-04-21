var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_retailersIntelligenceSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerInfo : [retailerInfoSchema],
})

var retailerInfoSchema = mongoose.Schema({
    retailerID : Number, //1~3     
    storeServiceLevel : [String], //0-Urban, 1-Rural,//SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
//    storePerceptionInfo : [storePerceptionInfoSchema],
    onlineAdvertising : [Number], //0-Urban, 1-Rural
    offlineAdvertising : [Number], //0-Urban, 1-Rural
    localAdvertising : [Number],
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    shelfSpace                           : [Number], //0-Urban, 1-Rural
    previousShelfSpace                   : [Number],
    shelfSpaceChange                     : [Number]
})


// var storePerceptionInfoSchema = mongoose.Schema({
//     perception : String, //PRICE, CONVENIENCE, TOTAL
//     onlineAdvertising : Number,
//     offlineAdvertising : Number,
//     localAdvertising : [Number], //0-Urban, 1-Rural               
// })


var MR_retailersIntelligence=mongoose.model('MR_retailersIntelligence',MR_retailersIntelligenceSchema);

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

         MR_retailersIntelligence.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {retailerInfo: singleReport.retailerInfo},
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

exports.addMR_retailersIntelligence=function(req,res,next){
    var newMR_retailersIntelligence=MR_retailersIntelligence({
        period : 0,
        seminar : 'MAY',
        retailerInfo : [{
            retailerID : 1, //1~3     
            storeServiceLevel : ['SL_BASE','SL_ENHANCED'], //0-Urban, 1-Rural
            onlineAdvertising : [10,20], //0-Urban, 1-Rural
            offlineAdvertising : [15,20], //0-Urban, 1-Rural
            localAdvertising : [20,25], //0-Urban, 1-Rural
            variantInfo : [{
                variantName: '_A',
                parentBrandName: 'ELAN1',
                parentCategoryID: 1,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_B',
                parentBrandName: 'HLAN1',
                parentCategoryID: 2,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_C',
                parentBrandName: 'ELAN2',
                parentCategoryID: 1,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_D',
                parentBrandName: 'HLAN2',
                parentCategoryID: 2,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_E',
                parentBrandName: 'ELAN3',
                parentCategoryID: 1,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_F',
                parentBrandName: 'HLAN3',
                parentCategoryID: 2,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_G',
                parentBrandName: 'ELAN5',
                parentCategoryID: 1,
                parentCompanyID: 5, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_H',
                parentBrandName: 'HLAN5',
                parentCategoryID: 2,
                parentCompanyID: 5, //TActors : 1~(4+3) 
                shelfSpace: [20,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            }]
        },{
            retailerID : 2, //1~3     
            storeServiceLevel : ['SL_FAIR','SL_PREMIUM'], //0-Urban, 1-Rural
            onlineAdvertising : [15,25], //0-Urban, 1-Rural
            offlineAdvertising : [20,30], //0-Urban, 1-Rural
            localAdvertising : [30,35], //0-Urban, 1-Rural
            variantInfo : [{
                variantName: '_A',
                parentBrandName: 'ELAN1',
                parentCategoryID: 1,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_C',
                parentBrandName: 'HLAN1',
                parentCategoryID: 2,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_C',
                parentBrandName: 'ELAN2',
                parentCategoryID: 1,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_E',
                parentBrandName: 'HLAN2',
                parentCategoryID: 2,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_F',
                parentBrandName: 'ELAN3',
                parentCategoryID: 1,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_F',
                parentBrandName: 'HLAN3',
                parentCategoryID: 2,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_G',
                parentBrandName: 'ELAN6',
                parentCategoryID: 1,
                parentCompanyID: 6, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            },{
                variantName: '_H',
                parentBrandName: 'HLAN6',
                parentCategoryID: 2,
                parentCompanyID: 6, //TActors : 1~(4+3) 
                shelfSpace: [30,30],
                previousShelfSpace:[25,35],
                shelfSpaceChange:[30,40]
            }]
        },{}]
    });
    newMR_retailersIntelligence.save(function(err) {
        if(!err){
            res.send(200,newMR_retailersIntelligence);
            console.log("created new GeneralReport:"+newMR_retailersIntelligence);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_retailersIntelligence=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_retailersIntelligence.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}