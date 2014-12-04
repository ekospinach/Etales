var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

//New Schema
var MR_retailerPerceptionEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    storeInfo : [storePerceptionInfoSchema],
})

var storePerceptionInfoSchema = mongoose.Schema({
    storeID : Number, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
    marketID : Number, //1-Urban, 2-Rural
    previousPerception                   : [Number], //0-Price, 1-Convenience
    latestPerception                     : [Number], //0-Price, 1-Convenience
    perceptionChange                     : [Number]  //0-Price, 1-Convenience    
})

var MR_retailerPerceptionEvolution=mongoose.model('MR_retailerPerceptionEvolution',MR_retailerPerceptionEvolutionSchema);

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

         MR_retailerPerceptionEvolution.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {storeInfo: singleReport.storeInfo},
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

exports.getMR_retailerPerceptionEvolution = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period
    };
    MR_retailerPerceptionEvolution.find(data, function(err, docs) {
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