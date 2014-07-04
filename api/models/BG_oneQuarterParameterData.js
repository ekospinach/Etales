var mongoose     = require('mongoose'),
    http         = require('http'),
    util         = require('util'),
    _            = require('underscore'),
    request      = require('request'),
    q            = require('q');

var oneQuarterParameterDataSchema = mongoose.Schema({
    seminar                         : String,
    marketID                        : Number,
    categoryID                      : Number,

    ProdCost_HigherDesignImpact              : Number,
    ProdCost_HigherTechImpact                : Number,
    ProdCost_DefaultDrop                     : Number,
    ProdCost_MarginOnPrivateLabel            : Number,
    MinProductionVolume                      : Number,

    ProdCost_ECONOMY                         : Number,
    ProdCost_STANDARD                        : Number,
    ProdCost_PREMIUM                         : Number,    
})

var oneQuarterParameterData = mongoose.model('bg_oneQuarterParameterData', oneQuarterParameterDataSchema);
exports.oneQuarterParameterData = mongoose.model('bg_oneQuarterParameterData',oneQuarterParameterDataSchema);

exports.addInfos = function(options){
    var deferred = q.defer();
   
   (function sendRequest(){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?seminar=' + options.seminar 
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
          //console.log('response statusCode from CGI(' + options.cgiPath + '): ' + response.statusCode);
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else {
            try {
              var infoGroup = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!infoGroup) return; 

          //console.log(util.inspect(infoGroup, {depth:null}));
          (function singleUpdate(idx){
              oneQuarterParameterData.update({seminar: infoGroup[idx].seminar, 
                                              marketID: infoGroup[idx].marketID,
                                              categoryID : infoGroup[idx].categoryID},
                                    {
                                      ProdCost_HigherDesignImpact              : infoGroup[idx].ProdCost_HigherDesignImpact,  
                                      ProdCost_HigherTechImpact                : infoGroup[idx].ProdCost_HigherTechImpact,    
                                      ProdCost_DefaultDrop                     : infoGroup[idx].ProdCost_DefaultDrop,         
                                      ProdCost_MarginOnPrivateLabel            : infoGroup[idx].ProdCost_MarginOnPrivateLabel,
                                      MinProductionVolume                      : infoGroup[idx].MinProductionVolume,          

                                      ProdCost_ECONOMY                         : infoGroup[idx].ProdCost_ECONOMY,             
                                      ProdCost_STANDARD                        : infoGroup[idx].ProdCost_STANDARD,            
                                      ProdCost_PREMIUM                         : infoGroup[idx].ProdCost_PREMIUM,             
                                    },
                                    {upsert: true},
                                    function(err, numberAffected, raw){  
                                      if(err) deferred.reject({msg:err, options: options});       
                                      idx--;
                                      if(idx >= 0){
                                        singleUpdate(idx);
                                      } else {
                                          deferred.resolve({msg:'oneQuarterParameterData(seminar:' + options.seminar + ') import done.'});
                                      }     
                                    });   
          })(infoGroup.length-1);
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom oneQuarterParameterData import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })();

    return deferred.promise;
}

exports.getOneQuarterParameterData=function(req,res,next){
    return oneQuarterParameterData.findOne({
        seminar:req.params.seminar,
        categoryID:req.params.categoryID,
        marketID:req.params.marketID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(doc){
            res.send(200,doc);
        }else{
            res.send(400,'fail');
        }
    })
}
