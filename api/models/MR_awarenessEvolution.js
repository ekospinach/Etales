var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//New schema, 2014-Apr-17th
var MR_awarenessEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    brandInfo : [brandMarketInfo],
})

var brandMarketInfo = mongoose.Schema({
    brandName                            : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, 
    marketID : Number, //1-Urban, 2-Rural
    previousAwareness                    : Number,
    latestAwareness              : Number
})

var MR_awarenessEvolution=mongoose.model('MR_awarenessEvolution',MR_awarenessEvolutionSchema);

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

         MR_awarenessEvolution.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {brandInfo: singleReport.brandInfo},
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


exports.addMR_awarenessEvolution=function(req,res,next){
    var newMR_awarenessEvolution=MR_awarenessEvolution({
        period : 0,
        seminar : 'MAY',
        brandInfo : [{
            brandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, 
            marketID:1,
            previousAwareness: 10, //0-Urban, 1-Rural
            latestAwareness: 15
        },{
            brandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1,
            marketID:1,
            previousAwareness: 10, //0-Urban, 1-Rural
            latestAwareness: 6
        },{
            brandName: 'EMOD2',
            parentCategoryID: 1,
            parentCompanyID: 2, 
            marketID:1,
            previousAwareness: 15, //0-Urban, 1-Rural
            latestAwareness: 25
        },{
            brandName: 'HMOD2',
            parentCategoryID: 2,
            parentCompanyID: 2, 
            marketID:1,
            previousAwareness: 25, //0-Urban, 1-Rural
            latestAwareness: 30
        },{
            brandName: 'ETAE3',
            parentCategoryID: 1,
            parentCompanyID: 3, 
            marketID:1,
            previousAwareness: 20, //0-Urban, 1-Rural
            latestAwareness:14
        },{
            brandName: 'HWAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, 
            marketID:1,
            previousAwareness: 20, //0-Urban, 1-Rural
            latestAwareness:17
        },{
            brandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, 
            marketID:1,
            previousAwareness: 30, //0-Urban, 1-Rural
            latestAwareness: 45
        },{
            brandName: 'HSAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, 
            marketID:1,
            previousAwareness: 25, //0-Urban, 1-Rural
            latestAwareness: 25
        },{
            brandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, 
            marketID:1,
            previousAwareness: 27, //0-Urban, 1-Rural
            latestAwareness: 15
        },{
            brandName: 'HGAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, 
            marketID:1,
            previousAwareness: 30, //0-Urban, 1-Rural
            latestAwareness: 35
        },{
            brandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, 
            marketID:2,
            previousAwareness: 20, //0-Urban, 1-Rural
            latestAwareness: 15
        },{
            brandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, 
            marketID:2,
            previousAwareness: 20, //0-Urban, 1-Rural
            latestAwareness: 14
        },{
            brandName: 'EMOD2',
            parentCategoryID: 1,
            parentCompanyID: 2, 
            marketID:2,
            previousAwareness: 25, //0-Urban, 1-Rural
            latestAwareness: 30
        },{
            brandName: 'HMOD2',
            parentCategoryID: 2,
            parentCompanyID: 2, 
            marketID:2,
            previousAwareness: 25, //0-Urban, 1-Rural
            latestAwareness: 30
        },{
            brandName: 'ETAE3',
            parentCategoryID: 1,
            parentCompanyID: 3, 
            marketID:2,
            previousAwareness: 20, //0-Urban, 1-Rural
            latestAwareness: 14
        },{
            brandName: 'HWAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, 
            marketID:2,
            previousAwareness: 20, //0-Urban, 1-Rural
            latestAwareness: 17
        },{
            brandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, 
            marketID:2,
            previousAwareness: 30, //0-Urban, 1-Rural
            latestAwareness: 45
        },{
            brandName: 'HSAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, 
            marketID:2,
            previousAwareness: 25, //0-Urban, 1-Rural
            latestAwareness: 25
        },{
            brandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, 
            marketID:2,
            previousAwareness: 27, //0-Urban, 1-Rural
            latestAwareness: 15
        },{
            brandName: 'HGAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, 
            marketID:2,
            previousAwareness: 30, //0-Urban, 1-Rural
            latestAwareness: 35
        }]
    });
    newMR_awarenessEvolution.save(function(err) {
        if(!err){
            res.send(200,newMR_awarenessEvolution);
            console.log("created new GeneralReport:"+newMR_awarenessEvolution);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_awarenessEvolution=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_awarenessEvolution.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}
