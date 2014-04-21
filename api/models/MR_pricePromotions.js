var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_pricePromotionsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    accountInfo : [accountInfoSchema]
})

var accountInfoSchema = mongoose.Schema({
    accountID : Number, //1~4:AccountMax
    promoFrequency : [Number], //0-Urban, 1-Rural, { saved as # of weeks }//Depth
    promoRate   : [Number], //0-Urban, 1-Rural, { saved as a decimal  }//Length
})


var MR_pricePromotions=mongoose.model('MR_pricePromotions',MR_pricePromotionsSchema);

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

         MR_pricePromotions.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {variantInfo: singleReport.variantInfo},
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

exports.addMR_pricePromotions=function(req,res,next){
    var newMR_pricePromotions=MR_pricePromotions({
        period : 0,
        seminar : 'MAY',
        variantInfo : [{
            variantName: '_A',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{},{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [10,15], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{
                accountID:2,
                promoFrequency : [20,30], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [25,25]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [10,15], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'ELAN2',
            parentCategoryID: 1,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{},{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'HLAN2',
            parentCategoryID: 2,
            parentCompanyID: 2, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{
                accountID:2,
                promoFrequency : [20,30], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [25,25]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'ELAN3',
            parentCategoryID: 1,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{},{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [10,15], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'HLAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{
                accountID:2,
                promoFrequency : [20,30], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [25,25]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [10,15], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{},{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{},{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [10,15], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{},{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'HLAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [20,30]
            },{},{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID:2,
                promoFrequency : [20,30], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [25,25]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_A',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID:2,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        },{
            variantName: '_B',
            parentBrandName: 'HLAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID:2,
                promoFrequency : [20,30], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [25,25]
            },{
                accountID:3,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            },{
                accountID:4,
                promoFrequency : [15,20], //0-Urban, 1-Rural, { saved as # of weeks }
                promoRate   : [15,20]
            }]
        }] 
    });
    newMR_pricePromotions.save(function(err) {
        if(!err){
            res.send(200,newMR_pricePromotions);
            console.log("created new GeneralReport:"+newMR_pricePromotions);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_pricePromotions=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_pricePromotions.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}