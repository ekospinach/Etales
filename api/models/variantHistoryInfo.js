var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var variantHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    varName : String,
    varID : Number,
    dateOfBirth : Number, //-4~10
    dateOfDeath : Number, //-4~10
    parentBrandID : Number,
    parentBrandName : String,
    parentCatID : Number,
    parentCompanyID : Number, //(1~9)   
    supplierView : [supplierViewSchema],
    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
})

//pv...
var supplierViewSchema = mongoose.Schema({
    currentUnitAverageCost : Number,
    currentPriceBM : Number,
    currentPriceEmall : Number,
    nextPriceBM : Number,
    nextPriceEmall : Number,
    composition : [Number],  //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    productionVolume : Number,
    initialInventory : [{  
        volume : Number,
        unitCost : Number,
        composition : [Number] 
    }], //length : TInventoryAgesTotal(0~4)
    supplierChannelView : [supplierChannelViewSchema] //length : TAllRetailersTotal(1~5)
})

var supplierChannelViewSchema = mongoose.Schema({
    salesVolume : [Number], // TMarketTotal(1~3)
})

var channelViewSchema = mongoose.Schema({
    channelMarketView : [channelMarketViewSchema] //length: TMarketsTotal(1~3)
})

//rv...
var channelMarketViewSchema = mongoose.Schema({
    closingInventory : [{  
        volume : String,
        unitCost : String,
        composition : [Number] 
    }], //length : TInventoryAgesTotal(0~4)
    currentUnitAcquisitionCost : Number, 
    salesVolume : Number,  
    shelfSpace : Number,
    marketPrice : Number,
    netMarketPrice : Number,
    promotionsDetails : {
        promo_Frequency : Number, //range: 0~52
        promo_Rate : Number //0~1
    }
})

var variantHistory = mongoose.model('variantHistory',variantHistoryInfoSchema);

exports.addInfos = function(options){
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
                   console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
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
            if( (infoGroup[idx].varName != '') && (infoGroup[idx].parentBrandName != '')){
              variantHistory.update({seminar: infoGroup[idx].seminar, 
                                  period: infoGroup[idx].period,
                                  parentBrandName: infoGroup[idx].parentBrandName,
                                  parentBrandID: infoGroup[idx].parentBrandID,
                                  parentCatID : infoGroup[idx].parentCatID,
                                  parentCompanyID : infoGroup[idx].parentCompanyID,
                                  varName : infoGroup[idx].varName,
                                  varID : infoGroup[idx].varID},
                                  {dateOfBirth: infoGroup[idx].dateOfBirth,
                                   dateOfDeath: infoGroup[idx].dateOfDeath,
                                   supplierView: infoGroup[idx].supplierView,
                                   channelView: infoGroup[idx].channelView},
                                    {upsert: true},
                                    function(err, numberAffected, raw){
                                      if(err) deferred.reject({msg:err, options: options});       
                                      idx--;
                                      if(idx >= 0){
                                        singleUpdate(idx);
                                      } else {
                                        currentPeriod--;
                                        if (currentPeriod >= startFrom) {
                                           sendRequest(currentPeriod);
                                        } else {
                                           deferred.resolve({msg:'variantHistoryInfo(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                        }
                                      }                           
                                    });   

            } else {
                idx--;
                if(idx >= 0){
                    singleUpdate(idx);
                } else {
                    currentPeriod--;
                    if (currentPeriod >= startFrom) {
                       sendRequest(currentPeriod);
                    } else {
                       deferred.resolve({msg:'variantHistoryInfo(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                    }
                }
            } 
          })(infoGroup.length-1);
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom variantHistoryInfo import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.getVariantHistory=function(req,res,next){
  variantHistory.findOne({
    seminar:req.params.seminar,
    period:req.params.period,
    parentBrandName:req.params.parentBrandName,
    varName:req.params.varName
  },function(err,doc){
    if(err){
      next (new Error(err));
    }
    if(!doc){
      res.send(404,'cannot find the doc');
    }else{
      res.header("Content-Type", "application/json; charset=UTF-8");                                
      res.statusCode = 200;
      res.send(doc);
    }
  })
}

