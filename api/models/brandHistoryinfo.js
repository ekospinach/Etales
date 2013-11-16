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
    awareness : [Number], //length: TMarketsDetails(1~2)
    socialNetworksScore : [{
        sentiment : Number,
        strength : Number
    }]    //length: TMarketsTotalDetails(1~3)
})

var channelViewSchema = mongoose.Schema({
    visibilityShare : [Number] //length: TMarketsTotalDetails(1~3)
})

var brandHistory = mongoose.model('brandHistory',brandHistoryInfoSchema);

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


exports.newDoc=function(req,res,next){
    var newDoc=new brandHistory({
        period : 0,
        seminar : "MAY",
        brandName : "EGEND1",
        brandID : 11,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 1,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[10,20],
            socialNetworksScore:[{
                sentiment:1,
                strength:1
            }]
        }],
        channelView:[{
            visibilityShare:[2,3,4]
        }]
    },{
        period : 0,
        seminar : "MAY",
        brandName : "EHAYA1",
        brandID : 12,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 1,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[20,30],
            socialNetworksScore:[{
                sentiment:2,
                strength:3
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]
    },{
        period : 0,
        seminar : "MAY",
        brandName : "ELAND1",
        brandID : 13,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 1,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[30,40],
            socialNetworksScore:[{
                sentiment:4,
                strength:5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]       
    },{
        period : 0,
        seminar : "MAY",
        brandName : "HEELY1",
        brandID : 11,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 2,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[35,45],
            socialNetworksScore:[{
                sentiment:4.5,
                strength:5.5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]        
    },{
        period : 0,
        seminar : "MAY",
        brandName : "HOTOO1",
        brandID : 12,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 2,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[25,35],
            socialNetworksScore:[{
                sentiment:4.5,
                strength:5.5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]         
    },{
        period : 0,
        seminar : "MAY",
        brandName : "HOLAY1",
        brandID : 13,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 2,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[55,25],
            socialNetworksScore:[{
                sentiment:4.5,
                strength:5.5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]        
    });
    newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('brandHistory1 insert');
        res.send(200,'insert success');
    })
}
