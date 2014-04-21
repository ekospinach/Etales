var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

//New Schema
var MR_variantPerceptionEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    variantInfo : [variantPerceptionInfoSchema],
})

var variantPerceptionInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    marketID                             : Number, //TMarkets : 1~2
    previousPerception                   : [Number], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
    latestPerception                     : [Number], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
    perceptionChange                     : [Number]  //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal    
})


var MR_variantPerceptionEvolution=mongoose.model('MR_variantPerceptionEvolution',MR_variantPerceptionEvolutionSchema);


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

         MR_variantPerceptionEvolution.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {
                                variantInfo : singleReport.variantInfo,  
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

exports.addMR_variantPerceptionEvolution=function(req,res,next){
    var newMR_variantPerceptionEvolution=MR_variantPerceptionEvolution({
        period : 0,
        seminar : 'MAY',
        variantInfo : [{
            variantName: '_A',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [10,15,20], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [20,25,30]  
        },{
            variantName: '_A',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [10,15,20], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [20,25,30] 
        },{
            variantName: '_A',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [10,15,20], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [20,25,30] 
        },{
            variantName: '_B',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [25,30,35]  
        },{
            variantName: '_B',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [25,30,35]  
        },{
            variantName: '_B',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [25,30,35]  
        },{
            variantName: '_C',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [30,35,40]  
        },{
            variantName: '_C',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [30,35,40]  
        },{
            variantName: '_C',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [30,35,40]  
        },{
            variantName: '_D',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3)
            marketID : 1,
            previousPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [35,40,45]  
        },{
            variantName: '_D',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3)
            marketID : 2,
            previousPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [35,40,45]  
        },{
            variantName: '_D',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3)
            marketID : 3,
            previousPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [35,40,45]  
        },{
            variantName: '_E',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [40,45,50]  
        },{
            variantName: '_E',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [40,45,50]  
        },{
            variantName: '_E',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [40,45,50]  
        },{
            variantName: '_F',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [45,50,55]  
        },{
            variantName: '_F',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [45,50,55]  
        },{
            variantName: '_F',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [45,50,55]  
        },{
            variantName: '_G',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [50,55,60]  
        },{
            variantName: '_G',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [50,55,60]  
        },{
            variantName: '_G',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [50,55,60]  
        },{
            variantName: '_H',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3)
            marketID : 1,
            previousPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [55,60,65]  
        },{
            variantName: '_H',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3)
            marketID : 2,
            previousPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [55,60,65] 
        },{
            variantName: '_H',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3)
            marketID : 3,
            previousPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [55,60,65] 
        },{
            variantName: '_I',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [60,65,70]  
        },{
            variantName: '_I',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [60,65,70]  
        },{
            variantName: '_I',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [60,65,70]   
        },{
            variantName: '_J',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3)
            marketID : 1,
            previousPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [60,65,70], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [65,70,75]  
        },{
            variantName: '_J',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3)
            marketID : 2,
            previousPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [60,65,70], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [65,70,75]  
        },{
            variantName: '_J',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3)
            marketID : 3,
            previousPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [60,65,70], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [65,70,75]  
        },{
            variantName: '_A',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [10,15,20], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [20,25,30]  
        },{
            variantName: '_A',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [10,15,20], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [20,25,30] 
        },{
            variantName: '_A',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [10,15,20], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [20,25,30] 
        },{
            variantName: '_B',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [25,30,35]  
        },{
            variantName: '_B',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [25,30,35]  
        },{
            variantName: '_B',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [15,20,25], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [25,30,35]  
        },{
            variantName: '_C',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3)
            marketID : 1,
            previousPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [30,35,40]  
        },{
            variantName: '_C',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3)
            marketID : 2,
            previousPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [30,35,40]  
        },{
            variantName: '_C',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3)
            marketID : 3,
            previousPerception : [20,25,30], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [30,35,40]  
        },{
            variantName: '_D',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [35,40,45]  
        },{
            variantName: '_D',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [35,40,45]  
        },{
            variantName: '_D',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [25,30,35], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [35,40,45]  
        },{
            variantName: '_E',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [40,45,50]  
        },{
            variantName: '_E',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [40,45,50]  
        },{
            variantName: '_E',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [30,35,40], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [40,45,50]  
        },{
            variantName: '_F',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [45,50,55]  
        },{
             variantName: '_F',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [45,50,55]  
        },{
             variantName: '_F',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [35,40,45], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [45,50,55]  
        },{            
            variantName: '_G',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [50,55,60]  
        },{
            variantName: '_G',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [50,55,60]  
        },{
            variantName: '_G',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [40,45,50], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [50,55,60]  
        },{ 
            variantName: '_H',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [55,60,65]  
        },{
            variantName: '_H',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [55,60,65] 
        },{
            variantName: '_H',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [45,50,55], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [55,60,65] 
        },{    
            variantName: '_I',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [60,65,70]  
        },{
            variantName: '_I',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [60,65,70]  
        },{
            variantName: '_I',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [50,55,60], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [60,65,70]   
        },{         
            variantName: '_J',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 1,
            previousPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [60,65,70], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [65,70,75]  
        },{
            variantName: '_J',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 2,
            previousPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [60,65,70], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [65,70,75]  
        },{
            variantName: '_J',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            marketID : 3,
            previousPerception : [55,60,65], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            latestPerception : [60,65,70], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
            perceptionChange : [65,70,75]  
        }]
    });
    newMR_variantPerceptionEvolution.save(function(err) {
        if(!err){
            res.send(200,newMR_variantPerceptionEvolution);
            console.log("created new GeneralReport:"+newMR_variantPerceptionEvolution);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_variantPerceptionEvolution=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_variantPerceptionEvolution.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

