var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_webTrawlerScoresSchema = mongoose.Schema({  
    period     : Number,
    seminar    : String,
    brandInfo  : [brandInfoSchema],
    playerInfo : [playerInfoSchema],
})

var brandInfoSchema = mongoose.Schema({
    categoryID      : Number,
    brandName       : String,
    parentCompanyID : Number,
    sentimentIdx    : Number,
    strengthIdx     : Number,
})

var playerInfoSchema = mongoose.Schema({
    actorID      : Number, //{ R1, R2, TT, S1, S2, S3, S4 }
    sentimentIdx : Number,
    strengthIdx  : Number,
})

var MR_webTrawlerScores = mongoose.model('MR_webTrawlerScores',MR_webTrawlerScoresSchema);

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

         MR_webTrawlerScores.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {
                                brandInfo : singleReport.brandInfo, 
                                playerInfo : singleReport.playerInfo,                                 
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

exports.getMR_webTrawlerScores = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period
    };
    MR_webTrawlerScores.findOne(data, function(err, doc) {
        if (err) {
            return next(new Error(err));
        }
        if (doc) {
            res.send(200, doc);
        } else {
            res.send(404, 'failed');
        }
    })
}



