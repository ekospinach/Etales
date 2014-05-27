var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var BG_feedbackSlidesSchema = mongoose.Schema({
    period                            : Number,
    seminar                           : String,
    f_DiscountsValue                  : [negotiationsItemDetailsSchema],
    f_PerformanceBonusesValue         : [negotiationsItemDetailsSchema],
    f_OtherCompensationsValue         : [negotiationsItemDetailsSchema],
    f_TransactionsPerTOP              : [transactionsPerTOPSchema],
    f_MarketSalesVolume               : [marketResultSchema],
    f_MarketSalesValue                : [marketResultSchema],
    f_VolumeMarketShares              : [marketResultSchema],
    f_ValueMarketShares               : [marketResultSchema],
    f_OperatingProfit                 : [marketResultSchema],
    f_OperatingProfitMargin           : [marketResultSchema],
    f_NetProfit                       : [marketResultSchema],
    f_NetProfitMargin                 : [marketResultSchema],
    f_ShelfSpaceAllocation            : [marketResultSchema],
    f_TradeSpendingEffectiveness      : [supplierKPIInfoSchema],
    f_MarketingSpendingEffectiveness  : [supplierKPIInfoSchema],
    f_PortfolioStrength               : [supplierKPIInfoSchema],
    f_SuppliersBMValueSalesShare      : [supplierKPIInfoSchema],
    f_SuppliersBMVolumeSalesShare     : [supplierKPIInfoSchema],
    f_SuppliersBMShareOfShoppers      : [supplierKPIInfoSchema],
    f_SuppliersOnlineValueSalesShare  : [supplierKPIInfoSchema],
    f_SuppliersOnlineVolumeSalesShare : [supplierKPIInfoSchema],
    f_SuppliersOnlineShareOfShoppers  : [supplierKPIInfoSchema],
    f_RetailersValueRotationIndex     : [retailerKPIInfoSchema],
    f_RetailersVolumeRotationIndex    : [retailerKPIInfoSchema],
    f_RetailersProfitabilityIndex     : [retailerKPIInfoSchema],
    f_RetailersStocksCover            : [retailerKPIInfoSchema],
    f_RetailersShoppersShare          : [retailerKPIInfoSchema],
})

var negotiationsItemDetailsSchema = mongoose.Schema({
    categoryID : Number,
    fcni_SuppliersCost       : [supplierInfoSchema],
    fcni_RetailersBenefits   : [retailerInfoSchema],
})

var supplierInfoSchema = mongoose.Schema({
    supplierID : Number,
    value : Number
})

var retailerInfoSchema = mongoose.Schema({
    retailerID : Number,
    value : Number
})

var transactionsPerTOPSchema = mongoose.Schema({
    categoryID : Number,
    topDays    : Number, //0~24, this is used as multiplications of 15 days to cover - almost - the entire year
    value      : Number   
})


var marketResultSchema = mongoose.Schema({
    categoryID : Number,
    period     : Number, 
    actorID    : Number, //TActiveActors : 1~(3+2)
    value      : Number
})

var supplierKPIInfoSchema = mongoose.Schema({
    categoryID : Number,
    period     : Number,
    supplierID : Number, //1~3
    value      : Number,
})

var retailerKPIInfoSchema = mongoose.Schema({
    categoryID : Number,
    marketID   : Number,
    period     : Number,
    retailerID : Number, //1~2
    value      : Number,
})

var BG_feedbackSlides = mongoose.model('BG_feedbackSlides', BG_feedbackSlidesSchema);

exports.addInfos = function(options){
    console.log('active addinfos');
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

    console.log('BG_feedbackSlides shoot:' + util.inspect(options, {depth:null}));
   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar 
      };

      console.log('BG_feedbackSlides shoot:' + reqOptions.cgiPath);
      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);

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

         BG_feedbackSlides.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {
                                f_DiscountsValue                  : singleReport.f_DiscountsValue,                  
                                f_PerformanceBonusesValue         : singleReport.f_PerformanceBonusesValue,         
                                f_OtherCompensationsValue         : singleReport.f_OtherCompensationsValue,         
                                f_TransactionsPerTOP              : singleReport.f_TransactionsPerTOP,              
                                f_MarketSalesVolume               : singleReport.f_MarketSalesVolume,               
                                f_MarketSalesValue                : singleReport.f_MarketSalesValue,                
                                f_VolumeMarketShares              : singleReport.f_VolumeMarketShares,              
                                f_ValueMarketShares               : singleReport.f_ValueMarketShares,               
                                f_OperatingProfit                 : singleReport.f_OperatingProfit,                 
                                f_OperatingProfitMargin           : singleReport.f_OperatingProfitMargin,           
                                f_NetProfit                       : singleReport.f_NetProfit,                      
                                f_NetProfitMargin                 : singleReport.f_NetProfitMargin,                 
                                f_ShelfSpaceAllocation            : singleReport.f_ShelfSpaceAllocation,            
                                f_TradeSpendingEffectiveness      : singleReport.f_TradeSpendingEffectiveness,      
                                f_MarketingSpendingEffectiveness  : singleReport.f_MarketingSpendingEffectiveness,  
                                f_PortfolioStrength               : singleReport.f_PortfolioStrength,              
                                f_SuppliersBMValueSalesShare      : singleReport.f_SuppliersBMValueSalesShare,      
                                f_SuppliersBMVolumeSalesShare     : singleReport.f_SuppliersBMVolumeSalesShare,     
                                f_SuppliersBMShareOfShoppers      : singleReport.f_SuppliersBMShareOfShoppers,      
                                f_SuppliersOnlineValueSalesShare  : singleReport.f_SuppliersOnlineValueSalesShare,  
                                f_SuppliersOnlineVolumeSalesShare : singleReport.f_SuppliersOnlineVolumeSalesShare, 
                                f_SuppliersOnlineShareOfShoppers  : singleReport.f_SuppliersOnlineShareOfShoppers,  
                                f_RetailersValueRotationIndex     : singleReport.f_RetailersValueRotationIndex,     
                                f_RetailersVolumeRotationIndex    : singleReport.f_RetailersVolumeRotationIndex,    
                                f_RetailersProfitabilityIndex     : singleReport.f_RetailersProfitabilityIndex,     
                                f_RetailersStocksCover            : singleReport.f_RetailersStocksCover,            
                                f_RetailersShoppersShare          : singleReport.f_RetailersShoppersShare,          
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

