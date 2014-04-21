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


exports.addMR_retailerPerceptionEvolution=function(req,res,next){
    var newMR_retailerPerceptionEvolution=MR_retailerPerceptionEvolution({
        period : 0,
        seminar : 'MAY',
        storeInfo : [{
            storeID : 1, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 1, //1-Urban, 2-Rural
            previousPerception : [10,15], //0-Price, 1-Convenience
            latestPerception : [15,20], //0-Price, 1-Convenience
            perceptionChange : [20,25]  
        },{
            storeID : 1, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 2, //1-Urban, 2-Rural
            previousPerception : [7,10], //0-Price, 1-Convenience
            latestPerception : [8,11], //0-Price, 1-Convenience
            perceptionChange : [9,13]  
        },{
            storeID : 2, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 1, //1-Urban, 2-Rural
            previousPerception : [12,13], //0-Price, 1-Convenience
            latestPerception : [13,14], //0-Price, 1-Convenience
            perceptionChange : [14,15]  
        },{
            storeID : 2,
            marketID : 2, //1-Urban, 2-Rural
            previousPerception : [17,18], //0-Price, 1-Convenience
            latestPerception : [18,19], //0-Price, 1-Convenience
            perceptionChange : [19,20]  
        },{
            storeID : 3, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 1, //1-Urban, 2-Rural
            previousPerception : [12,15], //0-Price, 1-Convenience
            latestPerception : [15,18], //0-Price, 1-Convenience
            perceptionChange : [18,21]  
        },{
            storeID : 3, 
            marketID : 2, //1-Urban, 2-Rural
            previousPerception : [17,10], //0-Price, 1-Convenience
            latestPerception : [10,3], //0-Price, 1-Convenience
            perceptionChange : [9,2]  
        },{
            storeID : 4, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 1, //1-Urban, 2-Rural
            previousPerception : [10,12], //0-Price, 1-Convenience
            latestPerception : [12,14], //0-Price, 1-Convenience
            perceptionChange : [14,16]  
        },{
            storeID : 4,
            marketID : 2, //1-Urban, 2-Rural
            previousPerception : [8,10], //0-Price, 1-Convenience
            latestPerception : [10,12], //0-Price, 1-Convenience
            perceptionChange : [12,15]  
        },{
            storeID : 5, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 1, //1-Urban, 2-Rural
            previousPerception : [20,22], //0-Price, 1-Convenience
            latestPerception : [22,24], //0-Price, 1-Convenience
            perceptionChange : [24,26]  
        },{
            storeID : 5,
            marketID : 2, //1-Urban, 2-Rural
            previousPerception : [23,35], //0-Price, 1-Convenience
            latestPerception : [25,34], //0-Price, 1-Convenience
            perceptionChange : [30,36]  
        },{
            storeID : 6, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 1, //1-Urban, 2-Rural
            previousPerception : [26,30], //0-Price, 1-Convenience
            latestPerception : [26,35], //0-Price, 1-Convenience
            perceptionChange : [17,25]  
        },{
            storeID : 6,
            marketID : 2, //1-Urban, 2-Rural
            previousPerception : [27,30], //0-Price, 1-Convenience
            latestPerception : [28,31], //0-Price, 1-Convenience
            perceptionChange : [39,32]  
        },{
            storeID : 7, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketID : 1, //1-Urban, 2-Rural
            previousPerception : [16,35], //0-Price, 1-Convenience
            latestPerception : [25,40], //0-Price, 1-Convenience
            perceptionChange : [27,55]  
        },{
            storeID : 7,
            marketID : 2, //1-Urban, 2-Rural
            previousPerception : [27,50], //0-Price, 1-Convenience
            latestPerception : [30,61], //0-Price, 1-Convenience
            perceptionChange : [29,34]  
        }]
    });
    newMR_retailerPerceptionEvolution.save(function(err) {
        if(!err){
            res.send(200,newMR_retailerPerceptionEvolution);
            console.log("created new GeneralReport:"+newMR_retailerPerceptionEvolution);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_retailerPerceptionEvolution=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_retailerPerceptionEvolution.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}