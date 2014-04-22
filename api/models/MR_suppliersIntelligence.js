var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_suppliersIntelligenceSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    supplierInfo : [supplierInfoSchema],
})

var supplierInfoSchema = mongoose.Schema({
    supplierID : Number,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //1~3 
    advertisingOnLine             : Number,
    onLineVisibility              : Number,
    onLineOther                   : Number,
    acquiredTechnologyLevel       : Number,
    acquiredDesignLevel           : Number,
    productionCapacityAvailable   : Number,
    capacityUtilisationRate       : Number,
    productionplanningFlexibility : Number,    
    advertisingOffLine            : [Number], //0-Urban, 1-Rural, 2-Total
    actualTradeSupport            : [BMretailerInfoSchema], //BMRetsMax = 3
    negotiatedTradeSupport        : [BMretailerInfoSchema]
})

var BMretailerInfoSchema = mongoose.Schema({
    BMretailerID : Number, //1~3, 1-Retailer1, 2-Retailer2, 3-TraditionalTrade
    value : [Number] //0-Urban, 1-Rural, 2-Total
})

var MR_suppliersIntelligence=mongoose.model('MR_suppliersIntelligence',MR_suppliersIntelligenceSchema);

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

         MR_suppliersIntelligence.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {
                                supplierInfo : singleReport.supplierInfo, 
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


exports.addMR_suppliersIntelligence=function(req,res,next){
    var newMR_suppliersIntelligence=MR_suppliersIntelligence({
        period : 0,
        seminar : 'MAY',
        supplierInfo : [{
            supplierID : 1,
            categoryInfo : [{
                categoryID : 1, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 2, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 3, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            }] 
        },{
            supplierID : 2,
            categoryInfo : [{
                categoryID : 1, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 2, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 3, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            }] 
        },{
            supplierID : 3,
            categoryInfo : [{
                categoryID : 1, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 2, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 3, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            }] 
        }]
    });
    newMR_suppliersIntelligence.save(function(err) {
        if(!err){
            res.send(200,newMR_suppliersIntelligence);
            console.log("created new GeneralReport:"+newMR_suppliersIntelligence);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_suppliersIntelligence=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_suppliersIntelligence.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}


