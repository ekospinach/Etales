var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

var SCR_consolidatedProfitAndLossSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)

    //pdf1-5
    //Consolidated Profit & Loss statement, suppliers
    scrpl_Sales                                : [categoryInfoSchema], 
    scrpl_SalesChange                          : [categoryInfoSchema], 
    scrpl_MaterialCosts                        : [categoryInfoSchema], 
    scrpl_CostOfGoodsSold                      : [categoryInfoSchema], 
    scrpl_DiscontinuedGoodsCost                : [categoryInfoSchema], 
    scrpl_InventoryHoldingCost                 : [categoryInfoSchema], 
    scrpl_GrossProfit                          : [categoryInfoSchema], 
    scrpl_GrossProfitChange                    : [categoryInfoSchema], 
    scrpl_GrossProfitMargin                    : [categoryInfoSchema], 
    scrpl_TradeAndMarketing                    : [categoryInfoSchema], 
    scrpl_TradeAndMarketingAsPercentageOfSales : [categoryInfoSchema], 
    scrpl_GeneralExpenses                      : [categoryInfoSchema], 
    scrpl_Amortisation                         : [categoryInfoSchema], 
    scrpl_OperatingProfit                      : [categoryInfoSchema], 
    scrpl_OperatingProfitChange                : [categoryInfoSchema], 
    scrpl_OperatingProfitMargin                : [categoryInfoSchema], 
    scrpl_Interest                             : [categoryInfoSchema], 
    scrpl_Taxes                                : [categoryInfoSchema], 
    scrpl_ExceptionalItems                     : [categoryInfoSchema], 
    scrpl_NetProfit                            : [categoryInfoSchema], 
    scrpl_NetProfitChange                      : [categoryInfoSchema], 
    scrpl_NetProfitMargin                      : [categoryInfoSchema], 
    //---  Additional, used on the next two tables ( P&L per brand in B&M and onLine ) for the first columns --- 
    scrpl_AdvertisingOnLine                    : [categoryInfoSchema], 
    scrpl_AdvertisingOffLine                   : [categoryInfoSchema], 
    scrpl_TradeSupport                         : [categoryInfoSchema],  

    scrpl_InternalTransfersCost                : [categoryInfoSchema],
    scrpl_eMallCommission                      : [categoryInfoSchema],
    scrpl_ServiceCost                         : [categoryInfoSchema],    


    //P&L per brand in B&M and onLine
    scrb_Sales                                : [brandInfoSchema],
    scrb_SalesChange                          : [brandInfoSchema],
    scrb_SalesShareInCategory                 : [brandInfoSchema],
    //add to the report
    scrb_MaterialCosts                        : [brandInfoSchema],
    scrb_CostOfGoodsSold                      : [brandInfoSchema],
    scrb_DiscontinuedGoodsCost                : [brandInfoSchema],
    scrb_InventoryHoldingCost                 : [brandInfoSchema],
    scrb_GrossProfit                          : [brandInfoSchema],
    scrb_GrossProfitChange                    : [brandInfoSchema],
    //add to the report
    scrb_GrossProfitMargin                    : [brandInfoSchema],
    scrb_GrossProfitShareInCategory               : [brandInfoSchema],    
    scrb_TradeAndMarketing                    : [brandInfoSchema],
    scrb_AdvertisingOnLine                    : [brandInfoSchema],
    scrb_AdvertisingOffLine                   : [brandInfoSchema],
    scrb_TradeSupport                         : [brandInfoSchema],
    scrb_TradeAndMarketingAsPercentageOfSales : [brandInfoSchema],
    scrb_TradeAndMarketingShareInCategory     : [brandInfoSchema],
    scrb_GeneralExpenses                      : [brandInfoSchema],
    scrb_Amortisation                         : [brandInfoSchema],
    scrb_OperatingProfit                      : [brandInfoSchema],
    scrb_OperatingProfitChange                : [brandInfoSchema],
    scrb_OperatingProfitMargin                : [brandInfoSchema],
    scrb_OperatingProfitShareInCategory       : [brandInfoSchema],
    scrb_Interest                             : [brandInfoSchema],
    scrb_Taxes                                : [brandInfoSchema],
    scrb_ExceptionalItems                     : [brandInfoSchema],
    scrb_NetProfit                            : [brandInfoSchema],
    scrb_NetProfitChange                      : [brandInfoSchema],
    scrb_NetProfitMargin                      : [brandInfoSchema],
    scrb_NetProfitShareInCategory             : [brandInfoSchema],

    scrb_InternalTransfersCost                : [brandInfoSchema],
    scrb_eMallCommission                      : [brandInfoSchema],
    scrb_ServiceCost                         : [brandInfoSchema],    

    ////P&L per variant in B&M and onLine
    scrv_Sales                                : [variantInfoSchema],
    scrv_SalesChange                          : [variantInfoSchema],
    scrv_SalesShareInCategory                 : [variantInfoSchema],
    //add to the report
    scrv_MaterialCosts                        : [variantInfoSchema],
    scrv_CostOfGoodsSold                      : [variantInfoSchema],
    scrv_DiscontinuedGoodsCost                : [variantInfoSchema],
    scrv_InventoryHoldingCost                 : [variantInfoSchema],
    scrv_GrossProfit                          : [variantInfoSchema],
    scrv_GrossProfitChange                    : [variantInfoSchema],
    //add to the report
    scrv_GrossProfitMargin                    : [variantInfoSchema],
    scrv_GrossProfitShareInCategory               : [variantInfoSchema],    
    scrv_TradeAndMarketing                    : [variantInfoSchema],
    scrv_AdvertisingOnLine                    : [variantInfoSchema],
    scrv_AdvertisingOffLine                   : [variantInfoSchema],
    scrv_TradeSupport                         : [variantInfoSchema],
    scrv_TradeAndMarketingAsPercentageOfSales : [variantInfoSchema],
    scrv_TradeAndMarketingShareInCategory     : [variantInfoSchema],
    scrv_GeneralExpenses                      : [variantInfoSchema],
    scrv_Amortisation                         : [variantInfoSchema],
    scrv_OperatingProfit                      : [variantInfoSchema],
    scrv_OperatingProfitChange                : [variantInfoSchema],
    scrv_OperatingProfitMargin                : [variantInfoSchema],
    scrv_OperatingProfitShareInCategory       : [variantInfoSchema],
    scrv_Interest                             : [variantInfoSchema],
    scrv_Taxes                                : [variantInfoSchema],
    scrv_ExceptionalItems                     : [variantInfoSchema],
    scrv_NetProfit                            : [variantInfoSchema],
    scrv_NetProfitChange                      : [variantInfoSchema],
    scrv_NetProfitMargin                      : [variantInfoSchema],
    scrv_NetProfitShareInCategory             : [variantInfoSchema],

    scrv_InternalTransfersCost                : [variantInfoSchema],
    scrv_eMallCommission                      : [variantInfoSchema],
    scrv_ServiceCost                         : [variantInfoSchema],    
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //TCategoriesTotal : 1~3 
    value : [Number], //0-traditional-bm business 1-Internet-online 2-Total
})

var brandInfoSchema = mongoose.Schema({
    brandName                            : String,
    parentCategoryID                     : Number,
    value                                : [Number], //0-traditional, 1-Internet, 2-Total
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    value                                : [Number], //0-traditional, 1-Internet, 2-Total
})

var SCR_consolidatedProfitAndLoss=mongoose.model('SCR_consolidatedProfitAndLoss',SCR_consolidatedProfitAndLossSchema);

exports.addReports = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar + '&producerID=' + options.producerID
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

          SCR_consolidatedProfitAndLoss.update({seminar    : singleReport.seminar, 
                                            period     : singleReport.period,
                                            producerID : singleReport.producerID},
                                {
                                scrpl_Sales                                : singleReport.scrpl_Sales,                                
                                scrpl_SalesChange                          : singleReport.scrpl_SalesChange,
                                scrpl_MaterialCosts                        : singleReport.scrpl_MaterialCosts,                        
                                scrpl_CostOfGoodsSold                      : singleReport.scrpl_CostOfGoodsSold,                      
                                scrpl_DiscontinuedGoodsCost                : singleReport.scrpl_DiscontinuedGoodsCost,                
                                scrpl_InventoryHoldingCost                 : singleReport.scrpl_InventoryHoldingCost,                 
                                scrpl_GrossProfit                          : singleReport.scrpl_GrossProfit,                          
                                scrpl_GrossProfitChange                    : singleReport.scrpl_GrossProfitChange,                    
                                scrpl_GrossProfitMargin                    : singleReport.scrpl_GrossProfitMargin,                    
                                scrpl_TradeAndMarketing                    : singleReport.scrpl_TradeAndMarketing,                    
                                scrpl_TradeAndMarketingAsPercentageOfSales : singleReport.scrpl_TradeAndMarketingAsPercentageOfSales, 
                                scrpl_GeneralExpenses                      : singleReport.scrpl_GeneralExpenses,                      
                                scrpl_Amortisation                         : singleReport.scrpl_Amortisation,                        
                                scrpl_OperatingProfit                      : singleReport.scrpl_OperatingProfit,                      
                                scrpl_OperatingProfitChange                : singleReport.scrpl_OperatingProfitChange,                
                                scrpl_OperatingProfitMargin                : singleReport.scrpl_OperatingProfitMargin,                
                                scrpl_Interest                             : singleReport.scrpl_Interest,                             
                                scrpl_Taxes                                : singleReport.scrpl_Taxes,                                
                                scrpl_ExceptionalItems                     : singleReport.scrpl_ExceptionalItems,                     
                                scrpl_NetProfit                            : singleReport.scrpl_NetProfit,                            
                                scrpl_NetProfitChange                      : singleReport.scrpl_NetProfitChange,                      
                                scrpl_NetProfitMargin                      : singleReport.scrpl_NetProfitMargin,                      
                                scrpl_AdvertisingOnLine                    : singleReport.scrpl_AdvertisingOnLine,                   
                                scrpl_AdvertisingOffLine                   : singleReport.scrpl_AdvertisingOffLine,                   
                                scrpl_TradeSupport                         : singleReport.scrpl_TradeSupport,                         

                                scrpl_InternalTransfersCost                : singleReport.scrpl_InternalTransfersCost,
                                scrpl_eMallCommission                      : singleReport.scrpl_eMallCommission,
                                scrpl_ServiceCost                         : singleReport.scrpl_ServiceCost,                                  

                                scrb_Sales                                : singleReport.scrb_Sales,                              
                                scrb_SalesChange                          : singleReport.scrb_SalesChange,                        
                                scrb_SalesShareInCategory                 : singleReport.scrb_SalesShareInCategory,                
                                scrb_MaterialCosts                        : singleReport.scrb_MaterialCosts,                       
                                scrb_CostOfGoodsSold                      : singleReport.scrb_CostOfGoodsSold,                    
                                scrb_DiscontinuedGoodsCost                : singleReport.scrb_DiscontinuedGoodsCost,               
                                scrb_InventoryHoldingCost                 : singleReport.scrb_InventoryHoldingCost,                
                                scrb_GrossProfit                          : singleReport.scrb_GrossProfit,                         
                                scrb_GrossProfitChange                    : singleReport.scrb_GrossProfitChange,                   
                                scrb_GrossProfitMargin                    : singleReport.scrb_GrossProfitMargin,                   
                                scrb_GrossProfitShareInCategory               : singleReport.scrb_GrossProfitShareInCategory,              
                                scrb_TradeAndMarketing                    : singleReport.scrb_TradeAndMarketing,                   
                                scrb_AdvertisingOnLine                    : singleReport.scrb_AdvertisingOnLine,                   
                                scrb_AdvertisingOffLine                   : singleReport.scrb_AdvertisingOffLine,                  
                                scrb_TradeSupport                         : singleReport.scrb_TradeSupport,                        
                                scrb_TradeAndMarketingAsPercentageOfSales : singleReport.scrb_TradeAndMarketingAsPercentageOfSales,
                                scrb_TradeAndMarketingShareInCategory     : singleReport.scrb_TradeAndMarketingShareInCategory,    
                                scrb_GeneralExpenses                      : singleReport.scrb_GeneralExpenses,                     
                                scrb_Amortisation                         : singleReport.scrb_Amortisation,                        
                                scrb_OperatingProfit                      : singleReport.scrb_OperatingProfit,                     
                                scrb_OperatingProfitChange                : singleReport.scrb_OperatingProfitChange,               
                                scrb_OperatingProfitMargin                : singleReport.scrb_OperatingProfitMargin,               
                                scrb_OperatingProfitShareInCategory       : singleReport.scrb_OperatingProfitShareInCategory,      
                                scrb_Interest                             : singleReport.scrb_Interest,                            
                                scrb_Taxes                                : singleReport.scrb_Taxes,                               
                                scrb_ExceptionalItems                     : singleReport.scrb_ExceptionalItems,                    
                                scrb_NetProfit                            : singleReport.scrb_NetProfit,                           
                                scrb_NetProfitChange                      : singleReport.scrb_NetProfitChange,                     
                                scrb_NetProfitMargin                      : singleReport.scrb_NetProfitMargin,                     
                                scrb_NetProfitShareInCategory             : singleReport.scrb_NetProfitShareInCategory,            

                                scrb_InternalTransfersCost                : singleReport.scrb_InternalTransfersCost,
                                scrb_eMallCommission                      : singleReport.scrb_eMallCommission,
                                scrb_ServiceCost                         : singleReport.scrb_ServiceCost,                                 

                                scrv_Sales                                : singleReport.scrv_Sales,                               
                                scrv_SalesChange                          : singleReport.scrv_SalesChange,                         
                                scrv_SalesShareInCategory                 : singleReport.scrv_SalesShareInCategory,                
                                scrv_MaterialCosts                        : singleReport.scrv_MaterialCosts,                       
                                scrv_CostOfGoodsSold                      : singleReport.scrv_CostOfGoodsSold,                     
                                scrv_DiscontinuedGoodsCost                : singleReport.scrv_DiscontinuedGoodsCost,               
                                scrv_InventoryHoldingCost                 : singleReport.scrv_InventoryHoldingCost,                
                                scrv_GrossProfit                          : singleReport.scrv_GrossProfit,                         
                                scrv_GrossProfitChange                    : singleReport.scrv_GrossProfitChange,                   
                                scrv_GrossProfitMargin                    : singleReport.scrv_GrossProfitMargin,                   
                                scrv_GrossProfitShareInCategory           : singleReport.scrv_GrossProfitShareInCategory,              
                                scrv_TradeAndMarketing                    : singleReport.scrv_TradeAndMarketing,                   
                                scrv_AdvertisingOnLine                    : singleReport.scrv_AdvertisingOnLine,                   
                                scrv_AdvertisingOffLine                   : singleReport.scrv_AdvertisingOffLine,                  
                                scrv_TradeSupport                         : singleReport.scrv_TradeSupport,                        
                                scrv_TradeAndMarketingAsPercentageOfSales : singleReport.scrv_TradeAndMarketingAsPercentageOfSales,
                                scrv_TradeAndMarketingShareInCategory     : singleReport.scrv_TradeAndMarketingShareInCategory,    
                                scrv_GeneralExpenses                      : singleReport.scrv_GeneralExpenses,                     
                                scrv_Amortisation                         : singleReport.scrv_Amortisation,                        
                                scrv_OperatingProfit                      : singleReport.scrv_OperatingProfit,                     
                                scrv_OperatingProfitChange                : singleReport.scrv_OperatingProfitChange,               
                                scrv_OperatingProfitMargin                : singleReport.scrv_OperatingProfitMargin,               
                                scrv_OperatingProfitShareInCategory       : singleReport.scrv_OperatingProfitShareInCategory,      
                                scrv_Interest                             : singleReport.scrv_Interest,                            
                                scrv_Taxes                                : singleReport.scrv_Taxes,                               
                                scrv_ExceptionalItems                     : singleReport.scrv_ExceptionalItems,                    
                                scrv_NetProfit                            : singleReport.scrv_NetProfit,                           
                                scrv_NetProfitChange                      : singleReport.scrv_NetProfitChange,                     
                                scrv_NetProfitMargin                      : singleReport.scrv_NetProfitMargin,                     
                                scrv_NetProfitShareInCategory             : singleReport.scrv_NetProfitShareInCategory,            

                                scrv_InternalTransfersCost                : singleReport.scrv_InternalTransfersCost,
                                scrv_eMallCommission                      : singleReport.scrv_eMallCommission,
                                scrv_ServiceCost                         : singleReport.scrv_ServiceCost,                                  
                                },
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg: options.schemaName + ' (seminar:' + options.seminar + ', producer:' + options.producerID+ ') import done. from period ' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   

        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom add ' + options.schemaName + ': ' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.getScrplSales = function(req, res, next) {
    SCR_consolidatedProfitAndLoss.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            return next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            res.send(200, doc.scrpl_Sales[req.params.categoryID - 1].value);
        }
    })
}

exports.getSCR_consolidatedProfitAndLoss = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'producerID': req.params.producerID
    };
    SCR_consolidatedProfitAndLoss.find(data, function(err, docs) {
        if (err) {
            return next(new Error(err));
        }
        if (docs) {
            res.send(200, docs);
        } else {
            res.send(404, 'failed');
        }
    })
}







