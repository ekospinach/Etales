var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');


var oneQuarterExogenousDataSchema = mongoose.Schema({
    seminar    : String,
    period     : Number,
    marketID   : Number,
    categoryID : Number,
    MinBMPriceVsCost                : Number,
    MaxBMPriceVsCost                : Number,
    IngredientsQualityVsATLGap      : Number,
    ActiveAgentVsSmoothenerGap      : Number,
    MaxTargetVolumeVsTotalMarket    : Number,
    MinOnlinePriceVsCost            : Number,
    MaxOnlinePriceVsCost            : Number,
    MaxCapacityReduction            : Number,
    MaxCapacityIncrease             : Number,
    Supplier4AcquiredLevelsGapForPL : Number,
    MinPLPriceVsCost                : Number,
    MaxPLPriceVsCost                : Number,
    MinRetailPriceVsNetBMPrice      : Number,
    MaxRetailPriceVsNetBMPrice      : Number,    
})

var oneQuarterExogenousData = mongoose.model('bg_oneQuarterExogenousData',oneQuarterExogenousDataSchema);

exports.addInfos = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?seminar=' + options.seminar + '&period=0'
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
          console.log('response statusCode from CGI(' + options.cgiPath + '), ' + response.statusCode);
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

//          console.log(util.inspect(infoGroup, {depth:null}));
          (function singleUpdate(idx){
              oneQuarterExogenousData.update({seminar: infoGroup[idx].seminar, 
                                    marketID: infoGroup[idx].marketID,
                                    categoryID : infoGroup[idx].categoryID,
                                    period : infoGroup[idx].period},
                                    {
                                    MinBMPriceVsCost                : infoGroup[idx].MinBMPriceVsCost,               
                                    MaxBMPriceVsCost                : infoGroup[idx].MaxBMPriceVsCost,               
                                    IngredientsQualityVsATLGap      : infoGroup[idx].IngredientsQualityVsATLGap,     
                                    ActiveAgentVsSmoothenerGap      : infoGroup[idx].ActiveAgentVsSmoothenerGap,     
                                    MaxTargetVolumeVsTotalMarket    : infoGroup[idx].MaxTargetVolumeVsTotalMarket,   
                                    MinOnlinePriceVsCost            : infoGroup[idx].MinOnlinePriceVsCost,           
                                    MaxOnlinePriceVsCost            : infoGroup[idx].MaxOnlinePriceVsCost,           
                                    MaxCapacityReduction            : infoGroup[idx].MaxCapacityReduction,           
                                    MaxCapacityIncrease             : infoGroup[idx].MaxCapacityIncrease,            
                                    Supplier4AcquiredLevelsGapForPL : infoGroup[idx].Supplier4AcquiredLevelsGapForPL,
                                    MinPLPriceVsCost                : infoGroup[idx].MinPLPriceVsCost,               
                                    MaxPLPriceVsCost                : infoGroup[idx].MaxPLPriceVsCost,          
                                    MinRetailPriceVsNetBMPrice      : infoGroup[idx].MinRetailPriceVsNetBMPrice,     
                                    MaxRetailPriceVsNetBMPrice      : infoGroup[idx].MaxRetailPriceVsNetBMPrice,     
                                    },
                                    {upsert: true},
                                    function(err, numberAffected, raw){
                                      if(err) deferred.reject({msg:err, options: options});       
                                      idx--;
                                      if(idx >= 0){
                                        singleUpdate(idx);
                                      } else {
                                        
                                        deferred.resolve({msg:'oneQuarterExogenousData(seminar:' + options.seminar + ') import done', options: options});
                                        
                                      }                           
                                    });   

          })(infoGroup.length-1);
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom oneQuarterExogenousData import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })();

    return deferred.promise;
}

exports.getOneQuarterExogenousData=function(req,res,next){
    return oneQuarterExogenousData.findOne({
        seminar:req.params.seminar,
        period:0,
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