var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var brandHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    brandName : String,
    brandID : Number,
    dateOfBirth : Number, //-4~10
    dateOfDeath : Number, //-4~10
    parentCatID : Number,    
    parentCompanyID : Number, //(1~9)
    
    supplierView : [supplierViewSchema], 
    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
})

var supplierViewSchema = mongoose.Schema({
    //b...
    perception : [perceptionDataSchema], //length: TMarkets(1~2)
    awareness : [Number], //length: TMarketsDetails(1~2)
    socialNetworksScore : [{
        sentiment : Number,
        strength : Number
    }]    //length: TMarketsTotalDetails(1~3)
})

var perceptionDataSchema = mongoose.Schema({
    perceptionData : [Number] //length: TVarPerceptions (1~VariantDimsMaxFull) 
    //VariantDimsMaxFull = VariantDimsMax(3) + AllRetsMaxTotal(5);  { ... as above plus specific price perceptions at 
    //1-Ease of Use perception(Performance perception)
    //2-Quality perception(Gentleness perception)
    //3-Price Perception
})

var channelViewSchema = mongoose.Schema({
    visibilityShare : [Number] //length: TMarketsTotalDetails(1~3)
})

var brandHistory = mongoose.model('brandHistory',brandHistoryInfoSchema);

exports.getBrandHistory=function(req,res,next){
    brandHistory.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        brandName:req.params.brandName
    },function(err,doc){
        if(err){
            return next(new Error(err));
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

exports.getPeriodBrandHistory=function(req,res,next){
  brandHistory.find({
    seminar:req.params.seminar,
    period:req.params.period
  },function(err,docs){
    if(err){
      return next(new Error(err));
    }
    if(!docs){
      res.send(404,'cannot find the doc');
    }else{
      res.send(200,docs);
    }
  })
}

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
            if(infoGroup[idx].brandName != ''){
              brandHistory.update({seminar: infoGroup[idx].seminar, 
                                  period: infoGroup[idx].period,
                                  brandName: infoGroup[idx].brandName,
                                  brandID: infoGroup[idx].brandID,
                                  parentCatID : infoGroup[idx].parentCatID,
                                  parentCompanyID : infoGroup[idx].parentCompanyID},
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
                                           deferred.resolve({msg:'brandHistoryInfo(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
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
                       deferred.resolve({msg:'brandHistoryInfo(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                    }
                }
            } 
          })(infoGroup.length-1);
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom brandHistoryInfo import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

