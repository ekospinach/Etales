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

//  modified by Hao, 2014 June 9th
//    f_RetailersShoppersShare          : [retailerKPIInfoSchema],
//    f_RetailersBMShoppersShare        : [retailerKPIInfoSchema],
//    f_RetailersAllShoppersShare       : [retailerKPIInfoSchema],

    //updated by Hao, 2014 July 10th
    f_GrossProfit : [marketResultSchema],
    f_GrossProfitMargin : [marketResultSchema],
    f_PortfolioStrength  : [supplierKPIExtendedInfoSchema],
    f_ShoppersShare : [shopperShareInfoSchema],

    //updated by Hao, 2014, Oct, 16, FinalScore    
    ffs_SuppliersAbsoluteValues    : [evaluationSupplierScoresSchema],
    ffs_SuppliersStandarisedValues : [evaluationSupplierScoresSchema], //       { not used in the current template }
    ffs_SuppliersFinalScore        : [supplierInfoSchema],
    ffs_RetailersAbsoluteValues    : [evaluationRetailerScoresSchema],
    ffs_RetailersStandarisedValues : [evaluationRetailerScoresSchema], // { not used in the current template }
    ffs_RetailersFinalScore        : [retailerInfoSchema],  
})  

// evaluation Idx:  { 1 = Incremental Market }
//                  { 2 = ROOB }
//                  { 3 = Portfolio Strength ( Suppliers ) / Relative Profitability ( Retailers }
//                  { 4 = Trade Strength ( Suppliers ) / Shoppers base ( Retailers ) }      
var evaluationSupplierScoresSchema = mongoose.Schema({
    supplierID : Number,
    evaluationIdx : Number, 
    value : Number,
})

var evaluationRetailerScoresSchema = mongoose.Schema({
    retailerID : Number,
    evaluationIdx : Number, 
    value : Number,
})

var negotiationsItemDetailsSchema = mongoose.Schema({
    categoryID : Number,
    totalValue : Number,
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
    topDays    : Number, 
    //0~12, this is used as multiplications of 15 days to cover - almost - the entire year
    //0 - corresponds to payment on delivery
    //1 - payment after 15 days,
    //2 - payment after 30 days,
    //3 - payment after 45 days,
    //....
    //12 - payment after 180 days.

    value      : Number   
})


var marketResultSchema = mongoose.Schema({
    categoryID : Number,
    period     : Number, 
    actorID    : Number, // TActors : 1 ~ (4+3), updated by Hao, 2014 July 10
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


//updated by Hao, 2014 July 10
var supplierKPIExtendedInfoSchema = mongoose.Schema({
    categoryID : Number,
    period     : Number,
    ownerID : Number, //1~6, 4 suppliers + 2 retailers 
    value      : Number,
})

//updated by Hao, 2014 July 10
var shopperShareInfoSchema = mongoose.Schema({
    marketID : Number,
    period : Number,
    storeID : Number, //1~(3+4), R1, R2, TT, S1, S2, S3, S4
    //added by Hao, 2014 Sept 3
    shopperKind : String,//BMS, NETIZENS, MIXED, ALLSHOPPERS
    categoryID : Number,
    value : Number,
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
                                // f_RetailersShoppersShare          : singleReport.f_RetailersShoppersShare,          
                                //updated by Hao, 2014 July 10th

                                f_GrossProfit       : singleReport.f_GrossProfit, 
                                f_GrossProfitMargin : singleReport.f_GrossProfitMargin, 
                                f_PortfolioStrength : singleReport.f_PortfolioStrength, 
                                f_ShoppersShare     : singleReport.f_ShoppersShare,

                                ffs_SuppliersAbsoluteValues    : singleReport.ffs_SuppliersAbsoluteValues,
                                ffs_SuppliersStandarisedValues : singleReport.ffs_SuppliersStandarisedValues, //       { not used in the current template }
                                ffs_SuppliersFinalScore        : singleReport.ffs_SuppliersFinalScore,
                                ffs_RetailersAbsoluteValues    : singleReport.ffs_RetailersAbsoluteValues,
                                ffs_RetailersStandarisedValues : singleReport.ffs_RetailersStandarisedValues, // { not used in the current template }
                                ffs_RetailersFinalScore        : singleReport.ffs_RetailersFinalScore,                               
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

exports.getFeedBack = function(req,res,next){
  BG_feedbackSlides.findOne({
    seminar:req.params.seminar,
    period:req.params.period
  },function(err,doc){
    if(err){
      return next(new Error(err));
    }
    if(doc){
      res.send(200,doc);
    }else{
      res.send(404,'fail');
    }
  })
}

